import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './routes/Home.jsx'
import Contact from './routes/Contact.jsx'
import Profile from './routes/Profile.jsx'
import Login from './routes/Login.jsx'
import Register from './routes/Register.jsx'
import Layout from './components/Layout.jsx'
import CreatePost from './routes/CreatePost.jsx'


import { createBrowserRouter, RouterProvider } from "react-router-dom";


  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/home', element: <App /> },
        { path: '/dashboard', element: <App /> },
        { path: '/contact', element: <Contact /> },
        { path: '/profile', element: <Profile /> },
        { path: '/login', element: <Login /> },
        { path: '/new-post', element: <CreatePost /> },
        { path: '/register', element: <Register /> }
      ]
    }
  ]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
