/* eslint-disable no-useless-escape */
import {Link, useNavigate} from "react-router-dom";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";
import {useEffect, useState} from "react";

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export default function LoginDonor() {
    const auth = getAuth();

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");

    const [validEmail, setValidEmail] = useState(true);

    const [loginFocus, setLoginFocus] = useState(false);

    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, pwd);
            navigate("/testtransplantlogin");
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);


    return (
        <div className="flex flex-col items-center justify-center pt-12">
            <p
                className={
                    error
                        ? "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-3 capitalize"
                        : ""
                }
            >
                {error.split("").splice(22, 14).join("")}
            </p>
            <h1 className="text-xl font-bold mb-7">ICU Doctor Login</h1>
            <form className="flex flex-col w-96" onSubmit={handleLogin}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setLoginFocus(true)}
                    onBlur={() => setLoginFocus(false)}
                    className="text-center h-12 my-5 rounded-3xl border-2 outline-none"
                />
                <p className="text-red-500 italic text-center">
                    {!validEmail && loginFocus && "Invalid Email"}
                </p>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    autoComplete="off"
                    onChange={(e) => setPwd(e.target.value)}
                    onFocus={() => setLoginFocus(true)}
                    onBlur={() => setLoginFocus(false)}
                    className="text-center h-12 my-5 rounded-3xl border-2 outline-none"
                />

                <p className="text-red-500 italic text-center">
                    {pwd.length < 8 && loginFocus && "Password must be 8 characters long"}
                </p>

                <button
                    className="bg-indigo-500 m-auto px-10 py-3 rounded-3xl focus:outline-none focus:border-blue-300 focus:shadow-outline disabled:opacity-50"
                    disabled={!validEmail || pwd.length < 8}
                >
                    Login
                </button>
            </form>
            <div className="text-center mt-5">
                <Link to="/resetpassword" className="underline text-indigo-500">
                    Forget Password
                </Link>
            </div>
        </div>
    );
}
