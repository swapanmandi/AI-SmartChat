import React from 'react'
import LeftSidebar from '../components/LeftSidebar'
import Prompt from '../components/Prompt'
import Chat from '../components/Chat'

export default function Home() {
  return (
   <>
   <div className=' bg-slate-50 w-full flex justify-start'>
   <LeftSidebar />
   <div className=' right-0 bg-slate-800 w-[700px] h-screen'>
   <div>Home</div>
   
   <Chat />
   
   </div> 
   <div className=" bg-orange-300 bottom-0 fixed left-1/2">
          <Prompt />
        </div>
   </div>
   </>
  )
}
