// import React from "react";

// const ChatApp = () => {
//   const messages = [
//     { content: "Hello!", sender: "user" },
//     { content: "Hi there!", sender: "contact" },
//     { content: "How are you?", sender: "user" },
//     { content: "I'm good, thanks!", sender: "contact" },
//     { content: "How about you?", sender: "contact" },
//     { content: "I'm doing well too!", sender: "user" },
//     // Add more messages as needed
//   ];

//   return (
//     <div className="flex h-screen">
//       <div className="w-1/4 bg-gray-200 p-4">
//         <h1 className="text-lg font-bold mb-4">Contacts</h1>
//         <ul>
//           <li className="mb-2">Contact 1</li>
//           <li className="mb-2">Contact 2</li>
//           <li className="mb-2">Contact 3</li>
//           <li className="mb-2">Contact 4</li>
//         </ul>
//       </div>
//       <div className="flex-1 bg-gray-100 p-4">
//         <div className="h-full flex flex-col justify-between">
//           <div className="overflow-y-auto">
//             {messages.map((message, index) => (
//               <div key={index} className={`mb-4 ${message.sender === 'user' ? 'text-right' : ''}`}>
                
//                 <div className={`bg-${message.sender === 'user' ? 'blue' : 'gray'}-500 text-white p-2 rounded-lg max-w-xs inline-block`}>
                    
//                   {message.content}
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="flex items-center">
//             <input
//               type="text"
//               placeholder="Type a message..."
//               className="flex bg-white border border-gray-300 p-2 rounded-l-lg focus:outline-none"
//             />
//             <button className="bg-blue-500 text-white px-4 py-2 rounded-r-lg">Send</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatApp;


import React ,{useState} from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function ChatApp(){
const [value, setValue] = useState('');
  const [copied, setCopied] = useState(false);

  return (
    <div>
      <input
        value={value}
        onChange={({ target: { value } }) => {
          setValue(value);
          setCopied(false);
        }}
      />

      
     <div>
     {copied ? <span style={{ color: 'red' }}>Copied.</span> : null}
     <CopyToClipboard
        text={value}
        onCopy={() => setCopied(true)}
      >
        <button>Copy to clipboard with button</button>
      </CopyToClipboard>
     </div>

     <div>
        <CopyToClipboard text='{`swapan}' onCopy={() => setCopied(true)}>
<button>Copy</button>
        </CopyToClipboard>
        {copied ? <span style={{ color: 'red' }}>Copied.</span> : null}
     </div>

     
    </div>
  );
};