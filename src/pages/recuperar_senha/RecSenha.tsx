import React, { useState } from 'react';
// eslint-disable-next-line object-curly-newline
import { Col, Row, Form, Input, Button, message } from 'antd';
import 'antd/dist/antd.css';
import './RecSenha.css';
import '../../globals/globalStyle.css'
import HeaderSimple from '../../visual_components/header/HeaderSimple';
import { recoverPassword } from '../../services/AccessServices';
import { useHistory } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function RecSenha() {
  let history = useHistory()

  const [loading, setLoading] = useState(false)

  // if (isLogged()) {
  //   history.replace('/')
  // }
  const onFinish = (values: any) => {
    setLoading(true)
    recoverPassword(values)
      .then((res: any) => {
        if (!res.data.error) {
          message.success(
            'Email enviado com sucesso! Verifique sua caixa de entrada.',
          );
          history.goBack()
        } else {
          message.error('Email não cadastrado');
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        message.error('Erros ao conectar, por favor tente mais tarde');
      });
  };

  const onFinishFailed = () => {
    setLoading(false)
    message.error('por favor preencha o campo de email');
  };

  return (
    <div className={"fullDiv"}>
      <HeaderSimple />
      <div id={"divContent"}>
        <Row>
          <Col sm={24} md={12} lg={8}>
            <div />
          </Col>
          <Col sm={24} md={12} lg={8}>
            <div className={"cardForm"}>
              <Form
                name="recsenha"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <div>
                  <p className={"accessFormTitle"}>Redefina sua senha</p>
                  <p className={"accessFormSubTitle"}>
                    Digite o endereço de e-mail verificado da sua conta de usuário
                    e enviaremos um link de redefinição de senha.
                </p>
                </div>
                <p className={"labelInputField"}>* Email</p>
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Insira seu email para redefinição de senha',
                    },
                  ]}
                >
                  <Input className={"inputText"} />
                </Form.Item>
                <div id="btn-div">
                  <Button type="primary" loading={loading} id="btn" htmlType="submit" className={"greenButton buttonSolicitar"}>
                    <span>Enviar</span>
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
          <Col sm={24} md={12} lg={8}>
            <div />
          </Col>
        </Row>
      </div>
    </div>
  );
}
