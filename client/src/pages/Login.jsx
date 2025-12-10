import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../components/context/context.jsx';
import  {toast} from 'react-toastify';


const Login = () => {

  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn ,getUserData} = React.useContext(AppContext);

  const [state, setState] = React.useState("Sign Up"); 
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");


  // SUBMIT HANDLE
  const handleSubmit = async () => {
    if (!email || !password || (state === "Sign Up" && !name)) {
      alert("Please fill all required fields");
      return;
    }

    try {
      if (state === "Sign Up") {
      
        //SIGN UP API CALL  
        const response = await fetch(`${backendUrl}/api/auth/sign-up`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: name, email, password })
        });

        const data = await response.json();
        if (!response.ok) {
          toast.error(data.message || "Sign Up failed");
          return;
        }
        toast.success("Account created successfully! Please verify your email before logging in.");
        navigate("/");
        setIsLoggedIn(true);
        getUserData();

      } else {
        
        //LOGIN API CALL    
        const response = await fetch(`${backendUrl}/api/auth/sign-in`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) {
          toast.error(data.message || "Login failed");
          return;
        }

        toast.success("Logged in successfully!");
        setIsLoggedIn(true);
        getUserData();
        navigate("/");

      }

    } catch (error) {
      console.log(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
      style={{ backgroundImage: 'url("/bg_img.png")' }}
    >
      <img 
        onClick={() => navigate('/')}
        src={assets.logo} 
        alt="Logo" 
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer hover:opacity-90 transition"
      />
      <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-2xl shadow-xl w-[90%] max-w-md text-center">
        
        <h1 className="text-3xl font-semibold mb-4">
          {state === "Sign Up" ? "Create Account" : "Welcome Back"}
        </h1>

        <p className="text-gray-600 mb-8">
          {state === "Sign Up" 
            ? "Join us and start your journey!" 
            : "Login to continue"}
        </p>
        <div className="flex flex-col gap-4 mb-2">

          {state === "Sign Up" && (
            <input 
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          )}
          <input 
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input 
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        {state === "Login" && (
          <p className="w-full text-right text-sm">
            <span 
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate('/reset-password')}
            >
              Forgot Password?
            </span>
          </p>
        )}
        <button 
          onClick={handleSubmit}
          className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-md"
        >
          {state === "Sign Up" ? "Sign Up" : "Login"}
        </button>
        <p className="mt-5 text-gray-700">
          {state === "Sign Up" 
            ? "Already have an account?" 
            : "Don't have an account?"}

          <span 
            className="text-blue-600 ml-1 cursor-pointer hover:underline"
            onClick={() => {
              setState(state === "Sign Up" ? "Login" : "Sign Up");
              setEmail("");
              setPassword("");
              setName("");
            }}
          >
            {state === "Sign Up" ? "Login" : "Sign Up"}
          </span>
        </p>

      </div>
    </div>
  )
}

export default Login
