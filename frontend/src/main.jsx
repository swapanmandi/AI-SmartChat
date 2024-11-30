import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import PublicHome from "./pages/PublicHome.jsx";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import { AuthProvider } from "./store/AuthContext.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import Chat from "./pages/Chat.jsx";
import Home from "./pages/Home.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const Signup = lazy(() => import("./pages/Signup.jsx"));

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
        element: (
          <Suspense fallback={<div>Loading</div>}>
            <Signup />
          </Suspense>
        ),
      },
      {
        path: "/signin",
        element: <Login />,
      },

      {
        path: "/app",
        element: <ProtectedRoute />,

        children: [
          {
            path: "",
            element: <Home />,
          },
          {
            path: "/app/chat/:cid/:rid",

            element: <Chat />,
          },
          {
            path: "/app/room-chat/:cid",
            element: <Chat />,
          },
          {
            path: "/app/chat/:cid/:rid/:cq",
            element: <Chat />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        <AuthProvider />
      </RouterProvider>
    </Provider>
  </React.StrictMode>
);
