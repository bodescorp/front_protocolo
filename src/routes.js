import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import Login from "./pages/login"
import Home from "./pages/home"
import Processos from "./pages/processos"
import ListDemandas from "./pages/listAllProcessos"
import Respostas from "./pages/Respostas"

export default function Routs() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" caseSensitive={false} exact element={<Login />} />
                <Route path="/home" caseSensitive={false} element={<Home />} />
                <Route path="/processos" caseSensitive={false} element={<Processos />} />
                <Route path="/demandas" caseSensitive={false} element={<ListDemandas />} />
                <Route path="/respostas/:id_demanda"  element={<Respostas />} />

            </Routes>
        </BrowserRouter>
    );
}