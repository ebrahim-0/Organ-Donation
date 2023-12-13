import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../auth";

export default function useGetRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    const colRef = collection(db, "requestorgan");
    const querySnapshot = await getDocs(colRef);
    const fetchedItems = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      unique: doc.id,
    }));
    setRequests(fetchedItems);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return { requests };
}
