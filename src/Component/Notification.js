import { useDispatch } from "noval";
import useGetNotification from "../Hook/useGetNotification";
import { AiFillStar } from "react-icons/ai";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

export default function Notification() {
  const { notification } = useGetNotification();

  const [loading, setLoading] = useState(false);

  const [newNotification, setNewNotification] = useState(0);

  const { dispatch } = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    const filterItem = notification.filter((val) => val.new === true).length;

    setNewNotification(filterItem);

    dispatch({ filterItem }, "newNotification");
  }, [notification]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <section className="-mt-9 w-3/4 ml-auto mr-[70px]">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {notification
            .map((val) => {
              let dateStr = val.notiAt;
              let parts = dateStr.split("/");
              let newDateStr = `${parts[1]}/${parts[0]}/${parts[2]}`;
              let date = new Date(newDateStr);
              return { ...val, date };
            })
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            )

            .map((val) => (
              <div
                key={val.unique}
                className="flex items-center gap-4 p-3 my-4 border-2 rounded-md cursor-pointer"
                onClick={() => {
                  dispatch({ ...val }, "notifications");

                  updateDoc(doc(db, "notification", val.notiId), {
                    ...val,
                    new: false,
                  });

                  dispatch({ ...val }, "donor");
                  navigate("/donoradded");
                }}
              >
                <div className="relative w-10 h-10 bg-gray-400 rounded-full flex justify-center items-center text-white">
                  {val.new === true && (
                    <span className="text-red-500 text-5xl absolute top-[-42px] left-[-2px]">
                      .
                    </span>
                  )}
                  <AiFillStar className="w-6 h-6 mx-auto" />
                </div>
                <div>
                  <p>
                    {val.message} {val.organ}
                  </p>
                  <div>{val.unique}</div>
                  <p className="text-sm text-gray-500">{val.notiAt}</p>
                </div>
              </div>
            ))}
        </>
      )}
    </section>
  );
}
