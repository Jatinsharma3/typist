import React, { useState } from 'react';
import './form.css'

const Form = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); 


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    try {
      let data = {
        'name': e.target[0].value,
        'email': e.target[1].value,
        'password': e.target[2].value
      }
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers:{ 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      console.log('Form submitted successfully');
    } catch (error) {
      setError('Failed to submit form');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container">
      <h2>SignUp</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input
            name="username"
            type="text"
            required
            minLength={4}
            maxLength={20}
          />
        </label>
        <label>
          <p>Email</p>
          <input
            name="email"
            type="email"
            required
          />
        </label>
        <label>
          <p>Password</p>
          <div style={{position: 'relative'}}>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              maxLength={20}
            />
            <span
              style={{position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer'}}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
        </label>
        <br />
        <input
          type="submit"
          value={isLoading ? "Submitting..." : "Submit"}
          disabled={isLoading}
        />
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default Form;
