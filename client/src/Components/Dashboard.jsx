import React from 'react'

const Dashboard = () => {

  const handlesubmit = async()=> {

  try {
    const response = await fetch("http://127.0.0.1:5000" + '/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
      });

    if (response.ok) {
    } 
    else {
      console.error('Data not fetch');
    }
  } 
  catch (error) {
    console.error('NOt fetch user data', error);
  }
}



  return (
    <div>
        <h1>User information store here.</h1>
    </div>
  )
}

export default Dashboard