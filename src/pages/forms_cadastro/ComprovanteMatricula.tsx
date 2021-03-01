/* eslint-disable quotes */
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line object-curly-newline
import {
  Form,
  Upload,
  Input,
  Col,
  Row,
  Select,
  message,
  Button,
  Image,
  Skeleton
} from 'antd';
import 'antd/dist/antd.css';
import { validarImg } from '../cadastro/CadastroPessoa';
import { getBase64, getIdUser, logout } from '../../globals/globalFunctions';
import { PlusOutlined, UploadOutlined, VerticalLeftOutlined, VerticalRightOutlined } from '@ant-design/icons';
import { MaskedInput } from 'antd-mask-input';
import { getDadosPessoa, getDocumentPicture, getDocuments, setComprovanteMatricula, setDadosComprovanteMatricula } from '../../services/AccessServices';
import { useHistory } from 'react-router-dom';
import Modal from 'antd/lib/modal/Modal';


const { Option } = Select;
export default function ComprovanteMatricula(props: any) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [form] = Form.useForm();

  let obj = getIdUser()
  let history = useHistory()

  const [idUser] = useState(obj.id)
  const [errorPic, setErrorPic] = useState(false);
  const [imageupload, setImageUploadvalid] = useState(false);
  const [imagedata, setimagedata] = useState({});
  const [imageaproved, setimagearpoved] = useState('error');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)
  const [loading, setLoading] = useState(false);
  const [loadingback, setLoadingback] = useState(false)

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
          form.append('comprovantematricula', e.fileList[0].originFileObj);
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

  const sendValues = (values: any) => {
    setDadosComprovanteMatricula(idUser, values)
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
  };
  const onFinish = (values: any) => {
    if (imageaproved === 'done') {
      setComprovanteMatricula(idUser, imagedata, props.idTransaction)
        .then((res: any) => {
          if (res === undefined) {
            logout()
            history.replace("/")
          } else {
            if (res.status === 200) {
              sendValues(values);
            } else {
              message.error('Não foi possivel salvar seu documento');
            }
            setLoading(false)
            setLoadingback(false)
          }
        })
        .catch(() => {
          message.error(
            'Não foi possivel salvar seus dados, caso o erro persista, fale conosco',
          );
          setLoading(false)
          setLoadingback(false)
        });
    } else {
      if (!imageupload) {
        message.error("Por favor, envie a foto...")
        setErrorPic(true)
        setLoading(false)
        setLoadingback(false)
      }
      validarImg(imageaproved);
    }
  }

  const onFinishFailed = () => {
    message.error('Não foi possivel salvar seus dados');
    setLoading(false)
    setLoadingback(false)
  }

  useEffect(() => {
    getDadosPessoa(idUser).then((res: any) => {
      let pessoa = res.data.pessoa
      form.setFieldsValue(pessoa);
    });

    getDocuments(idUser)
      .then((res: any) => {
        let docCompMatricula = res.data.result.doccomprovantematricula

        if (docCompMatricula !== null) {
          let docCompMatriculaIsPdf = docCompMatricula.split('.')[1] === 'pdf'

          getDocumentPicture(idUser, docCompMatricula)
            .then((res: any) => {
              if (res.data.statusCode === undefined) {
                let image = {
                  uid: '-2',
                  name: 'Comprovante de Matricula',
                  status: 'done',
                  url: res.data.url,
                  type: docCompMatriculaIsPdf ? "application/pdf" : "image/jpeg"
                }

                setFileList([image])
                setImageUploadvalid(true)
                setimagearpoved('done')
              }
              setLoadingSkeleton(false)
            })
            .catch(() => {
              setLoadingSkeleton(false)
            })
        } else {
          setLoadingSkeleton(false)
        }
      })
  }, []);

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

  const validateMessages = {
    required: 'Esse campo é obrigatorio',
  }

  const uploadButton = (
    <Button icon={<UploadOutlined />}>Carregar Comprovante de Matrícula</Button>
  )

  return (
    <div>
      <Skeleton loading={loadingSkeleton} active>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
        >
          <Image alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>

        <Form
          form={form}
          validateMessages={validateMessages}
          name="comprovantematricula"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Row>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <Row>
                <Col span={24}>
                  <p className={"labelInputField"}>* Tipo de Comprovante:</p>
                  <Form.Item
                    name="tpcomprovantematricula"
                    rules={[{ required: true }]}
                  >
                    <Select
                      className={"formItemSelector"}
                      placeholder="Selecione"
                      bordered={false}
                      allowClear
                    >
                      <Option value="boleto">Boleto</Option>
                      <Option value="atestadomatricula">Atestado de Matrícula</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={14} xl={14}>
                  <p className={"labelInputField"}>Número da Matrícula:</p>
                  <Form.Item
                    name="numregistro"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: 'Insira seu Número de Matrícula',
                  //   },
                  // ]}
                  >
                    <Input className={"inputText"} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                  <p className={"labelInputField"}>Ano de Conclusão:</p>
                  <Form.Item
                    name="anodeconclusao"
                  // rules={[{ required: true, message: 'Insira o Ano de Conclusão' }]}
                  >
                    <MaskedInput mask={"1111"} className={"inputText"} />
                    {/* <DatePicker
                    className={"formItemSelector"}
                    picker="year" 
                  /> */}
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col xs={0} sm={0} md={0} lg={1} xl={1} />
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <div id="info-envio-foto">
                <p className={"titleUploadArea"}>O Documento de comprovação estudantil enviado deve conter:</p>
                <p className={"subTitleMainPJustified"}>Selecione o tipo de COMPROVANTE DE MATRICULA e anexe, para que possamos confirmar os seus dados. O documento selecionado deve ser atual (no máximo 3 meses da data de assinatura), constar o nome do aluno, bem como o da Instituição na qual está matriculado. Os documentos devem constar carimbo e assinatura do responsável. As informações precisam estar legíveis e nos formatos JPG, PNG ou PDF.</p>
                <Row>
                  <Col span={24}>
                    {/* <p className={"labelInputField"}>Comprovante de Matrícula:</p> */}
                    <Form.Item
                      valuePropName="filefrente"
                      getValueFromEvent={normFile}
                      name="file1"
                      status="error"
                    >
                      <Upload
                        fileList={fileList}
                        listType="picture"
                        multiple={false}
                        accept="image/*, .pdf"
                        beforeUpload={() => false}
                        name="file1"
                        onChange={handleChange}
                        onPreview={handlePreview}
                        showUploadList={true}
                      >
                        {imageupload === true ? null : uploadButton}
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>

              </div>
            </Col>
          </Row>
        </Form>
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
      </Skeleton>
    </div>
  );
}
