import { useEffect, useState } from "react";
import { Col, Row } from "antd";
import "../../globals/globalStyle.css";
import { getIdUser } from "../../globals/globalFunctions";
import { getDadosPessoa } from "../../services/AccessServices";


function ModalVerifyInfoEstudante() {
    let obj = getIdUser()
    const [idUser] = useState(obj.id)
    const [pessoa, setPessoa]: any = useState({})

    useEffect(() => {
        getDadosPessoa(idUser)
            .then((res: any) => {
                if (res.status === 200) {
                    const dados = res.data.pessoa;
                    setPessoa(dados)
                }
            })
    }, [])

    const getEscolaridade = (escolaridade: string) => {
        if (escolaridade === "ensinofundamental") {
            return "Ensino Fundamental"
        } else if (escolaridade === "ensinomedio") {
            return "Ensino Médio"
        } else if (escolaridade === "graduacao") {
            return "Graduação"
        } else {
            return "Pós-Graduação"
        }
    }

    return (
        <div>
            <Row className={"firstRowFinalModal"}>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} className={"colFinalModal"}>
                    <p className={"labelInputField"}>Nome: </p>
                    <p>{pessoa.nome}</p>
                </Col>
                <Col xs={24} sm={24} md={24} lg={6} xl={6} className={"colFinalModal"}>
                    <p className={"labelInputField"}>CPF:</p>
                    <p>{pessoa.cpf}</p>
                </Col>
                <Col xs={24} sm={24} md={24} lg={6} xl={6} className={"colFinalModal"}>
                    <p className={"labelInputField"}>Telefone:</p>
                    <p>{pessoa.telefone}</p>
                </Col>
                <Col xs={24} sm={24} md={24} lg={4} xl={4} className={"colFinalModal"}>
                    <p className={"labelInputField"}>Gênero:</p>
                    <p>{pessoa.genero}</p>
                </Col>
            </Row>
            <div id={"divider"} />
            <Row className={"rowsFinalModal"}>
                <Col xs={24} sm={24} md={24} lg={6} xl={6} className={"colFinalModal"}>
                    <p className={"labelInputField"}>Escolaridade:</p>
                    <p>{getEscolaridade(pessoa.escolaridade)}</p>
                </Col>
                <Col xs={24} sm={24} md={24} lg={3} xl={3} className={"colFinalModal"}>
                    <p className={"labelInputField"}>Série/Período:</p>
                    <p>{pessoa.serieperiodo}</p>
                </Col>
                <Col xs={24} sm={24} md={24} lg={7} xl={7} className={"colFinalModal"}>
                    <p className={"labelInputField"}>Instituição:</p>
                    <p>{pessoa.instituicao}</p>
                </Col>
                <Col xs={24} sm={24} md={24} lg={4} xl={4} className={"colFinalModal"}>
                    <p className={"labelInputField"}>Estado da escola:</p>
                    <p>{pessoa.ufescola}</p>
                </Col>
                <Col xs={24} sm={24} md={24} lg={4} xl={4} className={"colFinalModal"}>
                    <p className={"labelInputField"}>Cidade da escola:</p>
                    <p>{pessoa.cidadeescola}</p>
                </Col>
            </Row>
            <div id={"divider"} />
            <Row className={"rowsFinalModal"}>
                <Col xs={24} sm={24} md={24} lg={4} xl={4} className={"colFinalModal"}>
                    <p className={"labelInputField"}>RG:</p>
                    <p>{pessoa.rg}</p>
                </Col>
                <Col xs={24} sm={24} md={24} lg={4} xl={4} className={"colFinalModal"}>
                    <p className={"labelInputField"}>CNH:</p>
                    <p>{pessoa.registrocnh}</p>
                </Col>
                <Col xs={24} sm={24} md={24} lg={4} xl={4} className={"colFinalModal"}>
                    <p className={"labelInputField"}>Data de nascimento:</p>
                    <p>{pessoa.datanascimento}</p>
                </Col>
                <Col xs={24} sm={24} md={24} lg={6} xl={6} className={"colFinalModal"}>
                    <p className={"labelInputField"}>Nome da mãe:</p>
                    <p>{pessoa.nomemae}</p>
                </Col>
                <Col xs={24} sm={24} md={24} lg={6} xl={6} className={"colFinalModal"}>
                    <p className={"labelInputField"}>Nome do Pai:</p>
                    <p>{pessoa.nomepai}</p>
                </Col>
            </Row>
            <div id={"divider"} />
            <Row className={"rowsFinalModal"}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} className={"colFinalModal"}>
                    <p className={"labelInputField"}>Matrícula:</p>
                    <p>{pessoa.numregistro}</p>
                </Col>
                <Col xs={24} sm={24} md={24} lg={6} xl={6} className={"colFinalModal"}>
                    <p className={"labelInputField"}>Turno:</p>
                    <p>{pessoa.turno}</p>
                </Col>
                <Col xs={24} sm={24} md={24} lg={6} xl={6} className={"colFinalModal"}>
                    <p className={"labelInputField"}>Ano de Conclusão:</p>
                    <p>{pessoa.anodeconclusao}</p>
                </Col>
            </Row>
            <div id={"divider"} />
            <Row className={"rowsFinalModal"}>
                <Col xs={24} sm={24} md={24} lg={4} xl={4} className={"colFinalModal"}>
                    <p className={"labelInputField"}>CEP:</p>
                    <p>{pessoa.cep}</p>
                </Col>
                <Col xs={24} sm={24} md={24} lg={6} xl={6} className={"colFinalModal"}>
                    <p className={"labelInputField"}>Cidade:</p>
                    <p>{pessoa.localidade}</p>
                </Col>
                <Col xs={24} sm={24} md={24} lg={2} xl={2} className={"colFinalModal"}>
                    <p className={"labelInputField"}>Estado:</p>
                    <p>{pessoa.uf}</p>
                </Col>
                <Col xs={24} sm={24} md={24} lg={6} xl={6} className={"colFinalModal"}>
                    <p className={"labelInputField"}>Logradouro:</p>
                    <p>{pessoa.logradouro}</p>
                </Col>
                <Col xs={24} sm={24} md={24} lg={4} xl={4} className={"colFinalModal"}>
                    <p className={"labelInputField"}>Bairro:</p>
                    <p>{pessoa.bairro}</p>
                </Col>
                <Col xs={24} sm={24} md={24} lg={2} xl={2} className={"colFinalModal"}>
                    <p className={"labelInputField"}>Número:</p>
                    <p>{pessoa.numero}</p>
                </Col>
            </Row>
            <div id={"divider"} />
        </div>
    )
}

export default ModalVerifyInfoEstudante;