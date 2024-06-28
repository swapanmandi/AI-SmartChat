import React, { useState } from 'react'

export default function Prompt({receivedCode}) {
const [code, setCode] = useState('');



const handleSubmit = (e) =>{
  e.preventDefault();
  
  
  const sendCode = {
    data: code
  }
  receivedCode(sendCode);
  setCode("")
}
  


  return (
   <>
   <div className=" w-80 fixed lg:left-1/2 bottom-0 bg-slate-900 rounded-md m-3">
   <form onSubmit={handleSubmit}>
            <label className=' flex'>
              <input className=' w-80 bg-slate-900 lg:w-96 lg:h-20 rounded-md focus:outline-none text-white p-1' value={code} onChange={e => setCode(e.target.value)} placeholder='Write Your Query . . . . .'>
              </input>
              <button type='submit' disabled={code === ""} className="disabled:bg-gray-400 bg-yellow-700 p-1 rounded-md m-1 ">Send</button>
            </label>
            
            </form>
   </div>
   </>
  )
}
