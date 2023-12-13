import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "./../../auth";
import { useEffect, useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { useSelector } from "noval";
import useGetRole from "../../Hook/useGetRole";

export default function NavBar() {
  const navigate = useNavigate();

  const { role } = useGetRole();

  const [userName, setUserName] = useState("");

  const [newNotification] = useSelector(["newNotification"]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName);
      }
    });
  }, [userName]);

  return (
    <>
      <nav className="shadow-[0_4px_10px_rgb(0,0,0,0.2)] sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between md:px-12 px-7 py-2 md:py-0">
          <div
            className="object-cover cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={"/images/logo.png"}
              alt="Organ Donation Matchmaker System"
              className="w-16 md:w-fit"
            />
          </div>

          {userName && (
            <div className="flex gap-7 items-center justify-center">
              {role === "Transplant Coordinator" && (
                <div
                  className="cursor-pointer flex items-center"
                  onClick={() => navigate("/notification")}
                >
                  <IoNotificationsOutline className="text-xl" />
                  {newNotification.filterItem > 0 && (
                    <span className="bg-red-500 w-6 h-6 flex justify-center items-center rounded-full text-white -translate-y-4 -translate-x-2">
                      {newNotification.filterItem}
                    </span>
                  )}
                </div>
              )}
              <div className="font-normal cursor-pointer text-black hover:text-indigo-500 transition-all duration-300 text-base md:text-lg capitalize">
                Welcome, {userName}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
