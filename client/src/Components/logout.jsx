export default function Logout(){
    const logout = async() =>{
      try {
        const response = await fetch("http://127.0.0.1:5000" + '/logout', {
          method: 'GET',
          credentials: 'include', // Include cookies in the request
        });
        if (response.ok) {
          window.location.href = "/";
        } 
        else {
          console.error('Logout failed');
        }
      } 
      catch (error) {
        console.error('Error during logout:', error);
      }
    }
    return(
        <div onClick={logout}>
          <p>Logout</p>
        </div>
    )
}
