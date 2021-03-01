// /* eslint-disable prettier/prettier */
// /* eslint-disable quotes */
import React, {
  useState, useEffect,
} from 'react';
// eslint-disable-next-line object-curly-newline
import { Skeleton, Form, Input, Col, Row, Select, message, Button } from 'antd';
import { cpf } from 'cpf-cnpj-validator';
import MaskedInput from 'antd-mask-input';
import 'antd/dist/antd.css';
import '../../../globals/globalStyle.css'
import { getIdUser, isLogged, logout } from '../../../globals/globalFunctions';
import { VerticalLeftOutlined } from '@ant-design/icons';
import { getDadosPessoa, getInstituicoes, setCadastroPessoa } from '../../../services/AccessServices';
import { useHistory } from 'react-router-dom';

const { Option } = Select;

export default function Infoestudante(props: any) {
  let obj = getIdUser()
  let history = useHistory()

  const [idUser] = useState(obj.id)

  const [cpfvalid, setCpfvalid] = useState(0)
  const [optionselect, setSelectEscolaridade] = useState('ensinofundamental');
  const [valuesoptions, setValuesIntituicao] = useState([])
  const [loading, setLoading] = useState(false);
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)
  const [cidade, setCidade] = useState('');

  let tipo = "";

  const [form] = Form.useForm();
  useEffect(() => {
    if (isLogged()) {
      getDadosPessoa(idUser)
        .then((res: any) => {
          if (res === undefined) {
            logout()
            history.replace("/")
          } else {
            if (res.status === 200) {
              // res.data.pessoa.genero = res.data.pessoa.genero === null ? "masculino" : res.data.pessoa.genero
              setSelectEscolaridade(res.data.pessoa.escolaridade)

              if (res.data.pessoa.ufescola === null) {
                setCidade("")
              } else {
                setCidade(getNomeCidade(res.data.pessoa.ufescola))
              }

              form.setFieldsValue(res.data.pessoa);
              setCpfvalid(1);
            }
          }
          setLoadingSkeleton(false)
        })
        .catch(() => {
          message.error(
            '1 - Não foi possivel salvar seus dados, caso o erro persista, fale conosco',
          );
          setLoadingSkeleton(false)
        });
    }
  }, []);

  const validarcpf = (values: any) => {
    if (cpf.isValid(values.target.value) === false) {
      setCpfvalid(0);
      message.error('CPF invalido');
    } else {
      setCpfvalid(1);
    }
  };

  const buscarinstituicao = (values: any) => {
    if (optionselect === "ensinomedio" || optionselect === "ensinofundamental") {
      tipo = "escola";
    } else if (optionselect === "graduacao" || optionselect === "posgraduacao") {
      tipo = "faculdade";
    }
    if (values.length >= 4) {
      getInstituicoes(tipo, values)
        .then((res: any) => {
          // if (res === undefined) {
          //   logout()
          //   history.replace("/")
          // } else {
          setValuesIntituicao(res.data);
          // }
        })
        .catch((error: any) => {
          message.error(
            '1 - Não foi possivel salvar seus dados, caso o erro persista, fale conosco',
          );
        });
    }
  };

  const onFinish = (values: any) => {
    setLoading(true)
    if (cpfvalid === 1) {
      values.cidadeescola = cidade === "TE" ? "Teresina" : "Timon"
      setCadastroPessoa(idUser, values)
        .then((res: any) => {
          if (res === undefined) {
            logout()
            history.replace("/")
          } else {
            if (res.status === 200) {
              message.success('Dados salvo com sucesso');
            } else {
              message.error(
                '1 - Não foi possivel salvar seus dados, caso o erro persista, fale conosco',
              );
            }
          }
        })
        .catch((error: any) => {
          message.error(
            '1 - Não foi possivel salvar seus dados, caso o erro persista, fale conosco',
          );
        });
      setLoading(false)
      props.goToNext()
    } else {
      message.error('CPF invalido');
      setLoading(false)
    }
  };

  const onFinishFailed = () => {
    message.error('Não foi possivel salvar seus dados');
    setLoading(false)
  };

  const validateMessages = {
    required: 'Esse campo é obrigatorio',
    types: {
      email: 'Esse email não é valido',
    },
  };

  const applyOptionSelect = (value: any) => {
    if (optionselect !== value) {
      form.setFieldsValue({
        instituicao: undefined
      })
    }
    setSelectEscolaridade(value)
  }

  const getNomeCidade = (estado: string) => {
    if (estado === "PI") {
      return "TE"
    } else if (estado === "MA") {
      return "TI"
    } else {
      return ""
    }
  }

  return (
    <div>
      <Skeleton loading={loadingSkeleton} active>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Form
              form={form}
              validateMessages={validateMessages}
              // eslint-disable-next-line react/jsx-props-no-spreading
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Row>
                <Col xs={24} sm={24} md={24} lg={14} xl={14}>
                  <p className={"labelInputField"}>* Nome:</p>
                  <Form.Item
                    name="nome"
                    rules={[{ required: true, message: 'Insira seu nome!' }]}
                  >
                    <Input className={"inputText"} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                  <p className={"labelInputField"}>* CPF:</p>
                  <Form.Item
                    hasFeedback
                    validateStatus={cpfvalid === 1 ? 'success' : 'error'}
                    name="cpf"
                    rules={[{ required: true, message: 'Insira seu CPF' }]}
                  >
                    <MaskedInput className={"inputText"} mask="111.111.111-11" onBlur={validarcpf} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                  <p className={"labelInputField"}>*Telefone:</p>
                  <Form.Item
                    name="telefone"
                    rules={[{ required: true, message: 'Insira seu Telefone' }]}
                  >
                    <MaskedInput className={"inputText"} mask="(11) 1 1111-1111" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={7} xl={7}>
                  <p className={"labelInputField"}>* Gênero:</p>
                  <Form.Item
                    name="genero"
                    initialValue={"masculino"}

                    className={"inputText"}
                    rules={[
                      {
                        required: true,
                        message: 'Escolha seu gênero',
                      },
                    ]}
                  >
                    <Select
                      placeholder={"Escolha seu gênero"}
                      defaultValue={"masculino"}
                      className={"formItemSelector"}
                      bordered={false}
                    >
                      <Option value="masculino">Masculino</Option>
                      <Option value="feminino">Feminino</Option>
                      {/* <Option value="outro">Outro</Option> */}
                    </Select>
                  </Form.Item>

                </Col>
                <Col xs={24} sm={24} md={24} lg={7} xl={7}>
                  <p className={"labelInputField"}>* Escolaridade:</p>
                  <Form.Item
                    name="escolaridade"
                    className={"inputText"}
                    rules={[{ required: true }]}
                  >
                    <Select defaultValue={"ensinofundamental"} className={"formItemSelector"} onChange={applyOptionSelect} placeholder="Selecione" bordered={false}>
                      <Option value="ensinofundamental">Ensino Fundamental</Option>
                      <Option value="ensinomedio">Ensino Médio</Option>
                      <Option value="graduacao">Graduação</Option>
                      <Option value="posgraduacao">Pós-Graduação</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                  <p className={"labelInputField"}>* Série/Período:</p>
                  <Form.Item
                    name="serieperiodo"
                    rules={[{ required: true, message: 'Insira sua Série ou Período' }]}
                  >
                    <Input className={"inputText"} maxLength={2} type={"number"} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                  <p className={"labelInputField"}>* Turno:</p>
                  <Form.Item name="turno" rules={[{ required: true }]}>
                    <Select
                      className={"formItemSelector"}
                      placeholder="Selecione"
                      allowClear
                      bordered={false}
                    >
                      <Option value="manha">Manhã</Option>
                      <Option value="tarde">Tarde</Option>
                      <Option value="noite">Noite</Option>
                      <Option value="manhatarde">Manhã/Tarde</Option>
                      <Option value="manhanoite">Manhã/Noite</Option>
                      <Option value="manhatardenoite">Manhã/Tarde/Noite</Option>
                    </Select>
                  </Form.Item>

                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                  <p className={"labelInputField"}>* Instituição:</p>
                  <Form.Item
                    name="instituicao"
                    rules={[{ required: true }]}
                  >
                    <Select
                      disabled={optionselect !== "null" ? false : true}
                      onSearch={buscarinstituicao}
                      showSearch
                      placeholder="Digite o nome da instituição"
                      filterOption={false}
                      className={"formItemSelector"}
                      bordered={false}
                    >
                      {valuesoptions.map((d: any) => (
                        <Option value={d.name} key={d.name}>{d.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                  <p className={"labelInputField"}>* Estado da escola:</p>
                  <Form.Item
                    name="ufescola"
                    rules={[{ required: true, message: 'Preencha esse campo' }]}
                  >
                    <Select defaultValue={"PI"} onChange={(e: any) => { setCidade(getNomeCidade(e)) }} className={"formItemSelector"} placeholder="Selecione o estado" bordered={false}>
                      <Option value="PI">Piauí</Option>
                      <Option value="MA">Maranhão</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                  <p className={"labelInputField"}>* Cidade da escola:</p>
                  <Select value={cidade} onChange={() => { }} className={"formItemSelector"} id={"selectCity"} placeholder="Selecione o estado" bordered={false}>
                    <Option value="TE">Teresina</Option>
                    <Option value="TI">Timon</Option>
                  </Select>
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} md={12} lg={19} xl={19} />
                <Col className={"divButtonNext"} xs={12} sm={12} md={12} lg={5} xl={5}>
                  <Form.Item>
                    <Button
                      id={"buttonNext"}
                      icon={<VerticalLeftOutlined />}
                      loading={loading}
                      type="primary"
                      htmlType="submit"
                    // onClick={props.goToNext}
                    >
                      Salvar e continuar
                  </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Skeleton>
    </div >
  );
}
