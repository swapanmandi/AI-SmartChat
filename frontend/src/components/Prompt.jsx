import React, { useState } from 'react'

export default function Prompt({receivedCode}) {
const [code, setCode] = useState('');



const handleSubmit = (e) =>{
  e.preventDefault();
  const sendCode = {
    data: code
  }
  receivedCode(sendCode);
}
  


  return (
   <>
   <div className=' '>
   <form onSubmit={handleSubmit} className=' bottom-0 fixed'>
            <label>
              <textarea className=' w-96 h-20 m-2' value={code} onChange={e => setCode(e.target.value)}></textarea>
            </label>
            <button type='submit'>Send</button>
            </form>
   </div>
   </>
  )
}
