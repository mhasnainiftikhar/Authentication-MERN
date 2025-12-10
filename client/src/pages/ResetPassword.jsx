import React, { useState, useRef, useContext } from "react";
import { AppContext } from "../components/context/context";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef([]);

  //SEND OTP 
  const handleSendOtp = async () => {
    if (!email) return toast.error("Please enter your email");

    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/auth/send-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to send OTP");
        setLoading(false);
        return;
      }

      toast.success("Password reset OTP sent to your email!");
      setStep(2);
    } catch (error) {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  //OTP INPUT HANDLERS
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");

    if (!value) {
      const updated = [...otp];
      updated[index] = "";
      setOtp(updated);
      return;
    }

    const updated = [...otp];
    updated[index] = value[0];
    setOtp(updated);

    if (index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasteData)) return;

    const digits = pasteData.split("");
    setOtp(digits);

    digits.forEach((d, i) => {
      inputsRef.current[i].value = d;
    });

    inputsRef.current[5].focus();
  };

  //VERIFY OTP
  const handleVerifyOtp = () => {
    if (otp.join("").length !== 6) return toast.error("Enter complete OTP");
    setStep(3);
  };

  //RESET PASSWORD
  const handleResetPassword = async () => {
    if (!newPassword) return toast.error("Enter a new password");

    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: otp.join(""),
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Password reset failed");
        setLoading(false);
        return;
      }

      toast.success("Password updated successfully!");
      navigate("/login");

    } catch (err) {
      toast.error("Something went wrong!");
    }

    setLoading(false);
  };

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

      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-2xl shadow-xl w-[90%] max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Reset Password</h2>
        {step === 1 && (
          <div>
            <label className="text-gray-700 font-medium">Enter Email</label>
            <input
              type="email"
              className="w-full p-3 border rounded-xl mt-2"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium 
                       hover:bg-blue-700 transition shadow-md mt-4"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}
        {step === 2 && (
          <div>
            <label className="text-gray-700 font-medium">Enter OTP</label>

            <div
              className="flex justify-center gap-3 mb-6 mt-2"
              onPaste={handlePaste}
            >
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
              onClick={handleVerifyOtp}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium 
                       hover:bg-blue-700 transition shadow-md"
            >
              Verify OTP
            </button>
          </div>
        )}
        {step === 3 && (
          <div>
            <label className="text-gray-700 font-medium">New Password</label>
            <input
              type="password"
              className="w-full p-3 border rounded-xl mt-2"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium 
                       hover:bg-blue-700 transition shadow-md mt-4"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
