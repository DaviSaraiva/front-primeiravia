import axios from 'axios';
import { getToken, responseTokenIsInvalid } from '../globals/globalFunctions';
import { URL_API } from './Api';


// GET
async function getSolicitacoesFromServer(user_id: string) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'user_id': user_id
    }

    let retorno = await axios.get(URL_API + `solicitacoes/bloqueio/`, { headers: headers })
    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno.data.solicitacoes
    }
}

async function getSolicitacaoFromServer(solicitacao_id: string) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = await axios.get(URL_API + `solicitacoes/bloqueio/` + solicitacao_id, { headers: headers })
    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno.data.solicitacao
    }
}

//POST
async function postSolicitacao(obj: any) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'user_id': obj.id
    }

    let retorno = await axios.post(URL_API + `solicitacoes/bloqueio/`, {
        name_aluno: obj.nome,
        email: obj.email,
        phone: obj.phone,
        cpf: obj.cpf,
        school: obj.escola,
        motivo: obj.motivo
    }, { headers: headers })

    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno
    }
}

//UPDATE
async function updateSolicitacao(obj: any) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = await axios.put(URL_API + `solicitacoes/bloqueio/` + obj.id_solicitacao, {
        name_aluno: obj.name_aluno,
        email: obj.email,
        phone: obj.phone,
        cpf: obj.cpf,
        school: obj.school,
        motivo: obj.motivo
    }, { headers: headers })
    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno
    }
}

//DELETE
async function deleteSolicitacao(id_solicitacao: string) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = await axios.delete(URL_API + `solicitacoes/bloqueio/` + id_solicitacao, { headers: headers })
    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno
    }
}

export {
    getSolicitacoesFromServer,
    getSolicitacaoFromServer,
    postSolicitacao,
    updateSolicitacao,
    deleteSolicitacao
}