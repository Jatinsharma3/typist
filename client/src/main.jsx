import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Form from './Components/Form.jsx'
import { RouterProvider, createBrowserRouter} from "react-router-dom";
const Router = () =>{
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>
    },
    
    {
      path: "/login",
      element: <Form/>
    },
   
    // {
    //   path: "*",
    //   element: <NotFound/>
    // }

  ]);
  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  
  </React.StrictMode>,
)
