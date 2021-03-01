/* eslint-disable quotes */
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line object-curly-newline
import { Image, Col, Row, Button, Form, Upload, Skeleton, message } from 'antd';
import Fotocarteira from '../../../images/carteiraestudante.jpeg';
import Fotocarteiraverso from '../../../images/carteiraestudanteverso.jpeg';
import { validarImg } from '../cadastro/CadastroPessoa';
import { getBase64, getIdUser, logout } from '../../../globals/globalFunctions';
import { CheckOutlined, LeftOutlined, UploadOutlined, VerticalRightOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import Modal from 'antd/lib/modal/Modal';
import ModalVerifyInfoEstudante from '../../../visual_components/modals/ModalVerifyInfoEstudante';
import { confirmarDocumentos, getDocumentPicture, getDocuments, setFotoCarteira } from '../../../services/AccessServices';
import { getTransacao } from '../../../services/PagamentosServices';

export default function FotoCarteiraEstudante(props: any) {
  let obj = getIdUser()
  const history = useHistory()
  const [form] = Form.useForm();
  const [errorPic, setErrorPic] = useState(false);
  const [imageupload, setImageUploadvalid] = useState(false);
  const [imagedata, setimagedata] = useState({});
  const [imageaproved, setimagearpoved] = useState('error');
  const [idUser] = useState(obj.id)
  const [visible, setVisible] = useState(false)
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
          form.append('fotocarteira', e.fileList[0].originFileObj);
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

  useEffect(() => {
    getDocuments(idUser)
      .then((res: any) => {
        let docCarteiaAtual = res.data.result.doccarteiaatual

        if (docCarteiaAtual !== null) {
          let docCarteiaAtualIsPdf = docCarteiaAtual.split('.')[1] === 'pdf'
          getDocumentPicture(idUser, docCarteiaAtual)
            .then((res: any) => {
              if (res.data.statusCode === undefined) {
                let image = {
                  uid: '-2',
                  name: 'Carteira Estudante',
                  status: 'done',
                  url: res.data.url,
                  type: docCarteiaAtualIsPdf ? "application/pdf" : "image/jpeg"
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

  const onFinish = (values: any) => {
    if (imageaproved === 'done') {
      setFotoCarteira(idUser, imagedata, props.idTransaction)
        .then((res: any) => {
          if (res === undefined) {
            logout()
            history.replace("/")
          } else {
            if (res.status === 200) {
              if (loadingback) {
                props.goToPrev()
              } else {
                setVisible(true)
              }
            } else {
              message.error('Não foi possivel salvar seu documento');
              setLoading(false)
              setLoadingback(false)
            }
          }
        })
        .catch((error: any) => {
          message.error('Não foi possivel salvar seu documento');
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
  };

  const onFinishFailed = () => {
    message.error('Não foi possivel salvar seus dados');
    setLoading(false)
    setLoadingback(false)
  };

  const uploadButton = (
    <Button icon={<UploadOutlined />}>Carregar Carteira de Estudante</Button>
  )

  const onConfirm = () => {
    getTransacao(idUser)
      .then((res: any) => {
        if (res.data.__transactions__ !== 404) {
          if (res.status === 200) {
            const atualizacao = res.data.__transactions__[0].requestStatus;
            if (atualizacao === "first" || atualizacao === null) {
              confirmarDocumentos(idUser)
                .then((res: any) => {
                  message.success('Dados salvo com sucesso');
                  history.push('/home')
                })
                .catch(() => {
                  setLoading(false)
                  setLoadingback(false)
                })
            } else {
              message.success('Dados salvo com sucesso');
              history.push('/home')
            }
          }
        }
      })
  }

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
      <Skeleton loading={loadingSkeleton} active>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
        >
          <Image alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>

        <Modal
          visible={visible}
          title={"Verifique suas informações antes de prosseguir!"}
          footer={null}
          closable
          width={"80vw"}
        >
          <div>
            <ModalVerifyInfoEstudante />
          </div>
          <div id={"divFooterCarteira"}>
            <Button id={"buttonConfirmFinal"} onClick={onConfirm} type={"ghost"}>Confirmar <CheckOutlined /></Button>
            <Button id={"buttonCorrigirFinal"}
              onClick={() => {
                setLoading(false)
                setVisible(false)
              }}
              type={"ghost"}>
              <LeftOutlined /> Voltar pra corrigir
            </Button>

            <Button id={"buttonCorrigirFinalSmall"}
              onClick={() => {
                setLoading(false)
                setVisible(false)
              }}
              type={"ghost"}>
              <LeftOutlined /> Voltar
            </Button>

          </div>
        </Modal>
        <p className={"subTitleMainP"}>Quase lá...</p>
        <Row style={{ marginTop: "16px" }}>
          <div id={"divider"} />

          <Col xs={24} sm={24} md={4} lg={0} xl={0} />
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Image src={Fotocarteira} style={{ borderRadius: "15px", height: "auto", width: "100%" }} alt="" />
          </Col>
          <Col xs={0} sm={0} md={0} lg={1} xl={1} />
          <Col xs={0} sm={0} md={0} lg={4} xl={4}>
            <Image src={Fotocarteiraverso} style={{ borderRadius: "15px", height: "auto", width: "100%" }} alt="" />
          </Col>
          <Col xs={0} sm={0} md={2} lg={1} xl={1} />
          <Col xs={24} sm={24} md={10} lg={10} xl={10}>
            <div id="info-envio-foto">
              <p className={"titleUploadArea"}>Carregar Carteira de Estudante</p>
              <p className={"subTitleMainPJustified"}>Estamos quase lá! Para concluir seu pedido de atualização cadastral anexe sua carteira estudantil do ano vigente. De acordo com a Lei Municipal, para gozo do beneficio da meia passagem, só serão aceitas as carteiras estudantis emitidas pelas entidades estudantis do município de Teresina.</p>
              <Form
                // eslint-disable-next-line react/jsx-props-no-spreading
                form={form}
                name="enviofotoestudante"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                <Form.Item
                  // valuePropName="fileList"
                  getValueFromEvent={normFile}
                  name="fotoestudante"
                  status="error"
                >
                  <Upload
                    fileList={fileList}
                    multiple={false}
                    accept="image/*, .pdf"
                    beforeUpload={() => false}
                    name="fotoestudante"
                    listType="picture"
                    onChange={handleChange}
                    onPreview={handlePreview}
                  >
                    {imageupload === true ? null : uploadButton}
                  </Upload>
                </Form.Item>
              </Form>
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
              icon={<CheckOutlined />}
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



/**
 *
 *

 *
 * <Form
            // eslint-disable-next-line react/jsx-props-no-spreading
            name="enviofotoestudante"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              valuePropName="fileList"
              getValueFromEvent={normFile}
              name="fotoestudante"
              status="error"
            >
              <Upload
                multiple={false}
                accept="image/*"
                beforeUpload={() => false}
                name="fotoestudante"
                listType="picture"
              >
                <Button
                  disabled={imageupload === true}
                  type="primary"
                  block
                  className="form-button"
                >
                  Carregar Carteira de Estudante
                </Button>
              </Upload>
            </Form.Item>
            <Button
              type="primary"
              block
              htmlType="submit"
              className="form-button"
            >
              Enviar Carteira Atuaaaal
            </Button>
          </Form>
 *
 *
 *
 * <Row>
          <Col className={"divButtonPrev"} xs={12} sm={12} md={12} lg={5} xl={5}>
            <Button
              id={"buttonPrev"}
              icon={<VerticalRightOutlined />}
              onClick={props.goToPrev}
            >
              Etapa Anterior
          </Button>
          </Col>
          <Col xs={0} sm={0} md={0} lg={14} xl={14} />
          <Col className={"divButtonNext"} xs={12} sm={12} md={12} lg={5} xl={5}>

          </Col>
        </Row>
 *
 *
 *
 */