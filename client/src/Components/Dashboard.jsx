import {React,useEffect,useState} from 'react'

const Dashboard = () => {
  const [data, setData] = useState(null)

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
      const data = await response.json()
      console.log(data)
      setData(data)
    } 
    else {
      console.error('Data not fetch');
    }
  } 
  catch (error) {
    console.error('NOt fetch user data', error);
  }
}

useEffect(() => {
  handlesubmit()
}, [])




  return (
    <div className="profile">
       <h1 className="profile-center">Dashboard</h1>
      {data && (
        <div className="profile-container">
          <h2>User Information</h2>
          <p>ID: {data.id}</p>
          <p>Username: {data.username}</p>
          <p>Email: {data.email}</p>

          <h2>Text Tests</h2>
          <p>Total Tests: {data.text_tests}</p>
          <p>Tests Today: {data.text_tests_today}</p>
          <p>Highest WPM Ever: {data.highest_text_wpm_ever}</p>

          <h2>Code Tests</h2>
          <p>Total Tests: {data.code_tests}</p>
          <p>Tests Today: {data.code_tests_today}</p>
          <p>Highest WPM Ever: {data.highest_code_wpm_ever}</p>
        </div>
      )}
</div>
  )
}

export default Dashboard