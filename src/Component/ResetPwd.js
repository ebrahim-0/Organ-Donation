import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { auth } from "../auth";
import { Link } from "react-router-dom";

export default function ResetPwd() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleReset = async (e) => {
    await sendPasswordResetEmail(auth, email);
    setSent(true);
  };

  return (
    <>
      <div className="flex justify-center items-center">
        {sent ? (
          <div className="flex flex-col items-center gap-3">
            <h1>Check Your Email</h1>
            <Link
              to={"/login"}
              className="bg-indigo-500 w-fit m-auto px-10 py-3 rounded-3xl mt-4 cursor-pointer transition-all duration-300 hover:text-white hover:bg-indigo-900"
            >
              Login
            </Link>
          </div>
        ) : (
          <div className="flex flex-col w-96 gap-2">
            <h2 className="font-bold text-3xl text-center">Forget Password</h2>

            <input
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              className="text-center h-12 my-5 rounded-3xl border-2 outline-none"
            />
            <input
              type="submit"
              value={"Reset My Password"}
              className="bg-indigo-500 w-fit m-auto px-10 py-3 rounded-3xl mt-4 cursor-pointer transition-all duration-300 hover:text-white hover:bg-indigo-900"
              onClick={handleReset}
            />
          </div>
        )}
      </div>
    </>
  );
}
