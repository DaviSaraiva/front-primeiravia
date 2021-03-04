import React, { useEffect, useState } from 'react';
// eslint-disable-next-line object-curly-newline
import 'antd/dist/antd.css';
import './Loading.css';
import '../../globals/globalStyle.css'
import { useHistory } from 'react-router-dom';
import { getTransacaoPrimeira, verificarPagamentoPrimeira } from '../../services/PagamentosServices';
import { isLogged, logout } from '../../globals/globalFunctions';

// eslint-disable-next-line no-console
// eslint-disable-next-line react-hooks/rules-of-hooks

export default function LoadingPrimeira() {
    let history = useHistory()

    if (!isLogged()) {
        history.replace('/')
    }

    const [hasAddress, setHasAddress] = useState(false)
    const [address, setAddress] = useState("")

    let estudanteObj = localStorage.getItem("usuario")
    let estudanteLocal = { id: "" }
    if (estudanteObj !== null) {
        estudanteLocal = JSON.parse(estudanteObj)
    }

    let urlSolicitante = localStorage.getItem("functionLooked")

    useEffect(() => {
        const timer1 = setInterval(() => {
            if (hasAddress) {
                history.replace({
                    pathname: address,
                    state: {
                        origin: 'primeiravia'
                    }
                })
            }
        }, 1000);

        return () => {
            clearTimeout(timer1)
        }
    });


    useEffect(() => {

        getTransacaoPrimeira(estudanteLocal.id)
            .then((res: any) => {
                if (res === undefined) {
                    logout()
                    history.replace("/")
                } else {
                    if (res.data.__transactions__ !== 404) {
                        let transaction = res.data.__transactions__[0];
                        let atualizacao = res.data.__transactions__[0].requestStatus;
                        alert(atualizacao)
                        if (transaction.payment !== undefined) {
                            if (transaction.payment.paymentStatus === "paid") {
                                if (atualizacao === "first") {
                                    setHasAddress(true)
                                    setAddress('/primeiravia-cadastro')
                                    localStorage.setItem("isf", "true")
                                } else {
                                    if (urlSolicitante === "bloqueio") {
                                        setHasAddress(true)
                                        if (atualizacao === "aprovado") {
                                            setAddress('/minhas-solicitacoes')
                                        } else {
                                            setAddress('/home')
                                        }
                                    } else {
                                        setHasAddress(true)
                                        setAddress('/home')
                                    }
                                }
                            } else {
                                setHasAddress(true)
                                setAddress('/pagamento')
                            }
                        }

                    } else {
                        setHasAddress(true)
                        setAddress('/pagamento')
                    }
                }
            })
            .catch(() => {

            })

        let idPixStorage = localStorage.getItem("idPix")
        if (idPixStorage !== undefined && idPixStorage != null) {
            verificarPagamentoPrimeira(idPixStorage).then((res: any) => {
                if (res === undefined) {
                    logout()
                    history.replace("/")
                } else {
                    if (res.data.status === "paid") {
                        setHasAddress(true)
                        setAddress('/primeiravia-cadastro')
                    }
                }
            })
        }
    }, [estudanteLocal.id, history, urlSolicitante])

    return (
        <div className={"fullDiv"}>
            <div id={"divRedirectContent"}>
                <p>tudo bem hahahiih{address}</p>
                <img id={"loadingImg"} src={"http://portal.ufvjm.edu.br/a-universidade/cursos/grade_curricular_ckan/loading.gif"} alt={"loading"} />
                <img id={"logoRedirect"} src={"http://transmobibeneficios.com.br/estudante/assets/images/logo.svg"} alt={"logo"} />
            </div>
        </div>
    );
}