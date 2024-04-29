import React, { useEffect, useState } from 'react'
import './Navbar.css'
import { NavLink } from 'react-router-dom'
import  Logout  from './logout.jsx'

const Navbar = () => {

  const [loggedin, setLoggedin]  = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    withCredentials: true,
};

const checkLogin = async() =>{
    const response = await fetch("http://127.0.0.1:5000" + '/check-login', fetchOptions)
    const check = await response.json();
    if(check['logged_in'] == true)
        setLoggedin(true)
    else
        setLoggedin(false)
}
checkLogin()


const toggleDropdown = () => {
  setDropdownOpen(!dropdownOpen);
};
  return (
    <>
        <nav>
        <NavLink to={'/'} className="nav-link">
          <h1>Typing Test</h1>
        </NavLink>

        {loggedin ? (
          <div className="dropdown" onClick={toggleDropdown}>
            <button className="dropbtn">Profile</button>
            {dropdownOpen && (
              <div className="dropdown-content">
                <NavLink to={'/dashboard'} className="nav-link">
                  Dashboard
                </NavLink>

                <Logout />
              </div>
            )}
          </div>
        ) : (
          <NavLink to={'/login'} className="nav-link">
            Login
          </NavLink>
        )}
      </nav>
    </>
  )
}

export default Navbar 