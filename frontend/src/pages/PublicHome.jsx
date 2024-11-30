import React, { useContext } from "react";
import { AuthContext } from "../store/AuthContext.jsx";
import { Link } from "react-router-dom";
export default function PublicHome() {
  const { token, isAuthenticated } = useContext(AuthContext);

  return (
    <div className="flex w-full flex-col items-center justify-center min-h-screen bg-gray-100">
      <main className="flex flex-col items-center justify-center flex-grow w-full px-4 py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Welcome to My AI Chat App
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Experience intelligent conversations with our cutting-edge AI chat
          system. Sign in to start chatting or explore our app to learn more
          about its features.
        </p>
        <div className="flex space-x-4">
          <Link to={token || isAuthenticated ? "/app" : "/signin"}>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              {token || isAuthenticated ? "Let's Start Chat" : "Sign In"}
            </button>
          </Link>
          <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Learn More
          </button>
        </div>
      </main>

      <footer className="w-full py-4 bg-white shadow-md">
        <div className="container mx-auto px-4 text-center text-gray-600">
          &copy; {new Date().getFullYear()} My AI Chat App. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
