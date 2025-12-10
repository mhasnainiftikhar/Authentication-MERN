import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../components/context/context";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();

  const { backendUrl, userData, setUserData, setIsLoggedIn } =
    useContext(AppContext);

  //SEND VERIFICATION OTP
 const sendVerificationOtp = async () => {
  try {
    const response = await fetch(`${backendUrl}/api/auth/send-verify-otp`, {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();

    const isSuccess =
      data.success === true ||
      data.status === true ||
      data.ok === true ||
      response.ok;

    if (!isSuccess) {
      toast.error(data.message || "Failed to send OTP");
      return;
    }

    toast.success(data.message || "Verification OTP sent!");
    navigate("/verify-email");

  } catch (err) {
    console.error(err);
    toast.error("Something went wrong!");
  }
};

  //LOGOUT
  const logout = async () => {
    try {
      await fetch(`${backendUrl}/api/auth/sign-out`, {
        method: "POST",
        credentials: "include",
      });

      setUserData(null);
      setIsLoggedIn(false);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full flex justify-between items-center sm:p-6 sm:px-24">
      <img
        src={assets.logo}
        alt="Logo"
        className="w-28 sm:w-32 cursor-pointer hover:opacity-90 transition"
        onClick={() => navigate("/")}
      />
      {userData ? (
        <div className="relative group">
          <div
            className="w-10 h-10 flex items-center justify-center 
                       bg-gray-800 text-white rounded-full uppercase 
                       font-semibold cursor-pointer select-none"
          >
            {userData.username?.charAt(0)}
          </div>

          <div
            className="absolute right-0 mt-2 w-40 bg-white shadow-lg 
                       rounded-xl opacity-0 invisible group-hover:opacity-100 
                       group-hover:visible transition-all duration-200"
          >
            <ul className="py-2 text-gray-700">
              
              {!userData.isAccountVerified && (
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={sendVerificationOtp}
                >
                  Verify Email
                </li>
              )}
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={logout}
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 px-5 py-2 bg-white border border-gray-300
                     text-gray-800 rounded-3xl font-medium hover:bg-gray-100 
                     transition shadow-sm"
        >
          Login
          <img src={assets.arrow_icon} alt="Arrow" className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
