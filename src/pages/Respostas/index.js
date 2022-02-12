import React, { useState, useEffect, useRef } from "react";
import { FiArrowLeft, FiUpload } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar"
import { useDropzone } from "react-dropzone"

import api from '../../services/api'

import imgProcessos from "../../assets/processos.png"
import logo from '../../assets/logofsm.png'

import './styles.css'
import "react-circular-progressbar/dist/styles.css"
import { render } from "@testing-library/react";

export default function Respostas() {
    const usertoken = localStorage.getItem("token")

    const { id_demanda } = useParams();
    const [user, setUser] = useState([])
    const [infoDemanda, setInfoDemanda] = useState([])
    const [respostas, setResposta] = useState([])

    const { acceptedFiles, getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({ accept: 'application/pdf', maxFiles: 1 });
    const [progress, setProgress] = useState(0)
    const [messagem, setMessagem] = useState("")
   
    const [AtualizStatus, setAtualizStatus] = useState()


    const formRef = useRef(null)
    const [htmlform, sethtmlform] = useState()



    useEffect(() => {
        api.get("/profile/user", {
            headers: { 'Authorization': ` Bearer ${usertoken}` }
        }).then(response => { setUser(response.data) },
        )
    }, [usertoken])

    useEffect(() => {
        api.get(`/info/resposta/${id_demanda}`, {
            headers: {
                'Authorization': ` Bearer ${usertoken}`
            }
        }).then(response => {
            setResposta(response.data);
        })
    }, [id_demanda])

    function refreshRespostas() {
        api.get(`/info/resposta/${id_demanda}`, {
            headers: {
                'Authorization': ` Bearer ${usertoken}`
            }
        }).then(response => {
            setResposta(response.data);
        })
    }

    useEffect(() => {
        api.get(`/info/demanda/${id_demanda}`, {
            headers: {
                'Authorization': ` Bearer ${usertoken}`,
            }
        }).then(response => { setInfoDemanda(response.data) },
        )
    }, [id_demanda])

    useEffect(() => {
        api.get('/status').then(response => {
             api.get('/funcionarios', { headers: { 'Authorization': ` Bearer ${usertoken}`, } })
            .then(() => {
                sethtmlform(
                    <select className="homebutton" onChange={event => setAtualizStatus(event.target.value)} defaultValue={""} >
                        <option value="" disabled selected>Situação</option>
                        {
                            response.data.map(status => (
                                <option key={status.id} value={status.id} >{status.name}</option>
                            ))
                        }
                    </select >
                );
            }).catch(sethtmlform())
        })
    }, [id_demanda,usertoken])
//    async function listStatus() {
//         await api.get('/status').then(response => {
//             setStatus(response.data);
//         })
//         // console.log(status)
//     }
//     useEffect(()=> {listStatus()})


    


    function limpar() {
        setMessagem("")
        setAtualizStatus("")
        setProgress(0)
        acceptedFiles.pop();
        formRef.current.reset()

    }



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

    async function handleNewResposta(event) {
        event.preventDefault();

        try {
            const nomeArquivo = await handleNewArqivo()

            const data = {
                id_demanda: id_demanda,
                status: AtualizStatus,
                id_arquivo: nomeArquivo,
                message: messagem
            }

            await api.post('/resposta/demanda', data, {
                headers: { 'Authorization': ` Bearer ${usertoken}` }
            });
            alert("Processo respondido com sucesso");
            limpar();
            refreshRespostas();
        } catch (error) {
            alert(error)
        }

    }

    return (
        <div className="resposta-container">
            <header>
                <Link to="/demandas">
                    <FiArrowLeft size={18} color="#3254AC" />
                </Link>


                <img src={logo} alt="logo" />

                <span>Bem vindo(a),{user.name}</span>
                <p>Detalhes da demanda</p>


                <img className="imgProcessos" src={imgProcessos} alt="" />
            </header>
            <div className="InfoProcesso">

                <strong>ID da demanda</strong>
                <p>{infoDemanda.id}</p>

                <strong>Mensagem</strong>
                {!infoDemanda.message
                    ? <p>Sem mensagem anexada</p>
                    : <p>{infoDemanda.message}</p>
                }

                <strong>Solicitação: </strong>
                {!infoDemanda.solicitacao
                    ? <p>{infoDemanda.id_solicitacao}</p>
                    : <p>{infoDemanda.solicitacao.name}</p>
                }

                <strong>Arquivo</strong>
                {!infoDemanda.arquivo
                    ? <p>Sem arquivo anexado</p>
                    : <a href={infoDemanda.arquivo.url} target="_blank">{infoDemanda.arquivo.url}</a>
                }
            </div>


            {respostas.map(respostas => (
                <div className="resposta">

                    <ul>
                        <li key={respostas.id}>
                            <strong>ID da resposta</strong>
                            <p>{respostas.id}</p>

                            <strong>Mensagem</strong>
                            {!respostas.message
                                ? <p>Sem mensagem anexada</p>
                                : <p>{respostas.message}</p>
                            }

                            <strong>Status: </strong>
                            {!respostas.statusId
                                ? <p>Processo aberto</p>
                                : <p>{respostas.statusId.name}</p>
                            }

                            <strong>Arquivo de resposta</strong>
                            {!respostas.arquivo
                                ? <p>Sem arquivo anexado</p>
                                : <a href={respostas.arquivo.url} target="_blank">{respostas.arquivo.url}</a>
                            }
                            <strong>Respondido por:</strong>
                            {!respostas.user
                                ? <p> processo em aberto, aguardando resposta</p>
                                : <p>{respostas.user.name}</p>
                            }
                        </li>

                    </ul>
                </div>
            ))}

            <form onSubmit={handleNewResposta} ref={formRef}>
                <input type="text" value={messagem} onChange={event => setMessagem(event.target.value)} placeholder="Adicione uma mensagem de resposta" />

                {htmlform}

                <div {...getRootProps({ className: 'dropzone' })}  >
                    <input {...getInputProps()} />
                    {
                        isDragAccept && (<p> Solte o arquivo</p>)
                    }
                    {
                        isDragReject && (<p> so aceitamos arquivos formato .pdf</p>)
                    }
                    {
                        !isDragActive && (<p><FiUpload /> Arraste e solte ou click aqui para selecionar o arquivo</p>)
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

                <button className="buttonhome" type="submit">Enviar Resposta</button>
            </form>


        </div>
    );
}