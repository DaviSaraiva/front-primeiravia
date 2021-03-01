import React, { useEffect, useState } from 'react';
// eslint-disable-next-line object-curly-newline
import { Steps, Row, Col, Card, Button } from 'antd';
import 'antd/dist/antd.css';
import './Home.css'
import '../../globals/globalStyle.css';
import Header from '../../visual_components/header/Header';
import { getIdUser, isLogged, logout } from '../../globals/globalFunctions';
import { getDocuments, getPessoa } from '../../services/AccessServices';
import { useHistory } from 'react-router-dom';
import { getTransacao } from '../../services/PagamentosServices';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, DownOutlined, LeftOutlined, SmileOutlined, UpOutlined } from '@ant-design/icons';

import successImage from '../../images/img_success.png'
import failureImage from '../../images/img_failure.png'
import analiseImage from '../../images/img_analise.png'

const STATUS_REC = "recusado"
const STATUS_ANA = "analise"
const STATUS_APR = "aprovado"

const { Step } = Steps;
export default function Home() {
  let history = useHistory()

  if (!isLogged()) {
    history.replace('/')
  }

  let obj = getIdUser()
  const [idUser] = useState(obj.id)

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [instituicao, setInstituicao] = useState("")
  const [isRG, setIsRG] = useState(false)
  const [rg, setRG] = useState("")
  const [cnh, setCNH] = useState("")
  const [dataNascimento, setDataNascimento] = useState("")
  const [periodo, setPeriodo] = useState("")
  const [nomePai, setNomePai] = useState("")
  const [nomeMae, setNomeMae] = useState("")

  const [errosShowed, setErrosShowed] = useState(false)
  const [erros, setErros] = useState<string[]>([])

  const [status, setStatus] = useState(STATUS_ANA)

  useEffect(() => {
    if (isLogged()) {
      getPessoa(idUser).then((res: any) => {
        if (res === undefined) {
          logout()
          history.replace("/")
        } else {
          setNome(res.pessoa.nome)
          setEmail(res.email)
          setInstituicao(res.pessoa.instituicao)

          setDataNascimento(res.pessoa.datanascimento)
          setPeriodo(res.pessoa.serieperiodo)
          setNomePai(res.pessoa.nomepai)
          setNomeMae(res.pessoa.nomemae)

          setIsRG(res.pessoa.tipodocumento === "rg")
          if (res.pessoa.tipodocumento === "rg") {
            setRG(res.pessoa.rg)
          } else {
            setCNH(res.pessoa.registrocnh)
          }
        }
      })

      getDocuments(idUser).then((res: any) => {
        if (res === undefined) {
          logout()
          history.replace("/")
        } else {
          if (res.status === 200) {
            let response = res.data.result

            let list: string[] = []
            if (response.identidadeverso_criticalmessage !== null) { list.push("Verso da identidade: " + response.identidadeverso_criticalmessage) }
            if (response.identidadefrente_criticalmessage !== null) { list.push("Frente da identidade: " + response.identidadefrente_criticalmessage) }
            if (response.fotoestudante_criticalmessage !== null) { list.push("Foto do estudante: " + response.fotoestudante_criticalmessage) }
            if (response.comprovantematricula_criticalmessage !== null) { list.push("Comprovante de matrícula: " + response.comprovantematricula_criticalmessage) }
            if (response.comprovanteendereco_criticalmessage !== null) { list.push("Comprovante de endereço: " + response.comprovanteendereco_criticalmessage) }
            if (response.doccarteiaatual_criticalmessage !== null) { list.push("Carteira atual: " + response.doccarteiaatual_criticalmessage) }

            setErros(list)
          }
        }
      })

      getTransacao(idUser).then((res: any) => {
        if (res === undefined) {
          logout()
          history.replace("/")
        } else {
          if (res.status === 200) {
            if (res.data.__transactions__ !== 404) {
              const atualizacao = res.data.__transactions__[0].requestStatus;
              const pagamento = res.data.__transactions__[0].payment.paymentStatus;
              if (pagamento === null) {
                history.replace('/pagamento')
              } else if (atualizacao === null) {
                history.replace('/atualizacao-cadastral')
              } else {
                if (res.status === 200) {
                  if (atualizacao === 'aprovado' &&
                    pagamento === 'paid'
                  ) {
                    setStatus(STATUS_APR)
                  } else if (atualizacao === 'recusado') {
                    setStatus(STATUS_REC)
                    // setErrosShowed(true)
                  } else if (res.data.paymentStatus === 'aprovado') {
                    setStatus(STATUS_APR)
                  } else if (atualizacao === 'analise' || atualizacao === 'revisado') {
                    setStatus(STATUS_ANA)
                  } else {
                    history.replace('/atualizacao-cadastral')
                  }
                }
              }
            } else {
              history.replace('/pagamento')
            }
          }
        }
      });

    }
  }, [])

  const getDataMessage = () => {
    if (status === STATUS_APR) {
      return {
        title: "Parabéns!",
        subtitle: "",
        imageSrc: successImage,
        message: "Sua ATUALIZAÇÃO CADASTRAL foi realizada com sucesso.",
        submessage: "Faça sua atualização semestralmente e evite o bloqueio do seu cartão estudantil."
      }
    } else if (status === STATUS_REC) {
      return {
        title: "Atenção!",
        subtitle: "Caro estudante, existe alguma divergência no seu pedido de atualização cadastral.",
        imageSrc: failureImage,
        message: "Acesse seus dados e verifique seu pedido.",
        submessage: ""
      }
    } else {
      return {
        title: "Parabéns!",
        subtitle: "Sua solicitação foi concluída com sucesso!",
        imageSrc: analiseImage,
        message: "Seus dados cadastrais serão analisados, e em até 5 (cinco) dias úteis serão concluídos.",
        submessage: "Nós enviaremos um e-mail confirmando sua atualização cadastral. Se preferir, acompanhe através do sistema utilizando seu login e senha."
      }
    }
  }

  const getStatusCard = () => {
    if (status === STATUS_APR) {
      return (
        <Col span={24}>
          <Row className={"statusAtualizacao"}>
            <Col span={0} md={24} lg={24} xl={24} >
              <Steps current={2}>
                <Step title="Cadastro" icon={<CheckCircleOutlined />} />
                <Step title="Análise" icon={<ClockCircleOutlined />} />
                <Step title="Concluído" icon={<SmileOutlined />} />
              </Steps>
            </Col>
            <Col span={24} md={0} lg={0} xl={0} >
              <Steps current={2}>
                <Step title="Cad..." icon={<CheckCircleOutlined />} />
                <Step title="Aná..." icon={<ClockCircleOutlined />} />
                <Step title="Con..." icon={<SmileOutlined />} />
              </Steps>
            </Col>
          </Row>
        </Col>
      )
    } else if (status === STATUS_REC) {
      return (
        <Col span={24}>
          <Row className={"statusAtualizacao"}>
            <Col span={0} md={24} lg={24} xl={24} >
              <Steps current={1} status="error">
                <Step title="Cadastro" icon={<CheckCircleOutlined />} />
                <Step title="Análise" icon={<CloseCircleOutlined />} />
                <Step title="Concluído" status={"wait"} icon={<SmileOutlined />} />
              </Steps>
            </Col>
            <Col span={24} md={0} lg={0} xl={0} >
              <Steps current={1} status="error">
                <Step title="Cad..." icon={<CheckCircleOutlined />} />
                <Step title="Aná..." icon={<CloseCircleOutlined />} />
                <Step title="Con..." status={"wait"} icon={<SmileOutlined />} />
              </Steps>
            </Col>
          </Row>
        </Col>
      )
    } else {
      return (
        <Col span={24}>
          <Row className={"statusAtualizacao"}>
            <Col span={0} md={24} lg={24} xl={24} >
              <Steps current={1}>
                <Step title="Cadastro" icon={<CheckCircleOutlined />} />
                <Step title="Análise" icon={<ClockCircleOutlined />} />
                <Step title="Concluído" status={"wait"} icon={<SmileOutlined />} />
              </Steps>
            </Col>
            <Col span={24} md={0} lg={0} xl={0} >
              <Steps current={1} className={"stepsSmall"}>
                <Step title="Cad..." icon={<CheckCircleOutlined />} />
                <Step title="Aná..." icon={<ClockCircleOutlined />} />
                <Step title="Con..." status={"wait"} icon={<SmileOutlined />} />
              </Steps>
            </Col>
          </Row>
        </Col>
      )
    }
  }

  const getColorText = () => {
    if (status === STATUS_APR) {
      return "#76a109"
    } else if (status === STATUS_REC) {
      return "#c03131"
    } else {
      return "#808080"
    }
  }

  return (
    <div className={"fullDiv"}>
      <Header />
      <Row>
        <Col xs={0} sm={0} md={0} lg={3} xl={3} />

        <Col xs={1} sm={1} md={1} lg={0} xl={0} />
        <Col xs={22} sm={22} md={22} lg={18} xl={18} className={"divDados"}>
          <br />

          <div className={"cardBackHome"}>
            {getStatusCard()}
          </ div>
          <br />
          <div className={"cardBackHome"}>
            <div id={"divMessageSuccess"}>
              <h3 id={"h3Message"} style={{ color: getColorText() }}>{getDataMessage().title}</h3>
              <p id={"pMessage"}>{getDataMessage().subtitle}</p>
              <img id={"imgMessage"} src={getDataMessage().imageSrc} alt={"aaa"} />
              <p id={"pMessage"}>{getDataMessage().message}</p>
              <p id={"pSubMessage"}>{getDataMessage().submessage}</p>
              {
                status === STATUS_REC ? (
                  <Button id={"buttonReprovado"} type={"primary"} onClick={() => setErrosShowed(!errosShowed) /*history.replace("/atualizacao-cadastral")*/}>
                    <p id={"textButtonReprovado"}>Ver os erros {errosShowed ? <UpOutlined /> : <DownOutlined />}</p>
                  </Button>
                ) : (
                    <div />
                  )
              }
              {errosShowed ?
                (
                  <div id={"divErrors"}>
                    <p className={"subTitleMainP"} style={{ color: "#c03131" }}>Esses foram os erros encontrados:</p>
                    <br />
                    <ul>
                      {erros.map((it) => {
                        return <li style={{ margin: "0" }}>{it}</li>
                      })}
                    </ul>
                    <br />
                    <Button type={"dashed"} onClick={() => history.replace("/atualizacao-cadastral")}>
                      <LeftOutlined /> Voltar para a atualização
                    </Button>
                  </div>
                ) : (
                  <div />
                )
              }

            </div>
          </ div>
          <br />
          <Card id={"cardHome"}>
            <p className={"subTitleMainP"}>Veja abaixo, algumas de suas informações</p>
            <br />
            <Row id={"rowCardHome"}>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <p className={"subTitleMainP"}><b>Nome:</b> {nome}</p>
              </Col>
              <br />
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <p className={"subTitleMainP"}><b>E-mail: {email}</b></p>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <p className={"subTitleMainP"}><b>Instituição:</b> {instituicao}</p>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <p className={"subTitleMainP"}><b>{isRG ? "RG:" : "CNH:"}</b> {isRG ? rg : cnh}</p>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <p className={"subTitleMainP"}><b>Data de Nascimento:</b>{dataNascimento}</p>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <p className={"subTitleMainP"}><b>Série/Período:</b> {periodo}</p>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <p className={"subTitleMainP"}><b>Nome da Mãe:</b> {nomeMae}</p>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <p className={"subTitleMainP"}><b>Nome do Pai:</b> {nomePai}</p>
              </Col>
              <br />
              <br />
              <br />
              <Col xs={0} sm={0} md={0} lg={9} xl={9} />
              <Col xs={0} sm={0} md={0} lg={9} xl={9} />
            </Row>
          </Card>
          {/* </div> */}
          <br />
        </Col>
        <Col xs={1} sm={1} md={1} lg={3} xl={3} />
      </Row>
      {/* <Footer /> */}
    </div >
  );
}
