import React, { useState } from "react";
// import { useHistory } from "react-router-dom";
//import logo from './logo.svg';
import "./NovaSolicitacao.css";
import "../../globals/globalStyle.css";
import { MaskedInput } from "antd-mask-input";
import "antd/dist/antd.css";
import { Col, Row, Form, Input, Select, Modal, message } from "antd";
import { isLogged, validateCPF, validateEmail, validateEscola, validateNome, validatePhone } from "../../globals/globalFunctions";
import { postSolicitacao } from "../../services/SolicitacoesService";
import { useHistory } from "react-router-dom";
import HeaderSimple from "../../visual_components/header/HeaderSimple";
import FooterSimple from "../../visual_components/footer/FooterSimple";
import InputMask from 'antd-mask-input';

function NovaSolicitacao() {
  // Declare uma nova variável de state, a qual chamaremos de "count"
  let estudante = { id: "", pessoaId: "", nome: "", email: "", telefone: "", cpf: "" }
  let history = useHistory()

  if (!isLogged()) {
    history.replace('/')
  }

  let estudanteLocal = localStorage.getItem("usuario")

  if (estudanteLocal !== null && estudanteLocal !== undefined) {
    estudante = JSON.parse(estudanteLocal)
  } else {
    localStorage.setItem("functionLooked", "bloqueio")
    history.replace('/')
  }

  const { Option } = Select;
  const [form] = Form.useForm();

  const [nome, setNome] = useState(estudante.nome);
  const [email, setEmail] = useState(estudante.email);
  const [telefone, setTelefone] = useState(estudante.telefone);
  const [cpf, setCPF] = useState("");
  const [escola, setEscola] = useState(" ");
  const [motivo, setMotivo] = useState("1");

  const setNomeApply = (e: any) => {
    setNome(e.target.value);
  };
  const setEmailApply = (e: any) => {
    setEmail(e.target.value);
  };
  const setTelefoneApply = (e: any) => {
    setTelefone(e.target.value);
  };
  const setCPFApply = (e: any) => {
    setCPF(e.target.value);
  };
  const setEscolaApply = (e: any) => {
    setEscola(e.target.value);
  };
  const setMotivoApply = (value: any) => {
    setMotivo(value);
  };

  const sendRequest = async () => {
    if (
      validateNome(nome) &&
      validateEmail(email) &&
      validatePhone(telefone, 'phone') &&
      validateCPF(cpf) &&
      validateEscola(escola)
    ) {

      if (cpf === estudante.cpf) {
        let obj = {
          id: estudante.pessoaId,
          nome: nome,
          email: email,
          phone: telefone,
          cpf: cpf,
          escola: escola,
          motivo: motivo
        }

        try {
          await postSolicitacao(obj)
          Modal.info({
            content: "O desbloqueio custará uma taxa que deverá ser solicitada no SETUT.",
            onOk: () => {

              Modal.success({
                content: "Solicitação de bloqueio realizada!",
                onOk: () => {
                  window.history.go(-1);
                },
              });

            },
          });
        } catch (error) {
          message.error(error.response.data.message)
        }
      } else {
        message.error("Solicitação deve ser feita com o seu CPF...")
      }
    }
  };

  return (
    <div className={"fullDiv"}>
      <Row>
        <Col id={"formulario"} xs={24} sm={24} md={24} lg={12} xl={12}>
          <HeaderSimple />
          <Row>
            <Col xs={0} sm={0} md={0} lg={2} xl={3} />
            <Col className={"formDiv noPadding"} xs={24} sm={24} md={24} lg={20} xl={18}>
              <p className={"titleForm"}>Solicitação de Bloqueio do Cartão</p>
              <p className={"subTitleForm"}>
                Insira abaixo os dados do estudante para solicitar o documento.
              </p>
              <br />
              <p className={"labelInputField"}>Nome Completo:</p>
              <Form form={form} name="register" scrollToFirstError>
                <Form.Item
                  initialValue={nome}
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Por-favor, informe o seu nome!",
                    },
                  ]}
                >
                  <Input className={"inputText"} onChange={setNomeApply} onBlur={() => { validateNome(nome) }} />
                </Form.Item>

                <p className={"labelInputField"}>E-mail:</p>
                <Form.Item
                  initialValue={email}
                  name="email"
                  rules={[
                    {
                      type: "email",
                      message: "O E-mail informado não é válido!",
                    },
                    {
                      required: true,
                      message: "Por-favor, informe um e-mail!",
                    },
                  ]}
                >
                  <Input className={"inputText"} onChange={setEmailApply} onBlur={() => { validateEmail(email) }} />
                </Form.Item>

                <p className={"labelInputField"}>Telefone:</p>
                <Form.Item
                  initialValue={telefone}
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Por-favor, informe um telefone para contato!",
                    },
                  ]}
                >
                  <InputMask
                    className={"inputText"}
                    mask="(11) 1 1111-1111"
                    onChange={setTelefoneApply}
                    onBlur={() => { validatePhone(telefone, 'phone') }}
                  />
                </Form.Item>

                <p className={"labelInputField"}>CPF:</p>
                <Form.Item
                  name="cpf"
                  rules={[
                    {
                      required: true,
                      message: "Por-favor, informe o seu CPF!",
                    },
                  ]}
                >
                  <MaskedInput
                    className={"inputText"}
                    mask="111.111.111-11"
                    inputMode="numeric"
                    onChange={setCPFApply}
                    onBlur={() => { validateCPF(cpf) }}
                  />
                </Form.Item>

                <p className={"labelInputField"}>Escola onde você estuda:</p>
                <Form.Item
                  name="escola"
                  rules={[
                    {
                      required: true,
                      message: "Por-favor, informe a sua escola!",
                    },
                  ]}
                >
                  <Input className={"inputText"} onChange={setEscolaApply} onBlur={() => { validateEscola(escola) }} />
                </Form.Item>

                <p className={"labelInputField"}>Motivo do bloqueio:</p>
                <Select
                  defaultValue="1"
                  className={"formItemSelector"}
                  bordered={false}
                  onChange={setMotivoApply}
                >
                  <Option value="1">Perda ou Roubo</Option>
                  <Option value="2">Cartão com defeito</Option>
                  <Option value="3">Cartão danificado</Option>
                </Select>
                {motivo === "1" ?
                  (
                    <p className={"subTitleForm"}>
                      * Em caso de roubo, faça o Boletim de Ocorrência o mais breve possível.
                    </p>
                  ) : (
                    <p />
                  )
                }

              </Form>

              <button
                className={"greenButton buttonSolicitar"}
                onClick={() => {
                  sendRequest()
                }}
              >
                Solicitar
              </button>
            </Col>
            <Col xs={0} sm={0} md={0} lg={2} xl={3} />
          </Row>
          <br />
          <FooterSimple />
        </Col>
        <Col xs={0} sm={0} md={0} lg={12} xl={12}>
          <div id={"backgroundImage"} className={"divWithBackgroundImage"} />
        </Col>
      </Row>
    </div>
  );
}

export default NovaSolicitacao;
