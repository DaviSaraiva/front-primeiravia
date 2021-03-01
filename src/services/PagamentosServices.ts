import axios from 'axios';
import { getToken, responseTokenIsInvalid } from '../globals/globalFunctions';
import { URL_API } from './Api';

async function verificarPagamento(id: string) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = await axios.get(URL_API + `atualizacao-cadastral/verificarpagamento/` + id, { headers: headers })
    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno
    }
}

async function getTransacao(user_id: string) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = await axios.get(URL_API + `atualizacao-cadastral/transacoes/` + user_id, { headers: headers })
    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno
    }
}

async function postTransacao(user_id: string, method: string, values: any, nome: string, email: string, telefone: string) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = await axios.post(URL_API + `atualizacao-cadastral/gerartransacao/` + user_id, {
        methodpurchase: method,
        values: values,
        user_data: {
            name: nome,
            email: email,
            telefone: telefone
        }
    }, {
        headers: headers
    })
    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno
    }
}

async function verificarPagamentoPrimeira(id: string) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = await axios.get(URL_API + `primeira-via/verificarpagamento/` + id, { headers: headers })
    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno
    }
}

async function getTransacaoPrimeira(user_id: string) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = await axios.get(URL_API + `primeira-via/transacoes/` + user_id, { headers: headers })
    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno
    }
}
async function postTransacaoPrimeira(user_id: string, method: string, values: any, nome: string, email: string, telefone: string) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = await axios.post(URL_API + `primeira-via/gerartransacao/` + user_id, {
        methodpurchase: method,
        values: values,
        user_data: {
            name: nome,
            email: email,
            telefone: telefone
        }
    }, {
        headers: headers
    })
    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno
    }
}

export {
    verificarPagamento,
    getTransacao,
    postTransacao,
    verificarPagamentoPrimeira,
    getTransacaoPrimeira,
    postTransacaoPrimeira
}
