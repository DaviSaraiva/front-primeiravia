/* eslint-disable quotes */
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line object-curly-newline
import { Image, Form, Input, Col, Row, message, Button, Upload, Skeleton } from 'antd';
import MaskedInput from 'antd-mask-input';
import 'antd/dist/antd.css';
import { validarImg } from '../cadastro/CadastroPessoa';
import { buscarCep, getBase64, getIdUser, logout, validateMaskValue } from '../../../globals/globalFunctions';
import { UploadOutlined, VerticalLeftOutlined, VerticalRightOutlined } from '@ant-design/icons';
import { getDadosPessoa, getDocumentPicture, getDocuments, setComprovanteEndereco, setDadosComprovanteEndereco } from '../../../services/AccessServices';
import { useHistory } from 'react-router-dom';
import Modal from 'antd/lib/modal/Modal';

interface MyObject {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export default function ComprovanteEndereco(props: any) {
  let obj = getIdUser()
  let history = useHistory()

  const [cepExist, setCepExist] = useState(true);
  const [idUser] = useState(obj.id)
  const [imageupload, setImageUploadvalid] = useState(false);
  const [imagedata, setimagedata] = useState({});
  const [imageaproved, setimagearpoved] = useState('error');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [loading, setLoading] = useState(false)
  const [loadingback, setLoadingback] = useState(false)
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)

  const [fileList, setFileList] = useState<any[]>([])

  const normFile = (e: any) => {
    if (e.file.status !== 'removed') {
      setImageUploadvalid(true);
      if (e.file.type === 'image/png' || e.file.type === 'image/jpeg' || e.file.type === 'application/pdf') {
        if (e.file.size / 1024 / 1024 > 5) {
          // erro de tamanho
          validarImg('size');
          setimagearpoved('size');
          e.fileList[0].status = 'error';
        } else {
          const form = new FormData();
          form.append('comprovanteendereco', e.fileList[0].originFileObj);
          setimagedata(form);
          setimagearpoved('done');
        }
      } else if (e.file.type !== 'image/png' || e.file.type !== 'image/jpeg' || e.file.type !== 'application/pdf') {
        // erro de formato
        validarImg('format');
        setimagearpoved('format');
        e.fileList[0].status = 'error';
      }
    } else if (e.file.status === 'removed') {
      setImageUploadvalid(false);
      setimagearpoved('error');
    }
  };
  const [cep] = useState<MyObject>({
    logradouro: '',
    bairro: '',
    localidade: '',
    uf: '',
  });

  const updateCEP = async (e: any) => {
    // buscarCep(e)
    const cepvalue = e.target.value
    let cepData = await buscarCep(cepvalue)
    if (cepData !== undefined) {
      form.setFieldsValue(cepData)
      setCepExist(true)
    } else {
      setCepExist(false)
    }
  }

