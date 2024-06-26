import { Routes, Route } from "react-router-dom";
import Private from "./Private";

import SignIn from "../pages/SignIn";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Dashboard/Home";
import Transmissoes from "@/pages/Dashboard/Transmissoes";
import DetalheTransmissao from "@/pages/Dashboard/Transmissoes/DetalheTransmissao";

function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/resetPassword" element={<ResetPassword />} />

      <Route
        path="/dashboard/"
        element={
          <Private>
            <Dashboard />
          </Private>
        }
      >
        <Route path="/dashboard/" element={<Home />} />
        <Route path="/dashboard/transmissoes" element={<Transmissoes />} /> 
        <Route path="/dashboard/transmissoes/:idTransmissao" element={<DetalheTransmissao />} /> 
      </Route>
    </Routes>
  );
}

export default RoutesApp;
