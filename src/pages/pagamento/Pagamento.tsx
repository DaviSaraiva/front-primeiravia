// /* eslint-disable prettier/prettier */
// /* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line object-curly-newline
import { Alert, Col, Row, Tabs, Steps, Form, Input, message, Button, Modal } from 'antd';
import 'antd/dist/antd.css';
import InputMask from 'antd-mask-input';
import './Pagamento.css';
import './Pagamento.scss';
import { cpf } from 'cpf-cnpj-validator';
import { CreditCardOutlined, BarcodeOutlined, AppstoreOutlined, QrcodeOutlined, DownloadOutlined, UserOutlined, PictureOutlined, SolutionOutlined, FileDoneOutlined, HomeOutlined, IdcardOutlined, MessageFilled } from '@ant-design/icons';
import Cards from 'react-credit-cards';
import '../../globals/globalStyle.css'
import 'react-credit-cards/es/styles-compiled.css';
import Header from '../../visual_components/header/Header';
import { useHistory } from 'react-router-dom';
import { getTransacao, postTransacao, verificarPagamento } from '../../services/PagamentosServices';
import MaskedInput from 'antd-mask-input/build/main/lib/MaskedInput';
import { buscarCep, isLogged, logout, validateMaskValue } from '../../globals/globalFunctions';
import { CopyToClipboard } from 'react-copy-to-clipboard'
import logoIugul from '../../images/logo_iugul.png'

const config = {
  title: 'O boleto pode levar até 3 dias úteis para a confirmação do pagamento.',
  content: (<p></p>)
};


