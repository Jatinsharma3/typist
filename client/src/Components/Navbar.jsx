import React from 'react'
import './Navbar.css'
import { NavLink } from 'react-router-dom'


const Navbar = () => {
  return (
    <>
      <nav>
        
        <NavLink to={'/'}  className="nav-link">

          <h1>Typing Test</h1>
        </NavLink>

        {/* <NavLink to={'/register'}  className="nav-link">
          SignUp
        </NavLink> */}
        <NavLink to={'/login'}  className="nav-link">
          Login
        </NavLink>



      </nav>



    </>
  )
}

export default Navbar