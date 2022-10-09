import React from 'react'
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

import('react-dom/client').then(ReactDOM => { ReactDOM.createRoot(document.getElementById('app-mount') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)})