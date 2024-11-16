# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## for production you have to change

### frontend / .env

VITE_BACKEND_API = http://localhost:8000/api/v1/chat-app
VITE_SOCKET_URI =  http://localhost:8000

#####  to

VITE_BACKEND_API = https://ai-smartchat-backend.onrender.com/api/v1/chat-app
VITE_SOCKET_URI =  https://ai-smartchat-backend.onrender.com


### backend/ .env

## CORS_ORIGIN = http://localhost:5173

# to 

CORS_ORIGIN = 