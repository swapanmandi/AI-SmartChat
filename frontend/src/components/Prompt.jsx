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
   <div className=" fixed left-1/2 bottom-0 bg-slate-900 rounded-md m-3">
   <form onSubmit={handleSubmit}>
            <label>
              <input className=' bg-slate-900 w-96 h-20 rounded-md' value={code} onChange={e => setCode(e.target.value)} placeholder='Write Your Query . . . . .'>
              </input>
              <button type='submit' disabled={code === ""} className="disabled:bg-gray-400 bg-yellow-700 p-1 rounded-md m-1">Send</button>
            </label>
            
            </form>
   </div>
   </>
  )
}
