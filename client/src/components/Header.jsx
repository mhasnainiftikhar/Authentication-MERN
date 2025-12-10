import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../components/context/context.jsx';

const Header = () => {
  const { userData, getUserData } = useContext(AppContext);

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="flex flex-col items-center text-center mt-15 px-4 text-gray-800">
      <img
        src={assets.header_img}
        alt="Header"
        className="w-36 h-36 rounded-full mb-6 object-cover"
      />
     <h1 className="text-xl font-semibold flex items-center gap-2">
      Hey {userData ? userData.username : "Developer"} 
     <img
    className="w-8 h-8 animate-bounce"
    src={assets.hand_wave}
    alt="Hand wave"
     />
      </h1>
      <h2 className="text-3xl font-bold text-gray-700 mt-2">
        Welcome to our app
      </h2>
      <p className="text-gray-500 max-w-md mt-2 leading-relaxed">
        Let's start with a quick product tour and we will have you up and running in no time!
      </p>
      <button
        className="flex items-center gap-2 px-5 py-2 bg-white border border-gray-300
                   text-gray-800 rounded-3xl font-medium hover:bg-gray-100 
                   transition shadow-sm mt-3"
      >
        Get Started
      </button>

    </div>
  )
}

export default Header
