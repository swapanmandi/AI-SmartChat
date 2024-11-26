import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import PublicHome from "./pages/PublicHome.jsx";
import Home from "./pages/Home.jsx";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import { AuthProvider } from "./store/AuthContext.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import LeftSidebar from "./components/LeftSidebar.jsx";

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
    ],
  },

  {
    path: "/app",
    element: <App />,

    children: [
      {
        path: "/app",
        element: <LeftSidebar />,
      },
      {
        path: "/app/chat/:cid/:rid",
        element: <Home />,
      },
      {
        path: "/app/room-chat/:cid",
        element: <Home />,
      },
      {
        path: "/app/chat/:cid/:rid/:cq",
        element: <Home />,
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
