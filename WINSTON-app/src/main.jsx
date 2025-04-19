import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Dashboard from './routes/Dashboard.jsx'
import Contact from './routes/Contact.jsx'

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {path: '/', element: <App /> },
  {path: '/dashboard', element: <Dashboard /> },
  {path: '/contact', element: <Contact /> },

  ])

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
