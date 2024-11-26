import React, { createContext, useContext, useState, useEffect } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext()


const getSocket = () =>{
    const token = localStorage.getItem("token")
   

    return io(import.meta.env.VITE_SOCKET_URI,{
        withCredentials: true,
        auth: {
            token
        }
    })
}

function SocketProvider({children}) {
const [socket, setSocket] = useState(null)

console.log("use socket", socket)

useEffect(() =>{
    const socketInstance = getSocket()
    setSocket(socketInstance)

    return () =>{
        if(socketInstance){
            socketInstance.disconnect()
        }
    }
}, [])

  return (
    <>
    <SocketContext.Provider value={socket}>
{children}
    </SocketContext.Provider>
    
    </>
  )
}



const useSocket = () =>{
    return useContext(SocketContext)
}


export {SocketProvider, useSocket}
