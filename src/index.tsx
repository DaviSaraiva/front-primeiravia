import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import NovaSolicitacao from "./bloqueio/pages/nova_solicitacao/NovaSolicitacao";
import Main from "./bloqueio/pages/main/Main";
import Login from "./pages/login/Login";
import RegistrationForm from "./pages/register/Form";
import Pagamento from "./pages/pagamento/Pagamento";
import CadastroPrimeiraVia from "./primeiraVia/pages/cadastro/CadastroPessoa";
import CadastroAtualizacao from "./atualizacao/pages/cadastro/CadastroPessoa";
import HomeAtualizacao from "./atualizacao/pages/home/Home";
import homeprimeira from "./atualizacao/pages/home/Home";
import Loading from "./pages/loading/Loading";
import RecSenha from "./pages/recuperar_senha/RecSenha";
import SegRecupera from "./pages/recuperar_senha/SegRecuperacao";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/redirect" component={Loading} />
        <Route path="/minhas-solicitacoes" component={Main} />
        <Route path="/registro" component={RegistrationForm} />
        <Route path="/esqueci-minha-senha" component={RecSenha} />
        <Route path="/redefinir-senha" component={SegRecupera} />
        <Route path="/nova-solicitacao" component={NovaSolicitacao} />
        <Route path="/pagamento" component={Pagamento} />
        <Route path="/atualizacao-cadastral" component={CadastroAtualizacao} />
        <Route path="/primeiravia-cadastro" component={CadastroPrimeiraVia} />
        <Route path="/homeatualizacao" component={HomeAtualizacao} />
        <Route path="/homeprimeira" component={homeprimeira} />
        <Route path="*" component={() => { return <div><p>Erro 404</p></div> }} />
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// execute by ip: HOST=[ip] yarn start
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
