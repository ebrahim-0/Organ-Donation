import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import VerificationInput from "react-verification-input";
import { db } from "../../auth";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useDispatch } from "noval";
import useGetRole from "../../Hook/useGetRole";

export default function AddNewBrainDeath() {
  const navigate = useNavigate();

  const auth = getAuth();
  const user = auth.currentUser;

  const { role } = useGetRole();

  const { dispatch } = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    id: "",
    organType: "",
    birthDate: "",
    bloodType: "",
    hla: "",
  });

  const [validId, setValidId] = useState(false);

  const idRef = useRef();

  const colRef = collection(db, "reportbraindeath");

  useEffect(() => {
    if (formData?.id?.length === 10) {
      const checkIfIdExists = async () => {
        if (formData.id) {
          const querySnapshot = await getDocs(
            query(colRef, where("id", "==", formData.id)),
          );
          setValidId(querySnapshot.empty);
        }
      };

      checkIfIdExists();
    }
  }, [formData.id, colRef]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validId) {
      toast.error(
        "This ID is already registered. Please use a different one.",
        {
          position: toast.POSITION.TOP_RIGHT,
        },
      );
      return;
    }

    try {
      if (formData.organType === "All Organs") {
        const data = {
          name: formData.name,
          bloodType: formData.bloodType,
          birthDate: formData.birthDate,
          id: formData.id,
          hla: formData.hla,
          deathDate: new Date().toLocaleString(),
          userId: user.uid,
          notiAt: new Date().toLocaleString(),
        };
        const docRef = await addDoc(colRef, data);
        const colRefTwo = collection(db, "notification");

        const notiDocRef = await addDoc(colRefTwo, data);

        updateDoc(doc(db, "reportbraindeath", docRef.id), {
          ...data,
          organType: "All Organs",
          organ: "All Organs",
          notiId: notiDocRef.id,
          unique: docRef.id,
        });

        dispatch(
          {
            ...data,
            organType: "All Organs",
            organ: "All Organs",
            notiId: notiDocRef.id,

            unique: docRef.id,
          },
          "donor",
        );

        await updateDoc(doc(db, "notification", notiDocRef.id), {
          ...data,
          new: true,
          role: role,
          organType: "All Organs",
          organ: "All Organs",
          notiAt: new Date().toLocaleString(),
          message: "New Donor Has Been Added To Donate",
          unique: docRef.id,
          notiId: notiDocRef.id,
        });

        toast.success("Brain Death Reported successfully.", {
          position: toast.POSITION.TOP_RIGHT,
        });

        setTimeout(() => {
          navigate("/overview");
        }, 2000);
      } else if (formData.organType === "Kidney") {
        const data = {
          name: formData.name,
          bloodType: formData.bloodType,
          birthDate: formData.birthDate,
          id: formData.id,
          hla: formData.hla,
          deathDate: new Date().toLocaleDateString(),
          userId: user.uid,
          notiAt: new Date().toLocaleString(),
        };

        const docRef1 = await addDoc(colRef, data);
        const colRefTwo = collection(db, "notification");

        const notiDocRef = await addDoc(colRefTwo, data);

        updateDoc(doc(db, "reportbraindeath", docRef1.id), {
          ...data,
          organType: "Kidney",
          organ: "Kidney",
          notiId: notiDocRef.id,
          unique: docRef1.id,
        });

        dispatch(
          {
            ...data,

            organType: "Kidney",
            organ: "Kidney",
            notiId: notiDocRef.id,

            unique: docRef1.id,
          },
          "donor",
        );

        await updateDoc(doc(db, "notification", notiDocRef.id), {
          ...data,
          new: true,
          role: role,
          message: "New Donor Has Been Added To Donate",
          notiAt: new Date().toLocaleString(),
          organType: "Kidney",
          organ: "Kidney",
          notiId: notiDocRef.id,
          unique: docRef1.id,
          test: "test",
        });

        toast.success("Brain Death Reported successfully.", {
          position: toast.POSITION.TOP_RIGHT,
        });

        setTimeout(() => {
          navigate("/overview");
        }, 2000);
      } else if (formData.organType === "Liver") {
        const data = {
          name: formData.name,
          bloodType: formData.bloodType,
          birthDate: formData.birthDate,
          id: formData.id,
          organType: formData.organType,
          deathDate: new Date().toLocaleDateString(),
          userId: user.uid,
          hla: formData.organType === "Kidney" ? formData.hla : "",
          notiAt: new Date().toLocaleString(),
        };

        const docRef = await addDoc(colRef, data);

        const colRefTwo = collection(db, "notification");

        const notiDocRef = await addDoc(colRefTwo, data);

        dispatch(
          {
            ...data,
            organType: "Liver",
            organ: "Liver",
            notiId: notiDocRef.id,
            unique: docRef.id,
          },
          "donor",
        );

        updateDoc(doc(db, "reportbraindeath", docRef.id), {
          ...data,

          organType: "Liver",
          organ: "Liver",
          notiId: notiDocRef.id,
          unique: docRef.id,
        });

        await updateDoc(doc(db, "notification", notiDocRef.id), {
          ...data,
          new: true,
          role: role,
          notiAt: new Date().toLocaleString(),
          organType: "Liver",
          organ: "Liver",
          message: "New Donor Has Been Added To Donate",
          unique: docRef.id,
          notiId: notiDocRef.id,
        });

        toast.success("Brain Death Reported successfully.", {
          position: toast.POSITION.TOP_RIGHT,
        });

        setTimeout(() => {
          navigate("/overview");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form
        className="flex flex-col gap-9 w-[350px] md:w-[500px] mx-auto -mt-9"
        onSubmit={handleSubmit}
      >
        <label className="flex justify-between">
          Name:
          <input
            value={formData.name}
            required
            placeholder="Name"
            type="text"
            className="w-40 md:w-64 h-[30px] rounded-md border-2 border-[#96bbec] outline-0 pl-2 pr-[26px]"
            onChange={(e) =>
              setFormData((formData) => ({
                ...formData,
                name: e.target.value,
              }))
            }
          />
        </label>

        <label className="flex justify-between" required>
          ID:
          <VerificationInput
            required
            validChars="0-9"
            length={10}
            placeholder=""
            ref={idRef}
            value={formData.id}
            onChange={() => {
              setFormData((formData) => ({
                ...formData,
                id: idRef.current.value,
              }));

              if (formData.id.length >= 9) {
                setValidId(true);
              }
            }}
            classNames={{
              container: "container",
              character: "character",
            }}
          />
        </label>

        <label className="flex justify-between">
          Organ_Type:
          <select
            required
            defaultValue={formData.organType || "Organ Type"}
            className="w-40 md:w-64 h-[30px] rounded-md border-2 border-[#96bbec] outline-0 pl-2 pr-[26px]"
            onChange={(e) =>
              setFormData((formData) => ({
                ...formData,
                organType: e.target.value,
              }))
            }
          >
            <option disabled value={"Organ Type"}>
              Organ Type
            </option>
            <option value={"All Organs"}>All Organs</option>
            <option value={"Kidney"}>Kidney</option>
            <option value={"Liver"}>Liver</option>
          </select>
        </label>

        <label className="flex justify-between">
          Birth date:
          <input
            value={formData.birthDate}
            required
            onClick={(e) => e.target.showPicker()}
            max={new Date().toISOString().split("T")[0]}
            type="date"
            className="w-40 md:w-64 h-[30px] rounded-md border-2 border-[#96bbec] outline-0 pl-2 pr-[26px]"
            onChange={(e) =>
              setFormData((formData) => ({
                ...formData,
                birthDate: e.target.value,
              }))
            }
          />
        </label>

        <label className="flex justify-between">
          Blood_Type:
          <select
            required
            defaultValue={formData.bloodType || "Blood Type"}
            className="w-40 md:w-64 h-[30px] rounded-md border-2 border-[#96bbec] outline-0 pl-2 pr-[26px]"
            onChange={(e) =>
              setFormData((formData) => ({
                ...formData,
                bloodType: e.target.value,
              }))
            }
          >
            <option disabled value={"Blood Type"}>
              Blood Type
            </option>
            <option value={"A"}>A</option>
            <option value={"B"}>B</option>
            <option value={"AB"}>AB</option>
            <option value={"O"}>O</option>
          </select>
        </label>

        <label className="flex justify-between">
          HLA:
          <input
            value={formData.hla}
            required
            min="6"
            max="8"
            placeholder="HLA"
            type="number"
            className="w-40 md:w-64 h-[30px] rounded-md border-2 border-[#96bbec] outline-0 pl-2 pr-[26px]"
            onChange={(e) =>
              setFormData((formData) => ({
                ...formData,
                hla: e.target.value,
              }))
            }
            onInput={(e) => {
              e.target.value = Math.round(e.target.value);
            }}
          />
        </label>

        <div className="mt-16 mb-10 pt-9 border-t-[3px] border-[#0F58B6]">
          <button
            className="py-2 px-12 w-fit mx-auto bg-transparent text-[#0F58B6] rounded-[10px] border-[#0F58B6]  border-2 float-left"
            onClick={() => {
              setFormData((formData) => ({
                name: "",
                id: "",
                organType: "",
                birthDate: "",
                bloodType: "",
                hla: "",
              }));
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              !formData.name ||
              !formData.id ||
              !formData.organType ||
              !formData.birthDate ||
              !formData.bloodType ||
              !formData.hla
            }
            className="py-2 px-12 w-fit mx-auto bg-[#0F58B6] text-slate-50 rounded-[10px] float-right focus:outline-none focus:border-blue-300 focus:shadow-outline disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </form>
      <ToastContainer />
    </>
  );
}
