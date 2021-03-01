import axios from 'axios';
import { getToken, responseTokenIsInvalid } from '../globals/globalFunctions';
import { URL_API } from './Api';

// GET
async function login(email: string, password: string) {
    let data = {
        email: email,
        password: password
    }

    return await axios.post(URL_API + `login/`, data)
}

async function validarHash(hash: string) {
    let retorno = await axios.get(URL_API+'validarhash/'+hash)
    return retorno
}

async function changePasswordLogged(idUser: string, password: any) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = await axios.put(URL_API + 'updatesenhalogado/'+idUser, {
        password: password
    }, { headers: headers })

    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno
    }
}

async function changePassword(idUser: string, hash: string, password: string) {
    let retorno = await axios.put(URL_API + 'updatesenha/'+idUser, {
        hash: hash,
        password: password
    })
    return retorno
}

async function recoverPassword(values: any) {
    let retorno = await axios.post(URL_API + 'recuperarsenha/', values)
    return retorno
}

async function getDadosPessoa(id: string) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = await axios.get(URL_API + `dadospessoa/` + id, { headers: headers })
    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno
    }
}

async function getPessoa(id: string) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = await axios.get(URL_API + `dadospessoa/` + id, { headers: headers })

    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno.data
    }
}

async function getDocuments(id: string) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = await axios.get(URL_API + `documents/` + id, { headers: headers })
    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno
    }
}

function getDocumentPicture(id: string, nomeFoto: string) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let data = {
        url: nomeFoto
    }
    let retorno = axios.post(URL_API+'img/', data, {headers: headers})
    return retorno
}

async function getStep(id: string) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = await axios.get(URL_API + `documents/` + id, { headers: headers })
    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno.data
    }
}

async function getCepData(cepvalue: string) {
    return await axios.get(`https://viacep.com.br/ws/${cepvalue}/json/`)
}

async function confirmarDocumentos(id: string) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    return await axios.put(URL_API+'confirmacaodocumentos/'+id, { first: true }, { headers: headers })
}

async function setFotoCarteira(idUser: string, imagedata: any, idTransaction: string) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = await axios.put(URL_API + 'fotocarteira/' + idUser + '/' + idTransaction, 
                                    imagedata, 
                                    { headers: headers }
                                )
    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno
    }
}

async function setDadosComprovanteEndereco(idUser: string, values: any) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = axios.put(URL_API + 'dadoscomprovanteendereco/' + idUser, values, { headers: headers })
    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno
    }
}

async function setComprovanteEndereco(idUser: string, imagedata: any, idTransaction: string) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = axios.put(URL_API + 'comprovanteendereco/' + idUser + '/' + idTransaction, 
                                imagedata, 
                                { headers: headers }
                            )
    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno
    }
}

async function setDadosComprovanteMatricula(idUser: string, values: any) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = axios.put(URL_API + 'dadoscomprovantematricula/' + idUser, values, { headers: headers })
    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno
    }
}

async function setComprovanteMatricula(idUser: string, imagedata: any, idTransaction: string) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = axios.put(URL_API + 'comprovantematricula/' + idUser + '/' + idTransaction, 
                                imagedata, 
                                { headers: headers }
                            )
    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno
    }
}

async function setIdentificaoVerso(idUser: string, imgversodoc: any, idTransaction: string) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = axios.put(URL_API + 'versodocumentoidentificacao/' + idUser + '/' + idTransaction, 
                                imgversodoc, 
                                { headers: headers }
                            )
    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno
    }
}

async function setIdentificaoFrente(idUser: string, imgfrentedoc: any, idTransaction: string) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = axios.put(URL_API + 'frentedocumentoidentificacao/' + idUser + '/' + idTransaction, 
                                imgfrentedoc, 
                                { headers: headers }
                            )
    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno
    }
}

async function setDadosIdentificacao(idUser: string, values: any) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = axios.put(URL_API + 'dadosdocumentoidentificacao/' + idUser, values, { headers: headers })
    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno
    }
}

async function setFotoEstudante(idUser: string, imagedata: any, idTransaction: string) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = axios.put(URL_API + 'fotoestudante/' + idUser + '/' + idTransaction, imagedata, { headers: headers })
    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno
    }
}

async function getInstituicoes(tipo: string, values: any) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = axios.get(URL_API + `instituicoes/${tipo}/${values}`, { headers: headers })
    // if (responseTokenIsInvalid(retorno)) {
    //     return undefined
    // } else {
    return retorno
    // }
}

async function setCadastroPessoa(idUser: string, values: any) {
    let token = getToken()
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }

    let retorno = axios.put(URL_API + `cadastropessoa/` + idUser, values, { headers: headers })
    if (responseTokenIsInvalid(retorno)) {
        return undefined
    } else {
        return retorno
    }
}

async function saveUser(values: any) {
    return axios.post(URL_API + 'save', values)
}

export {
    login,
    validarHash,
    changePasswordLogged,
    changePassword,
    recoverPassword,
    getDadosPessoa,
    getPessoa,
    getDocuments,
    getDocumentPicture,
    getStep,
    getCepData,
    confirmarDocumentos,
    setFotoCarteira,
    setDadosComprovanteEndereco,
    setComprovanteEndereco,
    setDadosComprovanteMatricula,
    setComprovanteMatricula,
    setIdentificaoVerso,
    setIdentificaoFrente,
    setDadosIdentificacao,
    setFotoEstudante,
    getInstituicoes,
    setCadastroPessoa,
    saveUser
}