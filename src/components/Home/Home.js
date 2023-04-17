import React from 'react'
import "./Home.css"
import { useState } from "react";

const Home = ({isLoggedIn , handleLogin}) => {


  const handleSubmit = (event) => {
    event.preventDefault();
    const usuario = event.target.elements.u.value;
    const contraseña = event.target.elements.p.value;
    console.log("Usuario: ", usuario);
    console.log("Contraseña: ", contraseña);
    if (usuario === "proyecto" && contraseña === "upgrade") {
      handleLogin(true); // llamamos a la función handleLogin y le pasamos el valor true
    } else {
      handleLogin(false);
      alert("Inicio incorrecto")
    }
    console.log(isLoggedIn);
  }

  return (
    <div>
      {isLoggedIn ? (
        <div className="welcome">
	        <h1>Te damos la bienvenida</h1>
          <p>Ya puedes navegar por nuestra web, disfruta!</p>
        </div>
      ) : (
      <div className="login">
	      <h1>TGM LOGIN</h1>
        <p>Inicia sesion y disfruta de nuestro ranking personalizado para asegurarte que esta noche verás una Good Movie!</p>
        <form onSubmit={handleSubmit}>
    	    <input className="hz" type="text" name="u" placeholder="Usuario" required="required" />
          <input className="hz" type="password" name="p" placeholder="Contraseña" required="required" />
          <button type="submit" className="btn btn-primary btn-block btn-large">Déjame entrar</button>
        </form>
        <p className='pswrd'>Usuario: proyecto // Contraseña: upgrade</p>
        
      </div>
)}
    </div>
  )
}

export default Home
