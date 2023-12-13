import { Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./Component/NavBar/NavBar";
import SidBar from "./Component/SideBar/SideBar";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Error from "./Component/404";
import ResetPwd from "./Component/ResetPwd";
import RequestOrgan from "./Component/RequestOrgan/RequestOrgan";
import ProtectedRoute from "./Component/ProtectedRoute";
import ReportBrainDeath from "./Component/BrainDeath/ReportBrainDeath";
import CheckBrainDeath from "./Component/BrainDeath/CheckBrainDeath";
import OverView from "./Component/OverView";
import LoginTransplant from "./Component/Login/LoginTransplant";
import LoginDonor from "./Component/Login/LoginDonor";
import TestDonorLogin from "./Component/Test/TestDonorLogin";
import TestTransplantLogin from "./Component/Test/TestTransplantLogin";
import Home from "./Component/Home/Home";
import AddNewBrainDeath from "./Component/BrainDeath/AddNewBrainDeath";
import ViewMatchedCases from "./Component/RequestOrgan/ViewMatchedCases";
import SearchDonor from "./Component/RequestOrgan/SearchDonor";
import RequestsAdded from "./Component/RequestsAdded";
import Notification from "./Component/Notification";
import Matched from "./Component/Matched";
import DonorAdded from "./Component/DonorAdded";
import useGetMatched from "./Hook/useGetMatched";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "./auth";
import RunAlgorithm from "./Component/BrainDeath/RunAlgorithm";
import ContactUs from "./Component/ContactUs";

function App() {
  const [userName, setUserName] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName);
      }
    });
  }, [userName, auth]);

  const { matched } = useGetMatched();

  useEffect(() => {
    matched.forEach(async (item) => {
      let timeDifference =
        new Date().getTime() - new Date(item.matchedAt).getTime();

      if (timeDifference > 48 * 60 * 60 * 1000) {
        await deleteDoc(doc(db, "matched", item.matchId));
        console.log("delete");
      } else {
        console.log("not delete");
      }
    });
  }, [matched]);

  return (
    <>
      <NavBar />
      {user && <SidBar />}

      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="overview"
            element={
              <ProtectedRoute user={!user}>
                <OverView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/requestorgan"
            element={
              <ProtectedRoute user={!user}>
                <RequestOrgan />
              </ProtectedRoute>
            }
          />

          <Route
            path="/searchdonor"
            element={
              <ProtectedRoute user={!user}>
                <SearchDonor />
              </ProtectedRoute>
            }
          />

          <Route path="matched" element={<Matched />} />

          <Route path="testdonorlogin" element={<TestDonorLogin />} />
          <Route path="testtransplantlogin" element={<TestTransplantLogin />} />

          <Route
            path="/reportbraindeath"
            element={
              <ProtectedRoute user={!user}>
                <ReportBrainDeath />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addnewbraindeath"
            element={
              <ProtectedRoute user={!user}>
                <AddNewBrainDeath />
              </ProtectedRoute>
            }
          />

          <Route path="/viewmatchedcases" element={<ViewMatchedCases />} />

          <Route
            path="/checkbraindeath"
            element={
              <ProtectedRoute user={!user}>
                <CheckBrainDeath />
              </ProtectedRoute>
            }
          />

          <Route path="requestsadded" element={<RequestsAdded />} />
          <Route path="donoradded" element={<DonorAdded />} />
          <Route path="runalgorithm" element={<RunAlgorithm />} />

          <Route
            path="logintransplant"
            element={
              <ProtectedRoute user={user}>
                <LoginTransplant />
              </ProtectedRoute>
            }
          />
          <Route
            path="logindonor"
            element={
              <ProtectedRoute user={user}>
                <LoginDonor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/resetpassword"
            element={
              <ProtectedRoute user={user}>
                <ResetPwd />
              </ProtectedRoute>
            }
          />

          <Route path="notification" element={<Notification />} />
          <Route path="contact" element={<ContactUs />} />

          <Route path="*" element={<Error />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
