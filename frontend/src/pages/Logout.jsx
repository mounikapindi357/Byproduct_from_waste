import { useEffect } from 'react';

function Logout() {
  useEffect(() => {
    localStorage.clear();
    alert("You have been logged out.");
    window.location.href = "/login";
  }, []);

  return null;
}

export default Logout;
