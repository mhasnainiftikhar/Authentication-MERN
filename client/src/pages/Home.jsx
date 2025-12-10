import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
  return (
    <div
      className='min-h-screen bg-cover bg-center bg-no-repeat'
      style={{ backgroundImage: 'url("/bg_img.png")' }}
    >
      <Navbar />
      <div className="mt-10">
        <Header />
      </div>
    </div>
  )
}

export default Home
