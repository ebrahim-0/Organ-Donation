import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../auth";
import OverView from "./../OverView";

export default function Home() {
  const [data, setData] = useState([]);
  const [role, setRole] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      const colRef = collection(db, "roles");
      const querySnapshot = await getDocs(colRef);
      const fetchedItems = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));
      setData(fetchedItems);
    };

    fetchData();
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        data.forEach((data) => {
          if (data.id === user.uid) {
            setRole(data.role);
          }
        });
      }
    });
  }, [role, auth, data]);

  return user ? (
    <OverView />
  ) : (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-start m-8 gap-4">
        <h1 className="font-medium text-xl md:text-3xl">Welcome to</h1>
        <h1 className="font-medium text-xl md:text-3xl">
          Organ Donation Matchmaker System
        </h1>

        {!user && (
          <h2 className="font-medium text-xl md:text-3xl">
            Please click on the link below to login to your account
          </h2>
        )}
      </div>

      <Link
        to={"/logintransplant"}
        className="py-2 px-8 md:px-12 bg-[#0F58B6] text-slate-50 rounded-[10px] mt-9 text-sm md:text-base w-96 text-center"
      >
        Login for Transplant Coordinator
      </Link>
      <Link
        to={"/logindonor"}
        className="py-2 px-8 md:px-12 bg-[#0F58B6] text-slate-50 rounded-[10px] mt-9 text-sm md:text-base w-96 text-center"
      >
        Login for ICU Doctor
      </Link>
    </div>
  );
}
