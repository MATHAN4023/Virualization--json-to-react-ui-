import { useState } from 'react';

import './App.css';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
  const [access, setaccess] = useState(sessionStorage.getItem('access') || false);

  const access_provider = () => {
    setaccess(true)
  }
  const handlelogout = () => {
    sessionStorage.removeItem('access');
    setaccess(false);
  }
  return (
    <div>
      {access ? (
        <>
          <Dashboard handlelogout={handlelogout}/>
        </>
      ) : (
        <><Login access_provider={access_provider} /></>
      )}
    </div>
  );
}

export default App;
