import React, { useState, useEffect } from 'react';
// eslint-disable-next-line object-curly-newline
import { Steps, Row, Col, message, Alert } from 'antd';
import 'antd/dist/antd.css';
import '../../../globals/globalStyle.css'
import './CadastroPessoa.css';
import Infoestudante from '../forms_cadastro/InfoEstudante';
import Fotoestudante from '../forms_cadastro/FotoEstudante';
import Documentoident from '../forms_cadastro/DocumentoIdentificacao';
import ComprovanteMatricula from '../forms_cadastro/ComprovanteMatricula';
import ComprovanteEndereco from '../forms_cadastro/ComprovanteEndereco';
import FotoCarteiraEstudante from '../forms_cadastro/CarteiraEstudante';
import Header from '../../../visual_components/header/Header';
import { useHistory } from 'react-router-dom';
import { CreditCardOutlined, FileDoneOutlined, HomeOutlined, IdcardOutlined, PictureOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { getStep } from '../../../services/AccessServices';
import { getTransacaoPrimeira, verificarPagamentoPrimeira } from '../../../services/PagamentosServices';
import { isLogged, logout } from '../../../globals/globalFunctions';

const { Step } = Steps;

// eslint-disable-next-line no-console
// eslint-disable-next-line react-hooks/rules-of-hooks
export function validarImg(error: string) {
  if (error === 'size') {
    message.error('Tamanho maximo de arquivo deve ser de 5MB');
  }
  if (error === 'format') {
    message.error('Formato não aceito, apenas PNG e JPEG');
  }
}
export default function CadastroPessoa() {
  let history = useHistory()

  if (!isLogged()) {
    history.replace('/')
  }

  let estudanteModel = { id: "", nome: "" }
  let estudanteLocal = localStorage.getItem("usuario")


  if (estudanteLocal !== null && estudanteLocal !== undefined) {
    estudanteModel = JSON.parse(estudanteLocal)
  } else {
    localStorage.setItem("functionLooked", "atualizacao")
    history.replace('/')
  }


  const [firstAccess, setFirstAccess] = useState(false)
  const [current, setCurrent] = useState(1);
  const [estado, setEstado] = useState("analise");
  const [idTransaction, setIdTransaction] = useState("")

  const setStep = (varEstado: string) => {
    let isFirstAccess = false
    let isf = localStorage.getItem("isf")

    getStep(estudanteModel.id).then((res: any) => {
      if (varEstado === "first") {
        localStorage.setItem("isFirst", "true")
      }

      if (isf !== null && isf !== undefined) {
        isFirstAccess = isf === "true" && res.step === 0
        localStorage.setItem("isf", "false")
      }

      setFirstAccess(isFirstAccess)

      if (varEstado === 'recusado' || varEstado === "first") {
        if (res.step < 6) {
          setCurrent(res.step + 1)
        } else if (res.step >= 6) {
          setCurrent(res.step >= 6 ? 1 : res.step + 1)
        } else {
          setCurrent(1)
        }
      } else {
        history.replace('/redirectprimeira')
      }
    })
  }

  useEffect(() => {
    if (isLogged()) {
      let idPix: any = localStorage.getItem("idPix")
      let varEstado = "first"
      if (idPix === null || idPix === undefined || idPix === "") {
        getTransacaoPrimeira(estudanteModel.id)
          .then((res: any) => {
            if (res !== undefined) {
              if (res.data.__transactions__ !== 404) {
                if (res.status === 200) {
                  const atualizacao = res.data.__transactions__[0].requestStatus;
                  const payment = res.data.__transactions__[0].payment.paymentStatus;

                  setIdTransaction(res.data.__transactions__[0].id)
                  // alert(JSON.stringify(atualizacao !== undefined && atualizacao !== null && payment !== undefined && payment !== null && payment!=="paid"))
                  if (atualizacao !== undefined && atualizacao !== null && payment !== undefined && payment !== null) {
                    if (payment === "paid") {
                      varEstado = atualizacao
                    } else {
                      history.replace("/redirectprimeira")
                    }
                  } else {
                    history.replace("/redirectprimeira")
                    varEstado = "first"
                  }
                } else {
                  history.replace('/redirectprimeira')
                }
              } else {
                history.replace('/redirectprimeira')
              }
            }


            setStep(varEstado)
          })

      } else {
        let pixIsPaid = false
        verificarPagamentoPrimeira(idPix)
          .then((res: any) => {
            if (res === undefined) {
              logout()
              history.replace("/")
            } else {
              if (res.data.status === "paid") {
                pixIsPaid = true
                getTransacaoPrimeira(estudanteModel.id).then((res: any) => {
                  if (res.data.__transactions__ !== 404) {
                    if (res.status === 200) {
                      const atualizacao = res.data.__transactions__[0].requestStatus;

                      setIdTransaction(res.data.__transactions__[0].id)

                      if (pixIsPaid) {
                        if (atualizacao !== undefined && atualizacao !== null) {
                          if (atualizacao === 'aprovado') {
                            setEstado("aprovado")
                            varEstado = "aprovado"
                          } else if (atualizacao === 'recusado') {
                            setEstado("recusado")
                            varEstado = "recusado"
                          } else if (atualizacao === "first") {
                            setEstado("first")
                            varEstado = "first"
                          } else if (res.data.paymentStatus === 'aprovado') {
                            setEstado("aprovado")
                            varEstado = "aprovado"
                          }
                        } else {
                          varEstado = "first"
                        }
                      } else {
                        history.replace('/redirectprimeira')
                      }
                    }
                  } else {
                    varEstado = "first"
                  }
                });
              } else {
                history.replace('/redirectprimeira')
              }
            }
            setStep(varEstado)
          })
      }
    }
  }, []);

  const currentPlusUnum = () => {
    setFirstAccess(false)
    setCurrent(current + 1)
  }

  const currentMinusUnum = () => {
    setFirstAccess(false)
    setCurrent(current - 1)
  }

  const steps = [
    {
      title: 'Pagamento',
      titleCutted: 'Pagamento',
      icon: <CreditCardOutlined />
    },
    {
      title: 'Informação do Estudante',
      titleCutted: 'Info Estudante',
      content: <Infoestudante goToNext={currentPlusUnum} />,
      icon: <UserOutlined />
    },
    {
      title: 'Foto do Estudante',
      titleCutted: 'Foto Estudante',
      content: <Fotoestudante
        goToNext={currentPlusUnum}
        goToPrev={currentMinusUnum}
        idTransaction={idTransaction}
      />,
      icon: <PictureOutlined />
    },
    {
      title: 'Documento de Identificação',
      titleCutted: 'Identificação',
      content: <Documentoident
        goToNext={currentPlusUnum}
        goToPrev={currentMinusUnum}
        idTransaction={idTransaction}
      />,
      icon: <SolutionOutlined />
    },
    {
      title: 'Comprovante de Matrícula',
      titleCutted: 'Matrícula',
      content: <ComprovanteMatricula
        goToNext={currentPlusUnum}
        goToPrev={currentMinusUnum}
        idTransaction={idTransaction}
      />,
      icon: <FileDoneOutlined />
    },
    {
      title: 'Documento de Endereço',
      titleCutted: 'Endereço',
      content: <ComprovanteEndereco
        goToNext={currentPlusUnum}
        goToPrev={currentMinusUnum}
        idTransaction={idTransaction}
      />,
      icon: <HomeOutlined />
    },
    {
      title: 'Carteira atual',
      titleCutted: 'Carteira atual',
      content: <FotoCarteiraEstudante
        goToPrev={currentMinusUnum}
        idTransaction={idTransaction}
      />,
      icon: <IdcardOutlined />
    },
  ];

  const onChangeTab = (current: number) => {
    if (current !== 0 && estado === 'recusado') {
      setCurrent(current)
    }
  };

  const messageTopo = "Parabéns!"
  const subMessageTopo = "Seu pagamento foi realizado com sucesso! Informe os seus dados  para dar continuidade no seu pedido de ATUALIZAÇÃO CADASTRAL..."

  return (
    <div className={"fullDiv"}>
      <Header />

      <Row className={"divDados"}>
        <Col xs={1} sm={1} md={1} lg={1} xl={2} />
        <Col xs={22} sm={22} md={22} lg={22} xl={20} className={"paddingT16"}>
          <Row className={"divSteps divWithBoxShadow"}>
            <Col span={0} lg={24} xl={24}>
              <Steps current={current} size={"small"} onChange={onChangeTab}>
                {steps.map((item: any) => (
                  <Step
                    key={item.title}
                    title={item.titleCutted}
                    icon={item.icon}
                  />
                ))}
              </Steps>
            </Col>

            <Col span={24} lg={0} xl={0}>
              <Steps current={current} size={"small"} onChange={onChangeTab}>
                {steps.map((item: any) => (
                  <Step
                    key={item.title}
                    icon={item.icon}
                  />
                ))}
              </Steps>
            </Col>
          </Row>

          {
            firstAccess ? (
              <Alert style={{ marginTop: "16px", marginBottom: "16px" }} type={"success"} showIcon closable message={messageTopo} description={subMessageTopo} />
            ) : (
                <div />
              )
          }

          <Row className={"cardFormAtualizacao"}>
            <Col span={24}>
              <p className={"divTitleMainP"}>{steps[current].title}</p>
              <div>{steps[current].content}</div>
            </Col>
          </Row>
        </Col>
        <Col xs={1} sm={1} md={1} lg={1} xl={2} />

      </Row>
      {/* <Footer /> */}
    </div>
  );
}