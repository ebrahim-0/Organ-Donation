import { useEffect, useRef, useState } from "react";
import { addDoc, updateDoc } from "firebase/firestore";
import { collection, doc, deleteDoc, getDocs } from "firebase/firestore";
import { MdDateRange } from "react-icons/md";
import { BiLoader, BiUser } from "react-icons/bi";
import { BsLink45Deg } from "react-icons/bs";
import { GiInternalOrgan } from "react-icons/gi";
import { db } from "../../auth";
import VerificationInput from "react-verification-input";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "noval";
import useGetRole from "../../Hook/useGetRole";

export default function ReportBrainDeath() {
  const { role } = useGetRole();

  const navigate = useNavigate();
  const [search, setSearch] = useState(false);

  const { dispatch } = useDispatch();

  const [id, setId] = useState("");
  const [validId, setValidId] = useState(false);

  const [data, setData] = useState([]);
  const idRef = useRef();

  const [hlaNeeded, setHlaNeeded] = useState(false);
  const [hla, setHla] = useState(0);

  const handleRadioChange = (event) => {
    setHlaNeeded(event.target.value === "true" ? true : false);
  };
  const [result, setResult] = useState([]);

  const SubmitHandle = (e) => {
    e.preventDefault();
    setSearch(true);
  };

  const fetchData = async () => {
    const colRef = collection(db, "donor");
    const querySnapshot = await getDocs(colRef);
    const fetchedItems = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      unique: doc.id,
    }));
    setData(fetchedItems);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filteredData = data.filter((val) => val.id === id);
    setResult((prevResult) => [...prevResult, ...filteredData]);
  }, [data, id]);

  const reportBrainDeath = async () => {
    const colRef = collection(db, "reportbraindeath");

    try {
      dispatch({ ...result[0] }, "donor");

      const docRef = await addDoc(colRef, result[0]);

      const colRefTwo = collection(db, "notification");

      const notiDocRef = await addDoc(colRefTwo, result[0]);

      updateDoc(doc(db, "reportbraindeath", docRef.id), {
        ...result[0],

        organ: result[0].organType,
        hla: hla,
        deathDate: new Date().toLocaleDateString(),
        createAt: new Date().toLocaleString(),
        unique: docRef.id,
        notiId: notiDocRef.id,
      });

      await updateDoc(doc(db, "notification", notiDocRef.id), {
        ...data,
        new: true,
        role: role,
        organ: result[0].organType,
        notiAt: new Date().toLocaleString(),
        message: "New Donor Has Been Added To Donate",
        unique: docRef.id,
        notiId: notiDocRef.id,
      });

      await deleteDoc(doc(db, "donor", result[0].unique));
      toast.success("Brain Death Reported successfully.", {
        position: toast.POSITION.TOP_RIGHT,
      });

      setTimeout(() => {
        navigate("/overview");
      }, 2000);
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <>
      {search ? (
        result.length > 0 ? (
          <>
            <div className="w-3/4 ml-auto mr-[70px] overflow-auto">
              <table className="w-full table-auto bg-white rounded-md">
                <thead>
                  <tr>
                    <th className="border-b-2 border-r-2 p-4 pb-3">
                      <span className="flex items-center gap-4">
                        <MdDateRange className="text-xl" />
                        Birth_Date
                      </span>
                    </th>
                    <th className="border-b-2 border-r-2 p-4 pb-3">
                      <span className="flex items-center gap-4">
                        <BiUser className="text-xl" />
                        ID
                      </span>
                    </th>
                    <th className="border-b-2 border-r-2 p-4 pb-3">
                      <span className="flex items-center gap-4">
                        <GiInternalOrgan className="text-xl" />
                        Organ
                      </span>
                    </th>
                    <th className="border-b-2 border-r-2 p-4 pb-3">
                      <span className="flex items-center gap-4">
                        <BiLoader className="text-xl" />
                        Blood_Type
                      </span>
                    </th>
                    <th className="border-b-2 p-4 pb-3">
                      <span className="flex items-center gap-4">
                        <BsLink45Deg className="text-xl" />
                        Family_Contact
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.map((val, i) => (
                    <tr key={i} className="cursor-pointer">
                      <td className="border-b-2 border-r-2 p-4 pb-3">
                        {val.birthDate}
                      </td>
                      <td className="border-b-2 border-r-2 p-4 pb-3">
                        {val.id}
                      </td>
                      <td className="border-b-2 border-r-2 p-4 pb-3">
                        {val.organType}
                      </td>
                      <td className="border-b-2 border-r-2 p-4 pb-3">
                        {val.bloodType}
                      </td>
                      <td className="border-b-2 border-r-2 p-2 pb-3">
                        {val.phoneNumber}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <form
              className="flex flex-col md:flex-row items-center gap-7 justify-around my-16 w-3/4 ml-auto mr-[70px]"
              onSubmit={(e) => {
                e.preventDefault();
                reportBrainDeath();
              }}
            >
              <label className={"flex items-center gap-1"}>
                Yes
                <input
                  type={"radio"}
                  name={"hla"}
                  value={"true"}
                  onChange={handleRadioChange}
                />
                No
                <input
                  type={"radio"}
                  name={"hla"}
                  value={"false"}
                  onChange={handleRadioChange}
                />
              </label>

              {hlaNeeded && (
                <label>
                  HLA
                  <input
                    required
                    min="6"
                    max="8"
                    value={hla}
                    onChange={(e) => setHla(Math.round(e.target.value))}
                    type="number"
                    className="w-[300px] h-[30px] rounded-md border-2 border-[#96bbec] outline-0 pl-2 ml-20"
                    placeholder="HLA"
                  />
                </label>
              )}

              <button className="py-2 px-12 bg-[#0F58B6] text-slate-50 rounded-[10px]">
                Report
              </button>
            </form>
          </>
        ) : (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-96 mx-auto">
            No Data Found
          </div>
        )
      ) : (
        <>
          <form
            className="flex flex-col md:flex-row gap-20 w-[300px] md:w-[650px] mx-auto"
            onSubmit={SubmitHandle}
          >
            <label className="flex justify-between" required>
              ID:&nbsp;
              <VerificationInput
                ref={idRef}
                validChars="0-9"
                length={10}
                placeholder=""
                onChange={() => {
                  setId(idRef.current.value);
                  if (id.length >= 9) {
                    setValidId(true);
                  }
                }}
                classNames={{
                  container: "container",
                  character: "character",
                }}
              />
            </label>
            <button
              disabled={!validId ? true : false}
              className="py-2 px-12 w-fit mx-auto bg-[#0F58B6] text-slate-50 rounded-[10px]"
            >
              Search
            </button>
          </form>
          <div className="flex flex-col md:flex-row items-center gap-14 mt-20 pt-12 w-[300px] md:w-[700px] mx-auto border-t-4 border-[#0F58B6]">
            <p className="text-xl">Notify for a brain-dead without consent</p>
            <button
              className="py-2 px-12 w-fit mx-auto md:mr-0 bg-[#0F58B6] text-slate-50 rounded-[10px]"
              onClick={() => {
                navigate("/addnewbraindeath");
              }}
            >
              Report
            </button>
          </div>
        </>
      )}
      <ToastContainer />
    </>
  );
}
