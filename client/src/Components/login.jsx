import React, { useState } from 'react';
import './login.css'

const Login = () => {
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let data = {
                'email': e.target[0].value,
                'password': e.target[1].value
            };

            const response = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(data)
            });

            if (response.ok) {
                window.location.href = "/";
            } else {
                throw new Error('Invalid email or password');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(error.message);
        }
    };

    return (
        <div className='container'>
                <h2 className='lh'>Login</h2>
           <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type='text' placeholder='Email' />
                </div>
                <div className="form-group">
                    <input type='password' placeholder='Password' />
                </div>
                <div className="form-group">
                    <button type='submit'>Submit</button>
                </div>
                <p className='lp'>Don't have an account? <a href="/register">Sign up</a></p>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
};

export default Login;
