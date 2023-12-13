import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../auth";

export default function useGetDonor() {
  const [brainDeathData, setBrainDeathData] = useState([]);

  const fetchBrainDeathData = async () => {
    const colRef = collection(db, "reportbraindeath");
    const querySnapshot = await getDocs(colRef);
    const fetchedItems = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      unique: doc.id,
    }));
    setBrainDeathData(fetchedItems);
  };

  useEffect(() => {
    fetchBrainDeathData();
  }, []);

  return { brainDeathData };
}
