import React, { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { BsBoxArrowLeft } from "react-icons/bs"
import { Link } from "react-router-dom";

import api from '../../services/api'

import imgProcessos from "../../assets/processos.png"
import logo from '../../assets/logofsm.png'

import './styles.css'


export default function Processos() {
    const [user, setUser] = useState([])
    const [demandas, setDemandas] = useState([])
    const [respostas, setRespostas] = useState([])

    const usertoken = localStorage.getItem("token")

    useEffect(() => {
        api.get("/profile/user", {
            headers: { 'Authorization': ` Bearer ${usertoken}` }
        }).then(response => { setUser(response.data) },
        )
    }, [usertoken])

    useEffect(() => {
        api.get("demandas/send", {
            headers: {
                'Authorization': ` Bearer ${usertoken}`
            }
        }).then(response => {
            setDemandas(response.data);
        })
    }, [usertoken])

    useEffect(() => {
        api.get("/respostas", {
            headers: {
                'Authorization': ` Bearer ${usertoken}`
            }
        }).then(response => {
            setRespostas(response.data);
        })
    }, [usertoken])

    const demandaResposta = demandas.map(demandas => ({
        ...respostas.find((o) => o.id_demanda === demandas.id),
        ...demandas
    }));


    return (
        <div className="demanda-container">
            <header>
                <Link to="/home">
                    <FiArrowLeft size={18} color="#3254AC" />
                </Link>

                <img src={logo} alt="logo" />

                <span>Bem vindo(a),{user.name}</span>
                <p>Acompanhe suas solicitações</p>


                <img className="imgProcessos" src={imgProcessos} alt="" />
            </header>
            <div className="ListProcessos">
                <ul>
                    {demandaResposta.map(demandaResposta => (
                        <li key={demandaResposta.id}>
                            <strong>Solicitação: </strong>
                            <p>{demandaResposta.solicitacao.name}</p>

                            <strong>ID da solicitação</strong>
                            <p>{demandaResposta.id}</p>

                            <strong>Mensagem</strong>
                            {!demandaResposta.message
                                ? <p>Sem mensagem anexada</p>
                                : <p>{demandaResposta.message}</p>
                            }
                            <strong>Status</strong>
                            {!demandaResposta.statusId
                                ? <p>Processo aberto</p>
                                : <p>{demandaResposta.statusId.name}</p>
                            }
                            <strong>Arquivo</strong>
                            {!demandaResposta.arquivo
                                ? <p>Sem arquivo anexado</p>
                                : <a href={demandaResposta.arquivo.url} target="_blank">{demandaResposta.arquivo.url}</a>
                            }
                             <button type="button">
                                <Link to={`/respostas/${demandaResposta.id}`}>
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