// eslint-disable-next-line
export default function Pagamento() {
  let history = useHistory()

  if (!isLogged()) {
    history.replace('/')
  }

  let estudanteModel = { id: "", nome: "", email: "", telefone: "", cpf: "" }
  let estudanteLocal = localStorage.getItem("usuario")

  if (estudanteLocal !== null && estudanteLocal !== undefined) {
    estudanteModel = JSON.parse(estudanteLocal)
  } else {
    localStorage.setItem("functionLooked", "atualizacao")
    history.replace('/')
  }

  const [modal, contextHolder] = Modal.useModal();
  const { Step } = Steps;
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();

  const { TabPane } = Tabs;

  const [iugulPdfUrl, setIugulPdfUrl] = useState('')
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [cepExist, setCepExist] = useState(false);
  const [hasGeneratedQrCode, setQRCodeGenerated] = useState(false);
  const [imgQrCodePixUrl, setImgQrCodePixUrl] = useState('');
  const [qrCodePixUrl, setQrCodePixUrl] = useState('');
  const [tabKey, setTabKey] = useState('1');
  const [numero, setNumero] = useState('');
  const [cvc, setCvc] = useState('');
  const [datev, setDatev] = useState('');
  const [nomec, setNomec] = useState('');
  const [estudante,] = useState(estudanteModel);
  const [focused, setFocused] = useState();
  const [idPix, setIdPix] = useState("");

  useEffect(() => {
    const timer1 = setInterval(() => {
      if (tabKey === "3" && idPix !== "") {
        verificarPagamento(idPix).then((res: any) => {
          if (res === undefined) {
            logout()
            history.replace("/")
          } else {
            if (res.data.status === "paid") {
              // setIdPix("")
              // clearInterval()
              localStorage.setItem("idPix", idPix)
              message.success('Pagamento efetuado com sucesso!')
              history.replace('/atualizacao-cadastral')
            }
          }
        })
      }
    }, 5000);

    return () => {
      clearTimeout(timer1)
    }
  });

  const valueDefault = 7.85

  const valuePlus = () => {
    if (tabKey === '1') {
      return 0
    } else if (tabKey === '2') {
      return 0
    } else {
      return 0
    }
  }

  function changeFocus(e: any) {
    setFocused(e.target.name);
  }

  function updateTab(currentParam: any) {
    if (currentParam !== "2") {
      setVisible(false)
    }

    setTabKey(currentParam)
  }

  useEffect(() => {
    getTransacao(estudante.id).then((res: any) => {
      if (res === undefined) {
        logout()
        history.replace("/")
      } else {
        if (res.data.__transactions__ !== 404) {
          let transaction = res.data.__transactions__[0]

          if (transaction.payment !== undefined) {
            if (transaction.payment.paymentStatus === "paid") {
              history.replace('/redirect')
            } else {
              if (transaction.payment.type_payment === 'bank_slip') {
                warning()
              }
            }
          }
        }
      }
    })
  }, [])

  const Cpf = (values: any) => {
    if (cpf.isValid(values.target.value) === false) {
      message.error('CPF inválido');
    } else {
      message.success('CPF válido');
    }
  }

  const onFinishForm = async (values: any) => {
    let type = 'creditcard'
    let cepIsValid = true
    let cpfIsValid = true

    if (tabKey === "1") {
      cepIsValid = validateMaskValue(values.cep, 8, "cep")
      cpfIsValid = cpf.isValid(values.cpf)
    } else if (tabKey === "2") {
      cepIsValid = validateMaskValue(values.cep, 8, "cep")
      cpfIsValid = cpf.isValid(values.cpf)
      type = 'bank_slip'
    } else {
      type = 'pix'
    }

    if (cepExist && cepIsValid && cpfIsValid) {
      setLoading1(true)

      let response = await postTransacao(estudante.id, type, values, estudanteModel.nome, estudanteModel.email, estudanteModel.telefone)
      if (response === undefined) {
        logout()
        history.replace("/")
      } else {
        if (response.status === 200) {
          if (tabKey === "1") {
            if (response.data.errors.number === undefined) {
              if (response.data.success) {
                message.success(response.data.message)
                history.replace('/atualizacao-cadastral')
              } else {
                message.error("Revise os dados do cartão.");
              }
            } else {
              message.error("Revise os dados do cartão.");
            }
          }

          if (tabKey === "2") {
            setIugulPdfUrl(response.data.secure_url)
            setVisible(true)
          }
          setLoading1(false)
        } else {
          message.error('Algo deu errado!')
          setLoading1(false)
        }
      }
    } else {
      if (!cpfIsValid) {
        message.error('CPF inválido');
      }

      if (!cepExist) {
        message.error('CEP inválido');
      }

      setLoading1(false)
    }
  }

  const onFinishFailed = () => {
    message.error('Não foi possivel salvar seus dados');
    setLoading1(false)
  };

  const updateCEP = async (e: any) => {
    // buscarCep(e)
    const cepvalue = e.target.value
    let cepData = await buscarCep(cepvalue)
    if (cepData !== undefined) {
      if (tabKey === '1') {
        form1.setFieldsValue(cepData);
        form1.setFieldsValue({ 'cidade': cepData.localidade })
      } else if (tabKey === '2') {
        form2.setFieldsValue(cepData)
        form2.setFieldsValue({ 'cidade': cepData.localidade })
      }      
      
      setCepExist(true)
    } else {
      setCepExist(false)
    }
  }

  const getResumoPedido = () => {
    return (
      <div id={"divInformacoes"}>
        <div id={"divLogoIugul"}>
          <p>Pagamento Transparente</p>
          <img src={logoIugul} />
        </div>
        <p id={"titleInformacoes"}>Resumo do pedido {cepExist}</p>
        <Row className={"divProduct"}>
          <Col span={10}>
            <p id={"titleDescriptionProduto"}><b>Produto</b></p>
          </Col>
          <Col span={7} style={{ display: "flex", flexDirection: "row-reverse" }}>
            <p id={"titleDescriptionProduto"}><b>Qtde.</b></p>
          </Col>
          <Col span={7} style={{ display: "flex", flexDirection: "row-reverse" }}>
            <p id={"titleDescriptionProduto"}><b>Valor</b></p>
          </Col>
        </Row>
        <div id={"divider"} />
        <Row className={"divProduct"}>
          <Col span={10}>
            <p id={"subTitleDescriptionProduto"}>Atualização Cadastral</p>
          </Col>
          <Col span={7} style={{ display: "flex", flexDirection: "row-reverse" }}>
            <p id={"subTitleDescriptionProduto"}>1x</p>
          </Col>
          <Col span={7} style={{ display: "flex", flexDirection: "row-reverse" }}>
            <p id={"subTitleDescriptionProduto"}>R$ {(valueDefault).toFixed(2)}</p>
          </Col>
        </Row>
        <div id={"divider"} />
        <Row className={"divProduct"}>
          <Col span={12}>
            <p id={"subTitleTotalProduto"}>Valor total do pedido</p>
          </Col>
          <Col span={12} style={{ display: "flex", flexDirection: "row-reverse" }}>
            <p id={"subTitleTotalProduto"}>R$ {(valueDefault + valuePlus()).toFixed(2)}</p>
          </Col>
        </Row>
        <br />
        <br />
        {tabKey !== "3" ?
          (
            <span style={{ display: "flex", flexDirection: "column-reverse", width: "100%", height: "100%", paddingBottom: "16px" }}>
              {visible ?
                (
                  <Button
                    id={"buttonDownloadPDF"}
                    onClick={() => {
                      modal.info(config);
                    }}>
                    <a id={"aBtnDownload"} href={iugulPdfUrl + ".pdf"} target="_blank" rel="noreferrer">
                      <DownloadOutlined />
                      <p>Baixar o boleto</p>
                    </a>
                  </Button>
                ) : (
                  <Button
                    id={"buttonPagamento"}
                    loading={loading1}
                    onClick={() => {
                      setLoading1(true)
                      tabKey === '1' ? form1.submit() : form2.submit()
                    }}>
                    Confirmar pedido
                  </Button>
                )
              }
            </span>
          ) : (
            <div />
          )
        }

      </div>
    )
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
      icon: <UserOutlined />
    },
    {
      title: 'Foto do Estudante',
      titleCutted: 'Foto Estudante',
      icon: <PictureOutlined />
    },
    {
      title: 'Documento de Identificação',
      titleCutted: 'Identificação',
      icon: <SolutionOutlined />
    },
    {
      title: 'Comprovante de Matrícula',
      titleCutted: 'Matrícula',
      icon: <FileDoneOutlined />
    },
    {
      title: 'Documento de Endereço',
      titleCutted: 'Endereço',
      icon: <HomeOutlined />
    },
    {
      title: 'Carteira atual',
      titleCutted: 'Carteira atual',
      icon: <IdcardOutlined />
    },
  ];

  const warning = () => {
    Modal.warning({
      title: 'Estado do pagamento',
      content: (
        <div>
          <br />
          <Alert message={"Em processamento"} type="warning" />
          <br />
          <p>O seu boleto pode levar até 3 dias úteis para ser compensado, a partir da data do pagamento.</p>
        </div>
      ),
      okText: 'Entendi',
      onOk() { },
    });
  }

  let mensagemTopo = <p style={{ margin: "0px" }}>A <b>ATUALIZAÇÃO CADASTRAL</b> agora é <i>online</i>! Ficou mais fácil, prático e você economiza tempo.</p>
  let subMensagemTopo = <p style={{ margin: "0px" }}>Faça sua <b>ATUALIZAÇÃO CADASTRAL ONLINE</b> por R$ 7,85, ou dirija-se a Central de Atendimento para realizar sua atualização cadastral presencial e sem custo na Avenida Maranhão, nº 28, Centro/Norte.</p>
  let subMensagemTopo2 = <p style={{ margin: "0px" }}>A confirmação de pagamento será enviada por email.</p>

  return (
    <div className={"fullDiv"}>
      <Header />
      <br />
      <div className={"divDados"}>
        <Row>
          <Col xs={0} sm={0} md={0} lg={1} xl={2} />
          <Col xs={24} sm={24} md={24} lg={22} xl={20}>
            <Row className={"divSteps divWithBoxShadow"}>
              <Col xs={0} sm={0} md={0} lg={24} xl={24}>
                <Steps current={0} size={"small"}>
                  {steps.map((item: any) => (
                    <Step
                      key={item.title}
                      title={item.titleCutted}
                      icon={item.icon}
                    />
                  ))}
                </Steps>
              </Col>

              <Col xs={24} sm={24} md={24} lg={0} xl={0}>
                <Steps current={0} size={"small"}>
                  {steps.map((item: any) => (
                    <Step
                      key={item.title}
                      icon={item.icon}
                    />
                  ))}
                </Steps>
              </Col>
            </Row>
          </Col>
          <Col xs={0} sm={0} md={0} lg={1} xl={2} />
        </Row>

        <Row style={{ marginTop: "16px" }}>
          <Col xs={0} sm={0} md={1} lg={1} xl={2} />
          <Col xs={24} sm={24} md={22} lg={22} xl={20}>
            <Alert style={{ marginBottom: "16px" }} showIcon closable message={mensagemTopo} description={subMensagemTopo} />
            <Alert style={{ marginBottom: "16px" }} showIcon closable message={""} description={subMensagemTopo2} />
          </Col>
          <Col xs={0} sm={0} md={1} lg={1} xl={2} />
        </Row>
        <Row>
          <Col xs={0} sm={0} md={0} lg={1} xl={2} />
          <Col xs={24} sm={24} md={24} lg={0} xl={0} />
          <Col id={"divFormPagamento"} xs={24} sm={24} md={24} lg={20} xl={20}>
            <p className={"divTitleMainP"}>Pagamento</p>
            <p className={"subTitleMainP"}>Selecione o tipo de pagamento</p>
            <Row>
              <Col span={24}>
                <Tabs onChange={updateTab} defaultActiveKey={tabKey} type="card" style={{ padding: '0' }}>
                  <TabPane
                    tab={
                      <span>
                        <CreditCardOutlined />
                      Cartão de crédito
                    </span>
                    }
                    key="1"
                  >
                    <Row style={{ minHeight: "10vh", paddingBottom: "2vh" }}>
                      <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                        <div className={"cardForm"}>
                          <p className={"titleInformeDadosPagador"}>Informe os dados do pagador</p>
                          <Form form={form1} onFinish={onFinishForm} onFinishFailed={onFinishFailed}>
                            <Row>
                              <Col xs={2} sm={2} md={2} lg={0} xl={0} />
                              <Col xs={0} sm={0} md={0} lg={0} xl={6}>
                                <br />
                                <div>
                                  <Cards
                                    cvc={cvc}
                                    name={nomec}
                                    number={numero}
                                    expiry={datev}
                                    focused={focused}
                                    locale={{ valid: 'valido até' }}
                                    placeholders={{ name: 'Seu nome aqui' }}
                                  />
                                </div>
                              </Col>
                              <Col xs={0} sm={0} md={0} lg={0} xl={1} />
                              <Col xs={24} sm={24} md={24} lg={24} xl={17}>
                                <Row>
                                  {/* dados cartao */}
                                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <p className={"labelInputField"}>* Numero do Cartão:</p>
                                    <Form.Item
                                      name="numerocartao"
                                      rules={[
                                        {
                                          required: true,
                                          message: 'Insira o numero do seu Cartão',
                                        },
                                      ]}
                                    >
                                      <InputMask
                                        className={"inputText"}
                                        name="numero"
                                        inputMode="numeric"
                                        onChange={(e) => setNumero(e.target.value)}
                                        onFocus={changeFocus}
                                        mask="1111 1111 1111 1111"
                                      />
                                    </Form.Item>
                                  </Col>
                                  <Col xs={16} sm={16} md={4} lg={8} xl={8}>
                                    <p className={"labelInputField"}>Vencimento:</p>
                                    <Form.Item
                                      name="vencimento"
                                      labelCol={{ span: 24 }}
                                      rules={[
                                        {
                                          required: true,
                                          message: 'Insira a data de vencimento do cartão',
                                        },
                                      ]}
                                    >
                                      <InputMask
                                        className={"inputText"}
                                        name="datev"
                                        // eslint-disable-next-line
                                        onChange={(e) => setDatev(e.target.value)}
                                        onFocus={changeFocus}
                                        mask="11/1111"
                                        inputMode="numeric"
                                        placeholder="(MM/AAAA)"
                                      />
                                    </Form.Item>

                                  </Col>
                                  <Col xs={8} sm={8} md={8} lg={4} xl={4}>
                                    <p className={"labelInputField"}>* CVV:</p>
                                    <Form.Item
                                      name="cvc"
                                      labelCol={{ span: 24 }}
                                      rules={[
                                        {
                                          required: true,
                                          message: 'Insira o CVV do cartão',
                                        },
                                      ]}
                                    >
                                      <MaskedInput
                                        className={"inputText"}
                                        mask="111"
                                        name="cvc"
                                        inputMode="numeric"
                                        // eslint-disable-next-line
                                        onChange={(e) => setCvc(e.target.value)}
                                        onFocus={changeFocus}
                                      />
                                    </Form.Item>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col xs={24} sm={24} md={24} lg={14} xl={14}>
                                    <p className={"labelInputField"}>* Nome do titular do cartão:</p>
                                    <Form.Item
                                      name="name"
                                      labelCol={{ span: 24 }}
                                      rules={[
                                        {
                                          required: true,
                                          message: 'Insira um nome',
                                        },
                                      ]}
                                    >
                                      <Input className="inputText" name="nomec" onChange={(e) => setNomec(e.target.value)} onFocus={changeFocus} />
                                    </Form.Item>
                                  </Col>
                                  <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                                    <p className={"labelInputField"}>* CPF:</p>
                                    <Form.Item
                                      name="cpf"
                                      labelCol={{ span: 24 }}
                                      rules={[
                                        {
                                          required: true,
                                          message: 'INSIRA SEU CPF',
                                        },
                                      ]}
                                    >
                                      <InputMask
                                        className="inputText"
                                        mask="111.111.111-11"
                                        inputMode="numeric"
                                        onBlur={Cpf}
                                        onFocus={changeFocus}
                                      />
                                    </Form.Item>
                                  </Col>
                                </Row>
                                <br />
                              </Col>
                            </Row>
                            <Row>
                              {/* cep */}
                              <Col xs={24} sm={24} md={24} lg={4} xl={5}>
                                <p className={"labelInputField"}>* CEP:</p>
                                <Form.Item
                                  name="cep"
                                  labelCol={{ span: 24 }}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Insira seu Cep',
                                    },
                                  ]}
                                >
                                  <InputMask
                                    className="inputText"
                                    mask="11.111-111"
                                    inputMode="numeric"
                                    onBlur={updateCEP}
                                    onFocus={changeFocus}
                                  />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={24} md={24} lg={8} xl={9}>
                                <p className={"labelInputField"}>* Logradouro:</p>
                                <Form.Item
                                  name="logradouro"
                                  labelCol={{ span: 24 }}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Insira o logradouro',
                                    },
                                  ]}
                                >
                                  <Input id="localdouro" className={"inputText"} onFocus={changeFocus} />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                                <p className={"labelInputField"}>* Número:</p>
                                <Form.Item
                                  name="numerocasa"
                                  labelCol={{ span: 24 }}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Insira o número da casa',
                                    },
                                  ]}
                                >
                                  <Input type="number" className={"inputText"} onFocus={changeFocus} />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={24} md={24} lg={8} xl={6} >
                                <p className={"labelInputField"}>* Bairro:</p>
                                <Form.Item
                                  name="bairro"
                                  labelCol={{ span: 24 }}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Insira seu bairro',
                                    },
                                  ]}
                                >
                                  <Input className={"inputText"} onFocus={changeFocus} />
                                </Form.Item>
                              </Col>
                            </Row>
                            <Row>
                              {/* complemento */}
                              <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                                <p className={"labelInputField"}>Complemento:</p>
                                <Form.Item
                                  name={"complemento"}
                                  labelCol={{ span: 24 }}
                                // rules={[
                                //   {
                                //     required: true,
                                //     message: 'Insira sua cidade',
                                //   },
                                // ]}
                                >
                                  <Input className="inputText" onFocus={changeFocus} />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                                <p className={"labelInputField"}>* Cidade:</p>
                                <Form.Item
                                  name="cidade"
                                  labelCol={{ span: 24 }}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Insira sua cidade',
                                    },
                                  ]}
                                >
                                  <Input className={"inputText"} onFocus={changeFocus} />
                                </Form.Item>
                              </Col>
                              <Col xs={12} sm={12} md={24} lg={4} xl={4}>
                                <p className={"labelInputField"}>* UF:</p>
                                <Form.Item
                                  name="uf"
                                  labelCol={{ span: 24 }}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Insira sua cidade',
                                    },
                                  ]}
                                >
                                  <InputMask className="inputText" mask="AA" onFocus={changeFocus} />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Form>
                        </div>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={1} xl={1} />
                      <Col xs={24} sm={24} md={24} lg={7} xl={7}>
                        {getResumoPedido()}
                      </Col>
                    </Row>

                  </TabPane>
                  <TabPane
                    tab={
                      <span>
                        <BarcodeOutlined />
                      Boleto
                    </span>
                    }
                    key="2"
                  >
                    <Form form={form2} onFinish={onFinishForm} onFinishFailed={onFinishFailed}>
                      <Row style={{ minHeight: "10vh", paddingBottom: "2vh" }}>
                        <Col span={24} lg={16} xl={16}>
                          <div className={"cardForm"}>
                            <Row style={{ paddingLeft: "6px" }}>
                              <Col span={1} />
                              <Col span={22}>
                                <p className={"titleInformeDadosPagador"}>Informe os dados do pagador</p>
                              </Col>
                              <Col span={1} />
                            </Row>
                            <Row className="tab2">
                              <Col span={0} lg={1} xl={1} />
                              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                                <p className={"labelInputField"}>* CPF:</p>
                                <Form.Item
                                  name="cpf"
                                  labelCol={{ span: 24 }}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Insira o seu CPF',
                                    },
                                  ]}
                                >
                                  <InputMask
                                    mask="111.111.111-11"
                                    className="inputText"
                                    onBlur={Cpf}
                                  />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={24} md={24} lg={14} xl={14}>
                                <p className={"labelInputField"}>Nome Completo:</p>
                                <Form.Item
                                  name="name"
                                  labelCol={{ span: 24 }}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Insira um nome',
                                    },
                                  ]}
                                >
                                  <Input className="inputText" />
                                </Form.Item>
                              </Col>
                              <Col span={0} lg={1} xl={1} />
                            </Row>
                            <Row>
                              <Col span={0} lg={1} xl={1} />
                              <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                                <p className={"labelInputField"}>* CEP:</p>
                                <Form.Item
                                  name="cep"
                                  labelCol={{ span: 24 }}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Insira seu Cep',
                                    },
                                  ]}
                                >
                                  <InputMask mask="11.111-111" onBlur={updateCEP} className="inputText" />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                                <p className={"labelInputField"}>* Logradouro:</p>
                                <Form.Item
                                  name="logradouro"
                                  labelCol={{ span: 24 }}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Insira o logradouro',
                                    },
                                  ]}
                                >
                                  <Input className="inputText" />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                                <p className={"labelInputField"}>* Número:</p>
                                <Form.Item
                                  name="numerocasa"
                                  labelCol={{ span: 24 }}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Insira o numero da casa',
                                    },
                                  ]}
                                >
                                  <Input type="number" className="inputText" />
                                </Form.Item>
                              </Col>
                              <Col span={0} lg={1} xl={1} />
                            </Row>

                            <Row>
                              <Col span={0} lg={1} xl={1} />
                              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                                <p className={"labelInputField"}>* Bairro:</p>
                                <Form.Item
                                  name="bairro"
                                  labelCol={{ span: 24 }}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Insira seu bairro',
                                    },
                                  ]}
                                >
                                  <Input className="inputText" />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                                <p className={"labelInputField"}>* Cidade:</p>
                                <Form.Item
                                  name="cidade"
                                  labelCol={{ span: 24 }}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Insira sua cidade',
                                    },
                                  ]}
                                >
                                  <Input className="inputText" />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                                <p className={"labelInputField"}>* UF:</p>
                                <Form.Item
                                  name="uf"
                                  labelCol={{ span: 24 }}
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Insira seu estado',
                                    },
                                  ]}
                                >
                                  <InputMask mask="AA" className="inputText" />
                                </Form.Item>
                              </Col>
                              <Col span={0} lg={1} xl={1} />
                            </Row>
                          </div>
                        </Col>
                        <Col span={24} lg={1} xl={1} />
                        <Col span={24} lg={7} xl={7}>
                          {getResumoPedido()}
                        </Col>

                      </Row>
                    </Form>
                  </TabPane>
                  <TabPane
                    tab={
                      <span>
                        <AppstoreOutlined rotate={45} />
                      Pix
                    </span>
                    }
                    key="3"
                  >
                    <Row>
                      <Col xs={0} sm={0} md={0} lg={3} xl={7}></Col>

                      <Col className={"cardForm"} style={{ padding: "16px" }} xs={24} sm={24} md={24} lg={18} xl={10}>
                        <div id={"divLogoIugul"}>
                          <p>Pagamento Transparente</p>
                          <img src={logoIugul} />
                        </div>
                        <div>
                          <div style={{ display: "flex", flexDirection: "row" }}>
                            <img src={"https://logospng.org/download/pix/logo-pix-icone-256.png"} alt={"pix_img"} style={{ height: "24px", marginRight: "6px" }} />
                            <p className={"subTitleMainP"} style={{ fontSize: "18px" }}>Pagar com Pix</p>
                          </div>
                          <br />
                          <p className={"subTitleDescriptionProduto"}>Pague com o <b>Pix</b> em qualquer dia e a qualquer hora! O pagamento é instantâneo, prático e pode
                              ser feito em poucos segundos. Rápido e seguro.</p>
                          <div style={{ minHeight: "30vh" }}>
                            <Row>
                              <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{ display: "flex", flexDirection: "column", alignItems: 'center', justifyContent: "center" }}>
                                {
                                  !hasGeneratedQrCode ?
                                    (
                                      <Button onClick={() => {
                                        setLoading(true)
                                        postTransacao(estudante.id, 'pix', {}, estudanteModel.nome, estudanteModel.email, estudanteModel.telefone).then((res: any) => {
                                          setLoading(false)
                                          setImgQrCodePixUrl(res.data.pix.qrcode)
                                          setQrCodePixUrl(res.data.pix.qrcode_text)
                                          setQRCodeGenerated(true)
                                          setIdPix(res.data.id)
                                        })
                                      }} loading={loading} type="primary" shape="round" icon={<QrcodeOutlined />} size={"middle"}>
                                        Gerar QR Code
                                      </Button>
                                    ) : (
                                      <div className={"divLinkPix"}>
                                        <img id={"imgQrCode"} alt={"pix_qr_code"} src={imgQrCodePixUrl} />
                                        <CopyToClipboard text={qrCodePixUrl} onCopy={() => message.info("Copiado!")}>
                                          <Button type={"link"}>Ou copie o link para pagar.</Button>
                                        </CopyToClipboard>
                                        <br />
                                      </div>
                                    )
                                }
                              </Col>
                              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                  <div style={{ height: "33%", width: "100%", marginTop: "8px" }}>
                                    <p style={{ fontSize: "16px" }}><b>1.</b> abra o app do seu banco ou instituição financeira e entre no ambiente <b>Pix</b>.</p>
                                  </div>
                                  <div style={{ height: "33%", width: "100%" }}>
                                    <p style={{ fontSize: "16px" }}><b>2.</b> escolha a opção <b>pagar com o qr code</b>  e escaneie o código ao lado.</p>
                                  </div>
                                  <div style={{ height: "33%", width: "100%" }}>
                                    <p style={{ fontSize: "16px" }}><b>3.</b> confirme as informações e finalize a compra.</p>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </div>
                          <div id={"divider"} />
                          <div style={{ display: "flex", flexDirection: "row", justifyContent: 'space-between' }}>
                            <p className={"subTitleMainP"}><b>Total:</b></p>
                            <p className={"subTitleMainP"}><b>R$ {(valueDefault + valuePlus()).toFixed(2)}</b></p>
                          </div>
                        </div>
                      </Col>
                      <Col xs={0} sm={0} md={0} lg={3} xl={7}></Col>
                    </Row>
                  </TabPane>
                </Tabs>
              </Col>
            </Row>

          </Col>
        </Row>
        <Col xs={0} sm={0} md={0} lg={1} xl={2} />
      </div>
      { contextHolder}
      {/* <Footer /> */}
    </div >
  );
}