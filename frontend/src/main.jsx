import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import PublicHome from "./pages/PublicHome.jsx";
import Home from "./pages/Home.jsx";
import App from "./App.jsx";
//import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./store/AuthContext.jsx";
import Profile from "./components/Profile.jsx";
import Input from "./components/Input.jsx";


const Signup = lazy(() => import("./pages/Signup.jsx"))

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <PublicHome />,
      },
      {
        path: "/signup",
        element: (<Suspense fallback={<div>Loading</div>}><Signup /></Suspense>)
      },
      {
        path: "/signin",
        element: <Login />,
      },
    ],
  },
  
  {
   path: "/app",
   element: <App />,

    children: [
      {
      path: "/app",
    element: (
      
        <Home />
      
    )},
    {

      path:"/app/chat/:cid/:rid",
      element:
      <Home />
    
    },
    {
      path: "/app/room-chat/:cid",
      element: <Home />
    },{
path: "/app/chat/:cid/:rid/:cq",
element: <Home />
    },
      {
        path: "/app/profile",
        element: <Profile />
      },
    ],
  },
  {
    path:"/test",
    element: <Input/>
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
   
      <RouterProvider router={router}>
      <AuthProvider />
        </RouterProvider>
      
  </React.StrictMode>
);
