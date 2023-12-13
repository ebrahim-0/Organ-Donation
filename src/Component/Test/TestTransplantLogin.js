import { signOut } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../../auth";
import { useNavigate } from "react-router-dom";
import useGetRole from "../../Hook/useGetRole";

export default function TestTransplantLogin() {
  const navigate = useNavigate();

  const { role } = useGetRole();

  useEffect(() => {
    (async () => {
      if (role) {
        if (role === "Transplant Coordinator") {
          try {
            await signOut(auth);
            console.log("User logout");
            // Redirect to the login page after signing out
            navigate("/logindonor");
            window.location.reload();
          } catch (error) {
            console.log(error.message);
          }
        } else {
          navigate("/");
        }
      }
    })();
  }, [role, navigate]);

  return <></>;
}
