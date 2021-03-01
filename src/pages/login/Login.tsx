import React, { useState } from 'react';
// eslint-disable-next-line object-curly-newline
import { Form, Input, Row, Col, Button, message } from 'antd';
import 'antd/dist/antd.css';
import './Login.css';
import '../../globals/globalStyle.css'
import HeaderSimple from '../../visual_components/header/HeaderSimple';
import FooterSimple from '../../visual_components/footer/FooterSimple';
import { isLogged, setToken, validateEmail } from '../../globals/globalFunctions';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { getPessoa, login } from '../../services/AccessServices';
import { Link, useHistory } from 'react-router-dom';

// eslint-disable-next-line no-console
// eslint-disable-next-line react-hooks/rules-of-hooks

export default function Login() {
    let history = useHistory()
    const [form] = Form.useForm();

    if (isLogged()) {
        history.replace('/redirect')
    }

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const setEmailApply = (e: any) => {
        setEmail(e.target.value);
    };

    const setPasswordApply = (e: any) => {
        setPassword(e.target.value);
    };

    const loginFunction = async () => {
        setLoading(true)
        let response = await login(email, password)
        if (response.status === 200 && response.data.message === undefined) {
            setToken(response.data.token);
            let id = response.data.id

            let responsePessoa = await getPessoa(id)
            if (responsePessoa !== undefined) {
                let pessoa = responsePessoa.pessoa
                let obj = {
                    id: responsePessoa.id,
                    pessoaId: pessoa.id,
                    cpf: pessoa.cpf,
                    nome: pessoa.nome.toLowerCase(),
                    telefone: pessoa.telefone,
                    email: responsePessoa.email
                }

                localStorage.setItem("usuario", JSON.stringify(obj));
                
                history.push('/redirect')
            }
            setLoading(false)
        } else {
            setLoading(false)
            message.error(response.data.message)
        }
    }

    return (
        <div className={"fullDiv"}>
            <Row>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} >
                    <HeaderSimple />
                    <Row>
                        <Col xs={2} sm={2} md={2} lg={5} xl={5} />
                        <Col id={"formLogin"} xs={20} sm={20} md={20} lg={14} xl={14}>
                            <p className={"accessFormTitle"}>Login do aluno</p>
                            <p className={"accessFormSubTitle"}>Acesse o sistema colocando seus dados cadastrais abaixo.</p>
                            <br />
                            {/* <p>{getToken()}</p> */}
                            <Form form={form} name="register" scrollToFirstError>
                                <p className={"labelInputField"}>Email:</p>
                                <Form.Item
                                    name="email"
                                    rules={[
                                        {
                                            type: "email",
                                            message: "O email informado não é válido!",
                                        },
                                        {
                                            required: true,
                                            message: "Por-favor, informe um email!",
                                        },
                                    ]}
                                >
                                    <Input
                                        className={"inputText"}
                                        placeholder="Insira o seu email!"
                                        onChange={setEmailApply}
                                        onBlur={() => { validateEmail(email) }}
                                        onPressEnter={async () => loginFunction()}
                                    />
                                </Form.Item>

                                <p className={"labelInputField"}>Senha:</p>
                                <Form.Item
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Por-favor, informe a sua senha!",
                                        },
                                    ]}
                                >
                                    <Input.Password
                                        className="inputText"
                                        placeholder="Insira a sua senha!"
                                        onChange={setPasswordApply}
                                        iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                        onPressEnter={async () => loginFunction()}
                                    />

                                </Form.Item>
                                <div id={"divForgotPassword"}>
                                    <Link id={"linkToForgot"} to={"/esqueci-minha-senha"}>Esqueci minha senha</Link>
                                </div>
                            </Form>

                            <div id={"divButtonRegistro"}>
                                <Button
                                    loading={loading}
                                    className={"greenButton buttonSolicitar"}
                                    onClick={async () => loginFunction()}
                                >
                                    Entrar
                                </Button>
                            </div>
                            <div className={"divBtnCadastrese"}>
                                <p id={"textToRegistro"}>Ainda não é cadastrado?</p>
                                <Link id={"linkToRegistro"} to={"/registro"}>Crie uma conta</Link>
                                {/* <Button type="default" size={"large"} onClick={() => goToRegistro()}>
                                    Crie uma conta
                                </Button> */}
                            </div>
                        </Col>
                        <Col xs={2} sm={2} md={2} lg={5} xl={5} />
                    </Row>
                    <FooterSimple isFixed={true} />
                </Col>
                <Col xs={0} sm={0} md={0} lg={12} xl={12}>
                    <div id={"backgroundImageLogin"} className={"divWithBackgroundImage"} />
                </Col>
            </Row>
        </div>

    );
}