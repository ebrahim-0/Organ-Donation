import { BsBarChart, BsChatDots } from "react-icons/bs";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { BiSolidChevronDown } from "react-icons/bi";
import { Link, NavLink } from "react-router-dom";
import "./SideBar.css";
import { FaBars } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../auth";

export default function SidBar() {
  const [userLogin, setUserLogin] = useState("");
  const [data, setData] = useState([]);
  const [role, setRole] = useState("");

  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLogin(user.displayName);
      }
    });
  }, [userLogin, auth]);

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

  const user = auth.currentUser;

  return (
    <div className="bg-white xl:bg-transparent fixed -left-64 xl:left-0 transition-all duration-300 menu pt-16 border-r-[.5px] border-indigo-200 z-10 h-full">
      <div
        className="absolute xl:hidden -right-12 top-6 text-2xl"
        onClick={() =>
          document.querySelector(".menu").classList.toggle("!left-0")
        }
      >
        <FaBars />
      </div>
      <nav
        className="relative w-64 flex flex-col gap-12"
        onClick={() =>
          document.querySelector(".menu").classList.toggle("!left-0")
        }
      >
        <div className="p-8 flex flex-col gap-4">
          {role === "Transplant Coordinator" && (
            <>
              <NavLink
                to={"overview"}
                className={`text-slate-500 font-medium hover:text-indigo-500 transition-all duration-300 cursor-pointer flex items-center gap-3`}
              >
                <BsBarChart /> Overview
              </NavLink>
              <NavLink
                to="requestorgan"
                className="text-slate-500 font-medium hover:text-indigo-500 transition-all duration-300 cursor-pointer flex items-center"
              >
                Search For a Match
    
              </NavLink>
              <NavLink
                to="matched"
                className="text-slate-500 font-medium hover:text-indigo-500 transition-all duration-300 cursor-pointer flex items-center  whitespace-nowrap"
              >
                View Matched Cases
        
              </NavLink>
              <NavLink
                to="viewmatchedcases"
                className="text-slate-500 font-medium hover:text-indigo-500 transition-all duration-300 cursor-pointer flex items-center whitespace-nowrap"
              >
                View Waiting List
       
              </NavLink>
              <NavLink
                to="searchdonor"
                className="text-slate-500 font-medium hover:text-indigo-500 transition-all duration-300 cursor-pointer flex items-center  whitespace-nowrap"
              >
                View Brain-death Cases
          
              </NavLink>
            </>
          )}

          {role === "ICU Doctor" && (
            <>
              <NavLink
                to={"overview"}
                className={`text-slate-500 font-medium hover:text-indigo-500 transition-all duration-300 cursor-pointer flex items-center gap-3`}
              >
                <BsBarChart /> Overview
              </NavLink>
              <NavLink
                to="reportbraindeath"
                className="text-slate-500 font-medium hover:text-indigo-500 transition-all duration-300 cursor-pointer flex items-center"
              >
                Report a Brain-dead
  
              </NavLink>
              <NavLink
                to="checkbraindeath"
                className="text-slate-500 font-medium hover:text-indigo-500 transition-all duration-300 cursor-pointer flex items-center"
              >
                View Brain-death Cases
          
              </NavLink>
            </>
          )}
        </div>
        <div className="p-8 flex flex-col gap-4">
          <NavLink
            to="contact"
            className="text-slate-500 font-medium hover:text-indigo-500 transition-all duration-300 cursor-pointer flex items-center gap-3"
          >
            <BsChatDots />
            Contact US
          </NavLink>

          {user ? (
            <Link
              to="/"
              className="text-red-600 font-medium transition-all duration-300 cursor-pointer flex items-center gap-3"
              onClick={async () => {
                try {
                  await signOut(auth);
                  console.log("User logout");
                  window.location.reload();
                } catch (error) {
                  console.log(error.message);
                }
              }}
            >
              <FiLogOut />
              Log Out
            </Link>
          ) : (
            <NavLink
              to="login"
              className="text-slate-500 font-medium hover:text-indigo-500 transition-all duration-300 cursor-pointer flex items-center gap-3"
            >
              <FiLogIn />
              Log in
            </NavLink>
          )}
        </div>
      </nav>
    </div>
  );
}
