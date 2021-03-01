/* eslint-disable quotes */
import React, { useState, useEffect } from 'react';
// eslint-disable-next-line object-curly-newline
import {
  Form,
  Upload,
  Input,
  Skeleton,
  Col,
  Row,
  Image,
  Select,
  message,
  Button,
} from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import { checkDateFieldData, date1IsAfterOrEqualThenDate2, getBase64, getDateFromMoment, getIdUser, logout } from '../../globals/globalFunctions';
import '../../globals/globalStyle.css';
import { PlusOutlined, UploadOutlined, VerticalLeftOutlined, VerticalRightOutlined } from '@ant-design/icons';
import { getDadosPessoa, getDocumentPicture, getDocuments, setDadosIdentificacao, setIdentificaoFrente, setIdentificaoVerso } from '../../services/AccessServices';
import InputMask from 'antd-mask-input';
import { useHistory } from 'react-router-dom';
import Modal from 'antd/lib/modal/Modal';

const { Option } = Select;

interface Dataimg {
  imgfrente: any;
  imgverso: any;
  aprovedfrente: string;
  aprovedverso: string;
}

interface UploadButton {
  buttonfrente: any;
  buttonverso: any;
}

export default function Documentoident(props: any) {
  let obj = getIdUser()
  let history = useHistory()

  const [idUser] = useState(obj.id)
  const [dateNascimento, setDateNascimento] = useState('')
  const [dateNascimentoIsValid, setDateNascIsValid] = useState(false)
  const [hiddenRG, setHiddenRG] = useState(false);
  const [hiddenNumRegistro, setHiddenNumRegistro] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileListFront, setFileListFront] = useState<any[]>([])
  const [fileListBack, setFileListBack] = useState<any[]>([])
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)
  const [loading, setLoading] = useState(false)
  const [loadingback, setLoadingback] = useState(false)

  const [imagedata, setimagedata] = useState<Dataimg | any>({
    imgfrente: { size: '', type: '' },
    imgverso: { size: '', type: '' },
    aprovedfrente: 'error',
    aprovedverso: 'error',
  });
  const [imageupload, setImageUploadvalid] = useState<UploadButton | any>({
    buttonfrente: false,
    buttonverso: false,
  });

  useEffect(() => {
    getDocuments(idUser)
      .then((res: any) => {
        let docVerso = res.data.result.docidentidadeverso
        let docFront = res.data.result.docidentidadefrente

        if (docVerso !== null && docFront !== null) {
          let docVersoIsPdf = docVerso.split('.')[1] === 'pdf'
          let docFrontIsPdf = docFront.split('.')[1] === 'pdf'

          getDocumentPicture(idUser, docVerso)
            .then((res: any) => {
              if (res.data.statusCode === undefined) {
                let imageBack = {
                  uid: '-2',
                  name: 'Documento Verso',
                  status: 'done',
                  url: res.data.url,
                  type: docVersoIsPdf ? "application/pdf" : "image/jpeg"
                }

                getDocumentPicture(idUser, docFront)
                  .then((res1: any) => {
                    if (res1.statusCode === undefined) {

                      let imageFront = {
                        uid: '-1',
                        name: 'Documento Front',
                        status: 'done',
                        url: res1.data.url,
                        type: docFrontIsPdf ? "application/pdf" : "image/jpeg"
                      }

                      setFileListBack([imageBack])
                      setFileListFront([imageFront])

                      setimagedata({
                        ...imagedata,
                        aprovedverso: 'done',
                        aprovedfrente: 'done'
                      });

                      setImageUploadvalid({
                        buttonfrente: true,
                        buttonverso: true
                      });

                    }
                    setLoadingSkeleton(false)
                  })
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

    getDadosPessoa(idUser).then((res: any) => {
      if (res === undefined) {
        logout()
        history.replace("/")
      } else {
        let pessoa = res.data.pessoa
        form.setFieldsValue({ "nome": pessoa.nome })

        if (pessoa.datanascimento !== null || pessoa.datanascimento !== undefined) {
          setDateNascIsValid(true)
        }

        if (pessoa.tipodocumento === null || pessoa.tipodocumento === undefined) {
          pessoa.tipodocumento = "rg"
        }

        hiddencampos(pessoa.tipodocumento);
        form.setFieldsValue(pessoa);
      }
    });
  }, []);

  const hiddencampos = (values: any) => {
    if (values === 'rg') {
      setHiddenRG(false);
      setHiddenNumRegistro(true);
    } else if (values === 'cnh') {
      setHiddenNumRegistro(false);
      setHiddenRG(true);
    }
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [form] = Form.useForm();

  const normFilefrente = (e: any) => {
    if (e.file.status !== 'removed') {
      setImageUploadvalid({ ...imageupload, buttonfrente: true });
      if (ValideSize(e.fileList[0].size) && Valideformat(e.fileList[0].type)) {
        e.fileList[0].status = 'done';
        setimagedata({
          ...imagedata,
          imgfrente: e.fileList[0].originFileObj,
          aprovedfrente: 'done',
        });
      } else {
        e.fileList[0].status = 'error';
      }
    } else if (e.file.status === 'removed') {
      // setImageUploadvalid({ ...imageupload, buttonfrente: false });
      setimagedata({
        ...imagedata,
        aprovedfrente: 'error',
      });
    }
  };

  const normFileverso = (e: any) => {
    if (e.file.status !== 'removed') {
      setImageUploadvalid({ ...imageupload, buttonverso: true });
      if (ValideSize(e.fileList[0].size) && Valideformat(e.fileList[0].type)) {
        e.fileList[0].status = 'done';
        setimagedata({
          ...imagedata,
          imgverso: e.fileList[0].originFileObj,
          aprovedverso: 'done',
        });
      } else {
        e.fileList[0].status = 'error';
      }
    } else if (e.file.status === 'removed') {
      setImageUploadvalid({
        ...imageupload,
        buttonverso: false,
        aprovedverso: 'error',
      });
    }
  };

  const ValideSize = (size: any) => {
    if (size / 1024 / 1024 > 5) {
      message.error('Tamanho maximo de arquivo deve ser de 5MB');
      return false;
    }
    return true;
  };

  const Valideformat = (format: any) => {
    if (
      // eslint-disable-next-line operator-linebreak
      format === 'image/png' ||
      // eslint-disable-next-line operator-linebreak
      format === 'image/jpeg' ||
      format === 'image/jpg' ||
      format === 'application/pdf'
    ) {
      return true;
    }
    message.error('Formato não aceito, apenas PDF, PNG, JPG e JPEG');

    return false;
  };


  const savefoto = () => {
    const imgversodoc = new FormData();
    const imgfrentedoc = new FormData();

    imgversodoc.append('imgversodoc', imagedata.imgverso);
    imgfrentedoc.append('imgfrentedoc', imagedata.imgfrente);

    setIdentificaoVerso(idUser, imgversodoc, props.idTransaction)
      .then((res: any) => {
        if (res === undefined) {
          logout()
          history.replace("/")
        }
      })
      .catch(() => {
        message.error(
          'Não foi possivel salvar seus dados, caso o erro persista, fale conosco',
        );
        setLoading(false)
        setLoadingback(false)
      });

    setIdentificaoFrente(idUser, imgfrentedoc, props.idTransaction)
      .then((res: any) => {
        if (res === undefined) {
          logout()
          history.replace("/")
        } else {
          if (res.status === 200) {
            message.success('Dados salvo com sucesso');
          } else {
            message.error('Não foi possivel salvar seus dados');
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
  };

  const onFinish = (values: any) => {
    if (dateNascimentoIsValid) {
      if (
        // eslint-disable-next-line operator-linebreak
        imagedata.aprovedfrente === 'done' &&
        imagedata.aprovedverso === 'done'
      ) {
        setDadosIdentificacao(idUser, values)
          .then((res: any) => {
            if (res === undefined) {
              logout()
              history.replace("/")
            } else {
              if (res.status === 200) {
                savefoto();
                if (loadingback) {
                  props.goToPrev()
                } else {
                  props.goToNext()
                }
              } else {
                message.error('Não foi possivel salvar seus dados');
                setLoading(false)
                setLoadingback(false)
              }
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
        message.error(
          'Verifique os arquivos marcados de vermelho e tente novamente',
        );
        setLoading(false)
        setLoadingback(false)
      }
    } else {
      message.error("Preencha uma data de nascimento válida!")
      setLoading(false)
      setLoadingback(false)
    }
  };

  const onFinishFailed = () => {
    message.error('Não foi possivel salvar seus dados');
    setLoading(false)
    setLoadingback(false)
  };

  const validateMessages = {
    required: 'Esse campo é obrigatorio',
  };


  const uploadButton = (front: boolean) => {
    return (front ?
      (
        <Button icon={<UploadOutlined />}>Carregar frente</Button>
      ) : (
        <Button icon={<UploadOutlined />}>Carregar verso</Button>
      )
    )
  }

  const handleChangeF = (e: any) => {
    try {
      setFileListFront(e.fileList)
    } catch (error) {
    }
  }

  const handleChangeB = (e: any) => {
    try {
      if (fileListBack.length === 0) {
        setFileListBack(e.fileList)
      } else {
        throw new Error("Você já tem uma foto enviada!");
      }
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
          name="docidentidadeestudante"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Row>
            <Col xs={24} sm={24} md={24} lg={14} xl={14}>
              <Row>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Form.Item
                    initialValue={"rg"}
                    name="tipodocumento"
                    rules={[{ required: true }]}
                  >
                    <Select
                      defaultValue={"rg"}
                      className={"formItemSelector"}
                      onChange={hiddencampos}
                      placeholder="Selecione"
                      allowClear
                      bordered={false}
                    >
                      <Option value="rg">RG</Option>
                      <Option value="cnh">CNH</Option>
                    </Select>
                  </Form.Item>
                </Col>
                {/* <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <p className={"labelInputField"}>* Nome:</p>
                <Form.Item
                  name="nome"
                  rules={[{ required: true, message: 'Insira seu nome!' }]}
                >
                  <Input
                    className={"inputText"}
                  />
                </Form.Item>
              </Col> */}
                <Col xs={24} sm={24} md={24} lg={14} xl={14}>
                  {!hiddenRG ?
                    (
                      <Row>
                        <Col xs={24} sm={24} md={24} lg={14} xl={14}>
                          {hiddenRG ? <p /> : <p className={"labelInputField"}>* RG:</p>}
                          <Form.Item
                            hidden={hiddenRG}
                            name="rg"
                            rules={[{ required: !hiddenRG, message: 'Insira seu RG' }]}
                          >
                            <Input className={"inputText"} type={"number"} />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                          {hiddenRG ? <p /> : <p className={"labelInputField"}>* Orgão Emissor:</p>}
                          <Form.Item
                            hidden={hiddenRG}
                            name="orgaoemissor"
                            rules={[{ required: !hiddenRG, message: 'Insira o Orgão Emissor' }]}
                          >
                            <Input className={"inputText"} />
                          </Form.Item>

                        </Col>
                      </Row>

                    ) : (
                      <div />
                    )
                  }

                  {hiddenNumRegistro ? <p /> : <p className={"labelInputField"}>* Número de Registro:</p>}
                  <Form.Item
                    hidden={hiddenNumRegistro}
                    name="registrocnh"
                    rules={[
                      {
                        required: hiddenRG,
                        message: 'Insira seu Número de Registro',
                      },
                    ]}
                  >
                    <Input className={"inputText"} type={"number"} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                  <p className={"labelInputField"}>* Data de Nascimento:</p>
                  <Form.Item
                    initialValue={dateNascimento}
                    name="datanascimento"
                    tooltip={"O aluno deve ter pelo menos 8 anos completados."}
                    rules={[
                      {
                        required: true,
                        message: 'Insira sua Data de Nascimento',
                      }
                    ]}
                  >
                    <InputMask
                      className={"inputText"}
                      mask="11/11/1111"
                      onChange={(e: any) => {
                        let dateList = e.target.value.split("/")
                        if (e.target.value.length === 10) {
                          // message.info(e.target.value.length+ " | " + JSON.stringify(dateList[0])+" | "+JSON.stringify(dateList[1])+ " | "+JSON.stringify(dateList[2]))

                          let dateConverted = dateList[2] + "-" + dateList[1] + "-" + dateList[0] + " 00:00:00"
                          var selecteddate = getDateFromMoment(dateConverted);

                          selecteddate.setHours(0)
                          selecteddate.setMinutes(0)
                          selecteddate.setSeconds(0)

                          var currentdate = moment(new Date).format('YYYY/MM/DD HH:mm:ss');

                          var datelimit = getDateFromMoment(currentdate)
                          datelimit.setDate(datelimit.getDate())
                          datelimit.setMonth(datelimit.getMonth())
                          datelimit.setFullYear(datelimit.getFullYear() - 8)

                          var datelimit100 = getDateFromMoment(currentdate)
                          datelimit100.setDate(datelimit.getDate())
                          datelimit100.setMonth(datelimit.getMonth())
                          datelimit100.setFullYear(datelimit.getFullYear() - 100)

                          if (checkDateFieldData(dateList) === 0) {
                            // message.success(JSON.stringify((dateList)))
                            if (date1IsAfterOrEqualThenDate2(datelimit, selecteddate) &&
                                date1IsAfterOrEqualThenDate2(selecteddate, datelimit100)) {
                              setDateNascimento(e.target.value)
                              setDateNascIsValid(true)
                            } else {
                              // message.error("Data de nascimento inválida!")
                              setDateNascimento('')
                              setDateNascIsValid(false)
                            }
                          } else {
                            setDateNascimento('')
                            setDateNascIsValid(false)
                          }
                        }
                      }}
                    />

                  </Form.Item>

                </Col>

                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <p className={"labelInputField"}>* Nome da mãe:</p>
                  <Form.Item
                    name="nomemae"
                    rules={[{ required: true, message: 'Insira o nome da Mãe' }]}
                  >
                    <Input
                      className={"inputText"}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <p className={"labelInputField"}>Nome do Pai:</p>
                  <Form.Item name="nomepai">
                    <Input
                      className={"inputText"}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col xs={0} sm={0} md={0} lg={1} xl={1} />
            <Col xs={24} sm={24} md={24} lg={9} xl={9}>
              <br />
              <br />
              <div
                id="info-envio-foto"
              >
                <p className={"titleUploadArea"}>ATENÇÃO</p>
                <p className={"subTitleMainPJustified"}>
                  Informe seus dados de acordo com o tipo de documento escolhido. É necessário que as informações estejam legíveis e iguais as informadas no formulário preenchido e nos formatos JPG, PNG ou PDF.
              </p>
                <br />
                <Row>
                  <Col xs={1} sm={1} md={1} lg={3} xl={3} />
                  <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <Form.Item
                      valuePropName="filefrente"
                      getValueFromEvent={normFilefrente}
                      name="file1"
                      status="error"
                    >
                      <Upload
                        fileList={fileListFront}
                        listType="picture"
                        multiple={false}
                        accept="image/*, .pdf"
                        beforeUpload={() => false}
                        name="file1"
                        showUploadList={true}
                        onRemove={() => {
                          let btnverso = imageupload.buttonverso
                          let apverso = imagedata.aprovedverso

                          setImageUploadvalid({
                            buttonfrente: false,
                            buttonverso: btnverso
                          })

                          setimagedata({
                            ...imagedata,
                            aprovedverso: apverso,
                            aprovedfrente: 'error'
                          });
                        }}
                        onChange={handleChangeF}
                        onPreview={handlePreview}
                      >
                        {fileListFront.length > 0 ? null : uploadButton(true)}
                      </Upload>
                    </Form.Item>
                  </Col>
                  <Col span={0} lg={2} xl={2} />
                  <br />
                  <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                    <Form.Item
                      valuePropName="fileverso"
                      getValueFromEvent={normFileverso}
                      name="file"
                      status="error"
                    >
                      <Upload
                        fileList={fileListBack}
                        listType="picture"
                        multiple={false}
                        beforeUpload={() => false}
                        accept="image/*, .pdf"
                        name="file2"
                        showUploadList={true}
                        onRemove={() => {
                          let btnfrente = imageupload.buttonfrente
                          let apvfrente = imagedata.aprovedfrente

                          setImageUploadvalid({
                            buttonfrente: btnfrente,
                            buttonverso: false
                          })

                          setimagedata({
                            ...imagedata,
                            aprovedverso: 'error',
                            aprovedfrente: apvfrente
                          });

                          setFileListBack([])
                        }}
                        onChange={handleChangeB}
                        onPreview={handlePreview}
                      >
                        {fileListBack.length > 0 ? null : uploadButton(false)}
                      </Upload>
                    </Form.Item>
                  </Col>
                  <Col xs={1} sm={1} md={1} lg={3} xl={3} />
                </Row>
                <br />
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
