import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../auth";
import { onAuthStateChanged } from "firebase/auth";

export default function useGetRole() {
  const [data, setData] = useState([]);
  const [role, setRole] = useState("");

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
  }, [role, data]);

  return { role };
}