  useEffect(() => {
    getDadosPessoa(idUser).then((res: any) => {
      let pessoa = res.data.pessoa
      form.setFieldsValue(pessoa);
    });

    getDocuments(idUser)
      .then((res: any) => {
        let docCompEndereco = res.data.result.doccomprovanteendereco

        if (docCompEndereco !== null) {
          let docCompEnderecoIsPdf = docCompEndereco.split('.')[1] === 'pdf'
          getDocumentPicture(idUser, docCompEndereco)
            .then((res: any) => {
              if (res.data.statusCode === undefined) {
                let image = {
                  uid: '-2',
                  name: 'Comprovante Endereco',
                  status: 'done',
                  url: res.data.url,
                  type: docCompEnderecoIsPdf ? "application/pdf" : "image/jpeg"
                }

                setFileList([image])
                setImageUploadvalid(true)
                setimagearpoved('done')
              }
              setLoadingSkeleton(false)
            })
        } else {
          setLoadingSkeleton(false)
        }
      })
  }, []);


  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [form] = Form.useForm();
  const sendValues = (values: any) => {
    let cepIsValid = validateMaskValue(values.cep, 8, "cep")

    if (cepExist && cepIsValid) {
      setDadosComprovanteEndereco(idUser, values)
        .then((res: any) => {
          if (res === undefined) {
            logout()
            history.replace("/")
          } else {
            if (res.status === 200) {
              message.success('Dados salvo com sucesso');
            } else {
              message.error('Não foi possivel salvar seu documento');
            }
            if (loadingback) {
              props.goToPrev()
            } else {
              props.goToNext()
            }
          }
        })
        .catch(() => {
          message.error(
            'Não foi possivel salvar seus dados, caso o erro persista, fale conosco',
          );
        });
    } else {
      message.error("CEP inválido!")
      setLoading(false)
      setLoadingback(false)
    }
  };
  const onFinish = (values: any) => {
    let cepIsValid = validateMaskValue(values.cep, 8, "cep")

    if (cepIsValid) {
      if (imageaproved === 'done') {
        setComprovanteEndereco(idUser, imagedata, props.idTransaction)
          .then((res: any) => {
            if (res === undefined) {
              logout()
              history.replace("/")
            } else {
              if (res.status === 200) {
                sendValues(values);
              } else {
                message.error('Não foi possivel salvar seu documento');
                setLoading(false)
              }
            }
          })
          .catch(() => {
            message.error(
              'Não foi possivel salvar seus dados, caso o erro persista, fale conosco',
            );
            setLoading(false)
          });
      } else {
        if (!imageupload) {
          message.error("Por favor, envie a foto...")
        }

        validarImg(imageaproved);
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  };

  const onFinishFailed = () => {
    message.error('Não foi possivel salvar seus dados');
    setLoading(false)
  }

  const validateMessages = {
    required: 'Esse campo é obrigatorio',
  }

  const uploadButton = (
    <Button icon={<UploadOutlined />}>Carregar Comprovante de Endereço</Button>
  )

  const handleChange = (e: any) => {
    try {
      setFileList(e.fileList)
    } catch (error) {
    }
  }

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    if (file.type === 'application/pdf') {
      const pdfWindow = window.open('');
      pdfWindow?.document.write(
        `<iframe width='100%' height='100%' src='${file.url || file.preview}'></iframe>`,
      );
    } else {
      setPreviewImage(file.url || file.preview)
      setPreviewVisible(true)
      setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    }
  }

  return (
    <div>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <Image alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
      <Skeleton loading={loadingSkeleton} active>
        <Form
          form={form}
          validateMessages={validateMessages}
          name="doccomprovanteresidencia"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Row>
            <Col xs={24} sm={24} md={24} lg={16} xl={16}>
              <Row>
                <Col span={24} lg={14} xl={14}>
                  <p className={"labelInputField"}>* CEP:</p>
                  <Form.Item
                    name="cep"
                    rules={[{ required: true, message: 'Insira seu CEP!' }]}
                  >
                    <MaskedInput className={"inputText"} mask="11111-111" onBlur={updateCEP} />
                  </Form.Item>
                </Col>
                <Col span={24} lg={10} xl={10}>
                  <p className={"labelInputField"}>* Número:</p>
                  <Form.Item
                    name="numero"
                    rules={[
                      {
                        required: true,
                        message: 'Insira número do seu endereço de moradia',
                      },
                    ]}
                  >
                    <Input className={"inputText"} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <p className={"labelInputField"}>* Logradouro:</p>
                  <Form.Item
                    initialValue={cep.logradouro}
                    name="logradouro"
                    rules={[
                      { required: true, message: 'Insira seu logradouro de moradia' },
                    ]}
                  >
                    <Input className={"inputText"} />
                  </Form.Item>

                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <p className={"labelInputField"}>* Bairro:</p>
                  <Form.Item
                    initialValue={cep.bairro}
                    name="bairro"
                    rules={[
                      { required: true, message: 'Insira seu bairro de moradia' },
                    ]}
                  >
                    <Input className={"inputText"} />
                  </Form.Item>

                </Col>
                <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                  <p className={"labelInputField"}>* Cidade:</p>
                  <Form.Item
                    name="localidade"
                    rules={[
                      { required: true, message: 'Insira sua cidade de moradia' },
                    ]}
                  >
                    <Input className={"inputText"} value={cep.localidade} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                  <p className={"labelInputField"}>* UF:</p>
                  <Form.Item
                    name="uf"
                    rules={[
                      { required: true, message: 'Insira seu estado de moradia' },
                    ]}
                  >
                    <MaskedInput className={"inputText"} value={cep.uf} mask="AA" />
                  </Form.Item>

                </Col>
              </Row>
            </Col>

            <Col xs={24} sm={24} md={24} lg={1} xl={1} />

            <Col xs={24} sm={24} md={24} lg={7} xl={7}>
              <div id="info-envio-foto">
                <p className={"labelInputField"}>Comprovante de Endereço:</p>
                <p className={"subTitleMainPJustified"}>O COMPROVANTE DE RESIDÊNCIA tem que estar atualizado ( ser no máximo dos últimos dois meses), estar legível, estar no nome do próprio estudante, pais, avós, cônjuge e responsáveis legais, no formato JPG, PNG ou PDF.</p>
                <Form.Item
                  // valuePropName="fileList"
                  getValueFromEvent={normFile}
                  name="file"
                  status="error"
                >
                  <Upload
                    fileList={fileList}
                    listType="picture"
                    multiple={false}
                    accept="image/*, .pdf"
                    beforeUpload={() => false}
                    onChange={handleChange}
                    onPreview={handlePreview}
                    name="file"
                  >
                    {imageupload === true ? null : uploadButton}
                  </Upload>
                </Form.Item>
              </div>
            </Col>
          </Row>
          <br />
          <Row>
            <Col xs={0} sm={0} md={0} lg={5} xl={5}>
              <Button
                id={"buttonPrev"}
                type={"primary"}
                icon={<VerticalRightOutlined />}
                loading={loadingback}
                onClick={() => {
                  setLoadingback(true)
                  form.submit()
                }}
              >
                Salvar e voltar
              </Button>
            </Col>
            <Col xs={6} sm={6} md={6} lg={0} xl={0}>
              <Button
                id={"buttonPrev"}
                type={"primary"}
                icon={<VerticalRightOutlined />}
                loading={loadingback}
                onClick={() => {
                  setLoadingback(true)
                  form.submit()
                }}
              />
            </Col>
            <Col xs={1} sm={1} md={1} lg={14} xl={14} />
            <Col xs={17} sm={17} md={17} lg={5} xl={5}>
              <Button
                id={"buttonNext"}
                icon={<VerticalLeftOutlined />}
                type="primary"
                loading={loading}
                onClick={() => {
                  setLoading(true)
                  form.submit()
                }}
              >
                Salvar e continuar
            </Button>
            </Col>
          </Row>

        </Form>
      </Skeleton>
    </div>
  );
}
