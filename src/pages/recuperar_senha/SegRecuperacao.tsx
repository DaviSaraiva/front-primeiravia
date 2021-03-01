/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line object-curly-newline
import { Col, Row, Form, Input, Button, message } from 'antd';
import 'antd/dist/antd.css';
import './RecSenha.css';
import '../../globals/globalStyle.css'
import { changePassword, changePasswordLogged, validarHash } from '../../services/AccessServices';
import { useHistory } from 'react-router-dom';
import HeaderSimple from '../../visual_components/header/HeaderSimple';
import { getIdUser, isLogged, logout } from '../../globals/globalFunctions';
import Header from '../../visual_components/header/Header';

// import * as AiIcons from 'react-icons/md';

export default function SegRecupera() {
  let history = useHistory()
  let isLogado = false

  if (isLogged()) {
    isLogado = true
  }

  const [linkValido, setLinkValido] = useState(true)
  const [userId, setUserId] = useState("")
  const [hash, setHash] = useState("")

  useEffect(() => {
    if (isLogado) {
      let obj = getIdUser()
      setUserId(obj.id)
    } else {
      var url_splited = window.location.href.toString().split("/")
      var url_hash = url_splited[url_splited.length - 1]

      validarHash(url_hash).then((res: any) => {
        if (!res.data.error) {
          setUserId(res.data.id)
          setHash(url_hash)
        } else {
          setLinkValido(false)
        }
      })
    }
  }, [])

  const [pass, setPass] = useState('');
  const onFinish = (values: any) => {
    if (isLogado) {
      changePasswordLogged(userId, values.password)
        .then((res: any) => {
          if (res === undefined) {
            logout()
            history.replace("/")
          } else {
            if (res.status === 200) {
              if (!res.data.error) {
                message.success('Senha alterada com sucesso');
                history.replace("/redirect")
                history.goBack()
              } else {
                message.error('Algo deu errado!')
              }
            } else {
              message.error('Não foi possivel alterar sua senha');
            }
          }
        })
        .catch(() => {
          message.error('Erros ao conectar, por favor tente mais tarde');
        })
    } else {
      changePassword(userId, hash, values.password)
        .then((res: any) => {
          if (res === undefined) {
            logout()
            history.replace("/")
          } else {
            if (res.status === 200) {
              if (!res.data.error) {
                message.success('Senha alterada com sucesso');
                history.replace('/')                  
              } else {
                message.error('Algo deu errado!')
              }
            } else {
              message.error('Não foi possivel alterar sua senha');
            }
          }
        })
        .catch(() => {
          message.error('Erros ao conectar, por favor tente mais tarde');
        });
    }
  };
  const onFinishFailed = () => {
    message.error('por favor preencha os campo com sua nova senha');
  };
  return (
    <div className={"fullDiv"}>
      { 
        isLogado ? (
          <Header />
        ) : (
          <HeaderSimple />
        )
      }
      <div id={"divContent"}>
        {linkValido ?
          (
            <Row>
              <Col sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 9 }}>
                <div />
              </Col>
              <Col sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
                <div className={"cardForm"}>
                  <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
                    <div>
                      <p className={"accessFormTitle"}>Informe sua nova senha</p>
                      <p className={"accessFormSubTitle"}>
                        Digite sua nova senha, logo apos confirme novamente a senha.
                      </p>
                      {/* <p>User Id: {userId}</p>
                      <p>Hash: {hash}</p> */}
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingRight: "6px" }}>
                      <p className={"labelInputField"}>* Senha: (min. 6 caracteres)</p>
                      <p className={"labelInputField"} style={{ color: pass.length < 6 ? "red" : "green" }}>{pass.length}/6</p>
                    </div>
                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: 'Por favor insira sua senha',
                        },
                        {
                          min: 6,
                          message: "Pelo menos 6 caracteres."
                        }
                      ]}
                      hasFeedback
                    >
                      <Input.Password className={"inputText"} onChange={(e: any) => setPass(e.target.value)} />
                    </Form.Item>

                    <p className={"labelInputField"}>* Confirme sua nova senha</p>
                    <Form.Item
                      name="confirm"
                      dependencies={['password']}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: 'Por favor confime sua senha',
                        },
                        ({ getFieldValue }) => ({
                          validator(rule, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            // eslint-disable-next-line prefer-promise-reject-errors
                            return Promise.reject(
                              'Suas senhas estão diferentes, confira e digite novamente!',
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password className={"inputText"} />
                    </Form.Item>
                    <div id="btn-div">
                      <Button type="primary" id="btn" htmlType="submit" className={"greenButton buttonSolicitar"}>
                        Alterar senha
                  </Button>
                    </div>
                  </Form>
                </div>
              </Col>
              <Col sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 9 }}>
                <div />
              </Col>
            </Row>
          ) : (
            <div id={"divLinkExpirado"}>
              <h3>Link expirado!</h3>
              <a onClick={() => { history.replace("/") }}>
                <p>Voltar para o login</p>
              </a>
            </div>
          )
        }
      </div>
    </div>
  );
}
