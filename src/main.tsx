import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import Home from './pages/Home'
import './style.css';

let router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  }
])

ReactDOM.createRoot(document.getElementById('app-mount') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)