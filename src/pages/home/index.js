import React, { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone"
import { Link, useNavigate } from "react-router-dom"
import { FiPower, FiUpload } from "react-icons/fi";
import { CircularProgressbar } from "react-circular-progressbar"

import api from '../../services/api'
import logo from '../../assets/logofsm.png'
import homefsm from '../../assets/homefsm.png'

import "react-circular-progressbar/dist/styles.css"
import './styles.css'

export default function Home() {
    const history = useNavigate();

    const usertoken = localStorage.getItem("token");

    const { acceptedFiles, getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({ accept: 'application/pdf', maxFiles: 1 });

    const [solicitacao, setSolicitacao] = useState("")
    const [setor, setSetor] = useState("")
    const [messagem, setMessagem] = useState("")

    const [progress, setProgress] = useState(0)

    const [user, setUser] = useState([])
    const [solicitacoes, setSolicitacoes] = useState([])
    const [setores, setSetores] = useState([])

    const formRef = useRef(null)



    function limpar() {
        setSolicitacao("")
        setSetor("")
        setMessagem("")
        setProgress(0)
        acceptedFiles.pop();
        formRef.current.reset()

    }


    useEffect(() => {
        api.get("/profile/user", {
            headers: { 'Authorization': ` Bearer ${usertoken}` }
        }).then(response => { setUser(response.data) },
        )
    }, [usertoken])

    useEffect(() => {
        api.get("setores").then(response => {
            setSetores(response.data);
        })
    }, [usertoken])

    useEffect(() => {
        api.get(`/solicitacoes/setor/${setor}`).then(response => {
            setSolicitacoes(response.data);
        })
    }, [setor])



    async function handleNewArqivo() {
        var keyArquivo = ""
        const formData = new FormData();

        formData.append('file', acceptedFiles[0]);

        if (acceptedFiles[0]) {
            await api.post('upload', formData,
                {
                    headers: { 'Authorization': ` Bearer ${usertoken}` },
                    onUploadProgress: event => {
                        const percent = parseInt(Math.round((event.loaded * 100 / event.total)));
                        setProgress(percent)
                    }
                }).then(response => {
                    keyArquivo = response.data.key
                })

            return keyArquivo
        }
        return null
    }



    async function handleNewDemanda(event) {
        event.preventDefault();

        try {
            const nomeArquivo = await handleNewArqivo()

            const data = {
                id_setor: setor,
                id_solicita: solicitacao,
                id_arquivo: nomeArquivo,
                message: messagem
            }

            await api.post('demandas', data, {
                headers: { 'Authorization': ` Bearer ${usertoken}` }
            });
            alert("Processo criado com sucesso");
            limpar();
        } catch (error) {
            alert(error)
        }

    }

    function handleLogout() {
        localStorage.clear();
        history("/")
    }


    return (
        <div className="home-container">
            <header>
                <img src={logo} alt="logofsm" />
                <span>Bem vindo(a),{user.name}</span>

                <button onClick={handleLogout}><FiPower size={18} color="#3254AC" /></button>
            </header>

            <section>
                <h3>Acompanhe suas solicitações ou registre um novo processo</h3>
                <img className="img" src={homefsm} alt="homefsm" />
            </section>

            <button className="homebutton">
                <Link to="/processos">
                    Acompanhamento de Solicitações
                </Link>
            </button>
            
            <form onSubmit={handleNewDemanda} ref={formRef}>


                <select className="homebutton" onChange={event => setSetor(event.target.value)} defaultValue={""}>
                    <option value="" disabled selected>Selecione o Setor</option>
                    {
                        setores.map(setores => (
                            <option key={setores.id} value={setores.id} >{setores.name}</option>
                        ))
                    }
                </select>

                <select className="homebutton" onChange={event => setSolicitacao(event.target.value)} defaultValue={""}>
                    <option value="" disabled selected>Tipo de Solicitação</option>
                    {
                        solicitacoes.map(solicitacoes => (
                            <option key={solicitacoes.id} value={solicitacoes.id} >{solicitacoes.name}</option>
                        ))
                    }

                </select>



                <input type="text" value={messagem} onChange={event => setMessagem(event.target.value)} placeholder="Adicione uma mensagem a sua solicitação" />


                <div {...getRootProps({ className: 'dropzone' })}  >
                    <input {...getInputProps()} />
                    {
                        isDragAccept && (<p> Solte o arquivo</p>)
                    }
                    {
                        isDragReject && (<p> so aceitamos arquivos formato .pdf</p>)
                    }
                    {
                        !isDragActive && (<p><FiUpload />Arraste e solte ou click aqui para selecionar o arquivo</p>)
                    }


                </div>
                <aside>
                    <h4>Arquivo</h4>

                    <ul>
                        <div className="barraProgress">
                            {acceptedFiles.map(file => (
                                <li key={file.path}>
                                    {file.path} - {file.size} bytes

                                    <CircularProgressbar
                                        styles={{
                                            root: { width: 50 },
                                            path: { stroke: "#7159c1" }
                                        }}
                                        strokeWidth={10}
                                        value={progress}
                                    />

                                </li>

                            ))
                            }
                        </div>
                    </ul>
                </aside>


                <button className="buttonhome" type="submit">Enviar Solicitação</button>

            </form>
        </div >
    );
}