import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../auth";

export default function useGetMatched() {
  const [matched, setMatched] = useState([]);

  const fetchMatched = async () => {
    const colRef = collection(db, "matched");
    const querySnapshot = await getDocs(colRef);
    const fetchedItems = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      matchId: doc.id,
    }));
    setMatched(fetchedItems);
  };

  useEffect(() => {
    fetchMatched();
  }, []);

  return { matched };
}
