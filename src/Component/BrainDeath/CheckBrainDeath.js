import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { MdDateRange } from "react-icons/md";
import { BiLoader, BiUser } from "react-icons/bi";
import { BsLink45Deg } from "react-icons/bs";
import { GiInternalOrgan } from "react-icons/gi";
import { db } from "../../auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function CheckBrainDeath() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  const fetchData = async () => {
    const colRef = collection(db, "reportbraindeath");
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

  const deleteItem = async (val) => {
    try {
      await deleteDoc(doc(db, "reportbraindeath", val.unique));
      await deleteDoc(doc(db, "notification", val.notiId));

      fetchData();
      toast.success("Brain Death Deleted successfully.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      setTimeout(() => {
        navigate("/checkbraindeath");
      }, 1000);
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <>
      {data.length > 0 ? (
        <div className="w-3/4 ml-auto mr-[70px] overflow-auto">
          <table className="w-full table-auto bg-white rounded-md">
            <thead>
              <tr>
                <th className="border-b-2 border-r-2 p-4 pb-3">
                  <span className="flex items-center gap-4">
                    <MdDateRange className="text-xl" />
                    Death_Date
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
                    HLA
                  </span>
                </th>
                <th className="border-b-2 p-4 pb-3">
                  <span className="flex items-center gap-4">Delete</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data
                .sort(
                  (a, b) =>
                    new Date(b.deathDate).getTime() -
                    new Date(a.deathDate).getTime(),
                )
                .map((val, i) => (
                  <tr key={i} className="cursor-pointer">
                    <td className="border-b-2 border-r-2 p-4 pb-3">
                      {val.deathDate}
                    </td>
                    <td className="border-b-2 border-r-2 p-4 pb-3">{val.id}</td>
                    <td className="border-b-2 border-r-2 p-4 pb-3">
                      {val.organType}
                    </td>

                    <td className="border-b-2 border-r-2 p-4 pb-3">
                      {val.bloodType}
                    </td>
                    <td className="border-b-2 border-r-2 p-2 pb-3">
                      {val.hla}
                    </td>
                    <td className="border-b-2 border-r-2 p-2 pb-3">
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded-md"
                        onClick={() => deleteItem(val)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-96 mx-auto">
          No Data Found
        </div>
      )}
      <ToastContainer />
    </>
  );
}
