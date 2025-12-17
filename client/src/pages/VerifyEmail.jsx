import React, { useState, useRef, useContext, useEffect } from "react";
import { AppContext } from "../components/context/context";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedIn, useData } = useContext(AppContext);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split("");
      setOtp(digits);
      digits.forEach((d, i) => {
        if (inputsRef.current[i]) inputsRef.current[i].value = d;
      });
      inputsRef.current[5]?.focus();
    }
  };

  // Submit OTP
  const submitOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Enter complete 6-digit OTP");
      return;
    }
    try {
      const response = await fetch(`${backendUrl}/api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ otp: code }),
      });
      const data = await response.json();
      const isSuccess =
        data.success === true ||
        data.status === true ||
        data.verified === true ||
        data.isVerified === true ||
        data.ok === true;

      if (isSuccess) {
        toast.success(data.message || "Email verified!");
        setTimeout(() => navigate("/", { replace: true }), 500);
        return;
      }
      toast.error(data.message || "Invalid OTP");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/send-verify-otp`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      const isSuccess =
        data.success === true || data.status === true || data.ok === true || response.ok;

      if (!isSuccess) {
        toast.error(data.message || "Failed to send OTP");
        return;
      }
      toast.success(data.message || "Verification OTP sent!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  // Redirect if already verified
  useEffect(() => {
    if (isLoggedIn && useData?.isAccountVerified) {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, useData, navigate]);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: 'url("/bg_img.png")' }}
    >
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer hover:opacity-90 transition"
      />

      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-2xl shadow-xl w-[90%] max-w-md text-center">
        <h1 className="text-3xl font-bold mb-2">Verify Email</h1>
        <p className="text-gray-600 mb-6">
          Enter the 6-digit OTP sent to your email address
        </p>

        <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center border border-gray-400 rounded-lg 
                         text-xl font-semibold focus:ring-2 focus:ring-blue-500 bg-white"
            />
          ))}
        </div>

        <button
          onClick={submitOtp}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium 
                     hover:bg-blue-700 transition shadow-md mb-4"
        >
          Verify Email
        </button>

        <p className="text-gray-700">
          Didn’t receive the code?{" "}
          <span
            onClick={resendOtp}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Resend OTP
          </span>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
