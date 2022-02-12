import React, { useState, useEffect } from "react";
import { FiPower } from "react-icons/fi";
import { BsBoxArrowLeft } from "react-icons/bs"
import { Link, useNavigate } from "react-router-dom";

import api from '../../services/api'

import imgProcessos from "../../assets/processos.png"
import logo from '../../assets/logofsm.png'

import './styles.css'


export default function ListDemandas() {

    const history = useNavigate();

    const [user, setUser] = useState([])
    const [demandas, setDemandas] = useState([])
    const usertoken = localStorage.getItem("token")

    useEffect(() => {
        api.get("/profile/user", {
            headers: { 'Authorization': ` Bearer ${usertoken}` }
        }).then(response => { setUser(response.data) },
        )
    }, [usertoken])

    useEffect(() => {
        api.get("demandas", {
            headers: {
                'Authorization': ` Bearer ${usertoken}`
            }
        }).then(response => {
            setDemandas(response.data);
        }).catch(error => history("/home"))
    }, [usertoken])


    function handleLogout() {
        localStorage.clear();
        history("/")
    }

    return (
        <div className="demanda-container">
            <header>
                <button onClick={handleLogout}><FiPower size={18} color="#3254AC" /></button>

                <img src={logo} alt="logo" />

                <span>Bem vindo(a),{user.name}</span>
                <p>Acompanhe suas demandas</p>


                <img className="imgProcessos" src={imgProcessos} alt="" />
            </header>
            <div className="ListProcessos">
                <ul>
                    {demandas.map(demandas => (
                        <li key={demandas.id}>
                            <strong>Solicitações: </strong>
                            <p>{demandas.solicitacao.name}</p>

                            <strong>ID da solicitação</strong>
                            <p>{demandas.id}</p>

                            <strong>Matricula do Aluno </strong>
                            <p>{demandas.user.matricula}</p>

                            <strong> Nome do Aluno</strong>
                            <p>{demandas.user.name}</p>

                            <strong>Mensagem</strong>
                            {!demandas.message
                                ? <p>Sem mensagem anexada</p>
                                : <p>{demandas.message}</p>
                            }

                            <strong>Arquivo</strong>
                            {!demandas.arquivo
                                ? <p>Sem arquivo anexado</p>
                                : <a href={demandas.arquivo.url} target="_blank">{demandas.arquivo.url}</a>
                            }

                            <button type="button">
                                <Link to={`/respostas/${demandas.id}`}>
                                    <BsBoxArrowLeft size={25} color="rgb(50, 84, 172)" />
                                </Link>

                            </button>

                        </li>
                    ))}
                </ul>
            </div>
        </div>

    );
}