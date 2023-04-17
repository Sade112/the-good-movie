import './App.css';
import Pelis from './components/Pelis/Pelis';
import Home from './components/Home/Home';
import Series from './components/Series/Series';
import React from 'react';
import { useState } from "react";

function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [estado, setEstado] = useState("1");

  const handleLogin = (value) => {
    setIsLoggedIn(value);
  }
  console.log(estado)
  return (
    <div className="App">
      <div className="nav">
        <div className='logo'>
          <a><h1>TGM</h1></a>
        </div>
        <div className='links'>
          <button disabled={estado==="1"} onClick={() => setEstado("1")}>HOME</button>
          {isLoggedIn && <button disabled={estado==="2"} onClick={() => setEstado("2")}>PELIS</button>}
          {isLoggedIn && <button disabled={estado==="3"} onClick={() => setEstado("3")}>SERIES</button>}
        </div>
      </div>

      <div className="principal">
        {estado === "1" ? (<Home isLoggedIn={isLoggedIn} handleLogin={handleLogin}></Home>) :
        estado === "2" ? (<Pelis isLoggedIn={isLoggedIn}></Pelis>) :
        estado === "3" ? (<Series isLoggedIn={isLoggedIn}></Series>) :
        estado}
      </div>
    </div>
  );
  
}

export default App;
