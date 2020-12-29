import React, { useState, useEffect } from 'react';
import Main from './comp/Main';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [hideLogin, setHideLogin] = useState(false);

  const params = getHashParams();

  // From example code. 
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  // use effect acts like component did mount lifecycle method. 
  useEffect(()=>{
    if (params.access_token) {
      setIsLoggedIn(true);
      // once logged in don't render the login button. 
      setHideLogin(true)
    }
  }, [])

  // login page and after the user is logged in diaplay the main page.
  return (
    <div className="App">
      {isLoggedIn ? 

      <Main params={params}/> : 

      <div id="login-page">
        LOGIN STATUS = {isLoggedIn.toString()};

        <a id="login-button" href="http://localhost:8888">
          {hideLogin ? null: <button>Log in</button>}
        </a>
      </div>}
    </div>
  );
}

export default App;
