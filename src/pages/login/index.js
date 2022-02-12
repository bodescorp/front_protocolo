import React, { useState } from "react";
import {  useNavigate } from "react-router-dom"
import {  FiUser, FiKey } from "react-icons/fi"
import api from '../../services/api'

import './styles.css';
import logo from '../../assets/logofsm.png'
import fsm from '../../assets/logo_Fsm.png'






export default function Login() {
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');

  const history = useNavigate();


  async function handleLogin(event) {
    event.preventDefault();

    const data = {
      matricula,
      password: senha
    }

    try {
      const response = await api.post('login', data);
      localStorage.setItem("token", response.data)

      history('/demandas');
    } catch (error) {
      alert("error ")
    }

  }
  return (
    <div className="login-container">
      {/* <div className="container"> */}
      <section className="form">
        <img className="logo" src={logo} alt="LogoFSM" />

        <form onSubmit={handleLogin}>

          <h1>Bem vindo(a)</h1>
          <p>Acesse sua conta agora mesmo</p>
          <div>
            <FiUser size={32} /><input placeholder="Sua matricula" value={matricula} onChange={event => setMatricula(event.target.value)} />
          </div>
          <div>
            <FiKey size={32} /><input type="password" placeholder="Senha" value={senha} onChange={event => setSenha(event.target.value)} />
          </div>

          <button type="submit">Entrar</button>


        </form>

      </section>
      <section className="formCad">
        <img className="Fsm,
        ," src={fsm} alt="FSM" />
      </section>
      {/* </div> */}
    </div>
  );
}