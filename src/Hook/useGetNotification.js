/* eslint-disable react-hooks/exhaustive-deps */
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../auth";

export default function useGetNotification() {
  const [notification, setNotification] = useState([]);

  const [newNotification, setNewNotification] = useState(0);

  const fetchNotification = async () => {
    const colRef = collection(db, "notification");
    const querySnapshot = await getDocs(colRef);
    const fetchedItems = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
    setNotification(fetchedItems);
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  useEffect(() => {
    const filterItem = notification.filter((val) => val.new === true).length;
    setNewNotification(filterItem);
  }, [notification, notification.map((val) => val.new)]);

  return { notification, newNotification };
}
