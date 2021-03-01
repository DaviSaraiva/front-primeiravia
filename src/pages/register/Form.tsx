import React, { useState } from 'react';
import 'antd/dist/antd.css';
import {
  Form,
  Input,
  Checkbox,
  Button,
  Select,
  Row,
  Col,
  message,
  Alert,
} from 'antd';
import './Form.css';
import '../../globals/globalStyle.css'
import InputMask from 'antd-mask-input';
import { cpf } from 'cpf-cnpj-validator';
import Modal from 'antd/lib/modal/Modal';
import { useHistory } from 'react-router-dom';
import HeaderSimple from '../../visual_components/header/HeaderSimple';
import FooterSimple from '../../visual_components/footer/FooterSimple';
import { isLogged, validatePhone } from '../../globals/globalFunctions';
import { saveUser } from '../../services/AccessServices';

const RegistrationForm = () => {
  let history = useHistory()
  const { Option } = Select;

  if (isLogged()) {
    history.replace('/')
  }

  let estudanteLocal = localStorage.getItem("usuario")

  if (estudanteLocal !== null && estudanteLocal !== undefined) {
    history.replace('/pagamento')
  }

  const [loading, setLoading] = useState(false);
  const [cpfvalid, setCpfvalid] = useState(0);
  const [pass, setPass] = useState('');
  const [visible, setVisible] = useState(false);

  const content = (
    <div>
      <Alert message={"POR QUE ATUALIZAR O CARTÃO?"} type={"info"} banner />
      <p style={{ margin: "6px" }}>
        Conforme Lei Municipal n° 3.148/02, todos os usuários que gozam de benefícios tarifário serão cadastrados em um Banco de Dados na central, onde serão registrados todas as informações necessárias para o gerenciamento da destruição dos direitos nos cartões, sendo este cadastro atualizado a cada 06 (seis) meses.
      </p>
      <br />
      <Alert message={"COMO PROCEDER?"} type={"info"} banner />
      <p style={{ margin: "6px" }}>
        Após aceite dos termos de atualização cadastral, através do link (<a href="https://atualizacaocadastral.transmobibeneficios.com.br/">clique aqui</a>) , faça seu cadastro e anexe todos os documentos solicitados que comprovem seu direito ao benefício.
      </p>
      <br />
      <Alert message={"DOCUMENTOS NECESSÁRIOS"} type={"info"} banner />
      <ul style={{ margin: "6px" }}>
        <li>Carteira Estudantil do ano vigente;</li>
        <li>RG e CPF;</li>
        <li>Comprovante de matricula atualizado;</li>
        <li>Comprovante de endereço atualizado.</li>
      </ul>

      <h3 style={{ margin: "16px" }}>TERMOS DE ATUALIZAÇÃO CADASTRAL</h3>
      <ul>
        <li>Seu cartão de meia passagem não será substituído;</li>
        <li>É importante informar os dados de telefone e email para receber a confirmação da atualização e qualquer informação sobre o seu benefício;</li>
        <li>Para garantir a sua atualização você deverá enviar todos os documentos que comprovem o benefício no formato JPEG ou PNG;</li>
        <li>A atualização cadastral, via site, terá o custo de R$ 7.85 (sete reais e oitenta e cinco centavos)</li>
        <li>No prazo de até 5 (cinco) dias uteis, a contar do cadastramento e envio de todos os documentos, você receberá a confirmação da atualização cadastral.</li>
      </ul>

      <br />
      <h3 style={{ margin: "16px" }}>FINALIDADE DE USOS DE DADOS</h3>
      <p style={{ margin: "16px" }}>
        A Transmobi prioriza a transparência e segurança das informações, por isso, entendemos que temos o dever de informar qual a finalidade da coleta dos seus dados. Os nossos sistemas são seguros, na qual as coletas e armazenamentos de dados têm como objetivo identificar o usuário, prevenir fraudes, informar sobre novidades e entregar o serviço proposto com agilidade e qualidade, e melhorar a interação e experiência do usuário com os nossos produtos e serviços, modificando interfaces e fornecendo o conteúdo e os anúncios desejados relacionados a marketing.
        Todo e qualquer compartilhamento com sistemas e fornecedores de tecnologia, mesmo os sediados em outro país, é pautado na finalidade de entregar o serviço com alta precisão. É importante ressaltar que dispomos de uma equipe focada e dedicada na proteção de seus dados.
      </p>
    </div>
  );
  const Cpf = (values: any) => {
    if (cpf.isValid(values.target.value) === false) {
      setCpfvalid(0);
      message.error('CPF inválido');
    } else {
      setCpfvalid(1);
      message.success('CPF válido')
    }

  }
  const onFinish = (values: any) => {
    let phoneIsValid = validatePhone(values.telefone, 'phone')
    let whatsappIsValid = true
    if (values.whatsapp!==undefined && values.whatsapp.length > 0) {
      whatsappIsValid = validatePhone(values.whatsapp, 'whatsapp')
    }

    if (phoneIsValid && whatsappIsValid) {
      if (cpfvalid === 1) {
        setLoading(true)
        saveUser(values)
          .then((res) => {
            if (res.data.resposta === 'confirme') {
              message.success("Dados salvos com sucesso")
              history.goBack()
            } else if (res.data.resposta === 'existe') {
              message.error('Email ou Cpf já cadastrados ')
            } else {
              message.error('Erro ao salvar dados')
            }
            setLoading(false)
          }).catch((erro) => {
            message.error('Falha ao se conectar ao banco de dados')
            setLoading(false)
          });
      }
      else {
        message.error('cpf incorreto')
      }
    } else {
      if (!phoneIsValid) {
        message.error('Verifique seu telefone!')
      }
      if (!whatsappIsValid) {
        message.error('Verifique seu whatsapp!')
      }
    }
  }

  const onFinishFailed = () => {
    message.error('Não foi possivel salvar os dados,por favor preencha todos os campos')
  }

  return (
    <div className={"fullDiv"}>
      <Modal
        visible={visible}
        onOk={() => {
          setVisible(false)
        }}
        okText={"Entendi"}
        onCancel={() => {
          setVisible(false)
        }}
        cancelButtonProps={{ disabled: true, ghost: true }}
        title={"Termo de uso"}
        width={1000}

      >
        {content}
      </Modal>
      <Row>
        <Col id={"formulario"} xs={24} sm={24} md={24} lg={12} xl={12}>
          <HeaderSimple />
          <div id={"mainContainer"}>
            <Row>
              <Col xs={2} sm={2} md={2} lg={5} xl={5} />
              <Col className={"noPadding centerVertical"} xs={20} sm={20} md={20} lg={14} xl={14}>
                <br />
                <p className={"accessFormTitle"}>Atualização Cadastral Online {new Date().getFullYear()}</p>
                <p className={"accessFormSubTitle"}>Insira abaixo os dados do estudante para solicitar a Atualização Cadastral.</p>
                <br />
                <Form
                  name="cadestudantes"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}>

                  <p className={"labelInputField"}>Nome Completo:</p>
                  <Form.Item
                    name="nome"
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: 'Insira um nome',
                      },
                    ]}
                  >
                    <Input
                      className={"inputText"}
                      placeholder={"Insira o seu nome completo"} />
                  </Form.Item>

                  <p className={"labelInputField"}>Email:</p>
                  <Form.Item
                    name="email"
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        type: 'email',
                        message: 'Insira um email valido',
                      },
                      {
                        required: true,
                        message: 'Insira seu email',
                      },
                    ]}
                  >
                    <Input
                      className={"inputText"}
                      placeholder={"Insira o seu email"} />
                  </Form.Item>

                  <p className={"labelInputField"}>Confirme o seu email:</p>
                  <Form.Item
                    name="emailConf"
                    labelCol={{ span: 24 }}
                    dependencies={['email']}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'Por favor confime seu Email!',
                      },
                      ({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (!value || getFieldValue('email') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject('Seus emails estao diferentes!');
                        },
                      }),
                    ]}
                  >
                    <Input
                      className={"inputText"}
                      placeholder={"Confirme o seu email"} />
                  </Form.Item>

                  <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingRight: "6px" }}>
                    <p className={"labelInputField"}>Senha: (min. 6 caracteres)</p>
                    <p className={"labelInputField"} style={{ color: pass.length < 6 ? "red" : "green" }}>{pass.length}/6</p>
                  </div>
                  <Form.Item
                    name="password"
                    labelCol={{ span: 24 }}
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
                    <Input.Password
                      className={"inputText"}
                      onChange={(e: any) => setPass(e.target.value)}
                      placeholder={"Insira a sua senha"} />
                  </Form.Item>

                  <p className={"labelInputField"}>Confirme a sua senha:</p>
                  <Form.Item
                    name="confirm"
                    labelCol={{ span: 24 }}
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
                          return Promise.reject(
                            'Suas senhas estão diferentes, confiara novamente!',
                          );
                        },
                      })
                    ]}
                  >
                    <Input.Password
                      className={"inputText"}
                      placeholder={"Confirme a sua senha"} />
                  </Form.Item>

                  <p className={"labelInputField"}>CPF:</p>
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
                      onBlur={Cpf}
                      className={"inputText"}
                    />
                  </Form.Item>

                  <p className={"labelInputField"}>Telefone:</p>
                  <Form.Item
                    name="telefone"
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: 'Insira seu telefone',
                      },
                    ]}
                  >
                    <InputMask
                      mask="(11) 1 1111-1111"
                      className={"inputText"}
                    />
                  </Form.Item>

                  <p className={"labelInputField"}>Whatsapp:</p>
                  <Form.Item
                    name="whatsapp"
                    labelCol={{ span: 24 }}
                  >
                    <InputMask
                      mask="(11) 1 1111-1111"
                      className={"inputText"}
                    />
                  </Form.Item>

                  <p className={"labelInputField"}>Escolaridade:</p>
                  <Form.Item
                    name="escolaridade"
                    initialValue={"ensinofundamental"}
                    className={"inputText"}
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: 'Escolha sua escolaridade',
                      },
                    ]}
                  >
                    <Select
                      className={"formItemSelector"}
                      bordered={false}
                    >
                      <Option value="ensinofundamental">Ensino Fundamental</Option>
                      <Option value="ensinomedio">Ensino Médio</Option>
                      <Option value="graduacao">Graduação</Option>
                      <Option value="posgraduacao">Pós-Graduação</Option>
                    </Select>
                  </Form.Item>

                  <p className={"labelInputField"} />
                  <Form.Item
                    name="termo1"
                    valuePropName="checked"
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        validator: (_, values) => values
                          ? Promise.resolve()
                          : Promise.reject('Por favor aceite os termos de uso do sistema!'),
                      },
                    ]}
                  >
                    <div className={"rowDiv"}>
                      <Checkbox />
                      <div className={"divBtnCadastrese padding16"}>
                        <p>
                          Eu li e aceito os termos de
                          <a className={"labelInputField"} onClick={() => { setVisible(true) }}> política de privacidade.</a>
                        </p>
                      </div>
                    </div>
                  </Form.Item>
            
                  <Form.Item labelCol={{ span: 24 }}>
                    <Button className={"greenButton buttonSolicitar"}
                      loading={loading}
                      type="primary"
                      htmlType="submit">
                        Registrar
                    </Button>
                    <p className={"accessFormSubTitle"}><b>* Enviaremos um e-mail confirmando o seu cadastro.</b></p>
                  </Form.Item>
                </Form>
                <br />
              </Col>
              <Col xs={2} sm={2} md={2} lg={5} xl={5} />
            </Row>
          </div>
          <FooterSimple />
        </Col>
        <Col xs={0} sm={0} md={0} lg={12} xl={12}>
          <div id={"backgroundImage"} className={"divWithBackgroundImage"} />
        </Col>
      </Row>
    </div>
  );
};

export default RegistrationForm;



