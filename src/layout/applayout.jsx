import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@/components/header'

const AppLayout = () => {
  return (
    <div>
      <div className='grid-background'></div>
      <Header/>
      <main className='min-h-screen'>
        <div className='mx-4 sm:mx-10 md:mx-20'>
          <Outlet/>
        </div>
      </main>
      <div className="p-6 mt-10 text-center bg-gray-800">
        Made with 💗 by Ashish Patel
      </div>
    </div>
  )
}

export default AppLayout
