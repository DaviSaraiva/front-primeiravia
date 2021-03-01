import React, { useEffect, useState } from 'react';
// eslint-disable-next-line object-curly-newline
import { Form, Image, Row, Col, Button, Upload, Skeleton, message } from 'antd';
import Fotoexemplo from '../../images/fotoexemplo.jpg';
import { validarImg } from '../cadastro/CadastroPessoa';
import { getIdUser, logout, getBase64 } from '../../globals/globalFunctions';
import { PlusOutlined, UploadOutlined, VerticalLeftOutlined, VerticalRightOutlined } from '@ant-design/icons';
import { getDocumentPicture, getDocuments, setFotoEstudante } from '../../services/AccessServices';
import { useHistory } from 'react-router-dom';
import Modal from 'antd/lib/modal/Modal';

export default function Fotoestudante(props: any) {
  const form = new FormData();
  const [form1] = Form.useForm();

  let obj = getIdUser()
  let history = useHistory()

  const [idUser] = useState(obj.id)
  const [imageupload, setImageUploadvalid] = useState(false);
  const [imagedata, setimagedata] = useState({});
  const [imageaproved, setimagearpoved] = useState('error');
  const [errorPic, setErrorPic] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [loadingSkeleton, setLoadingSkeleton] = useState(true)
  const [loading, setLoading] = useState(false);
  const [loadingback, setLoadingback] = useState(false)

  const [fileList, setFileList] = useState<any[]>([])

  useEffect(() => {
    getDocuments(idUser)
      .then((res: any) => {
        let docFotoEstudante = res.data.result.docfotoestudante

        if (docFotoEstudante !== null) {
          getDocumentPicture(idUser, docFotoEstudante)
            .then((res: any) => {
              if (res.data.statusCode === undefined) {
                let image = {
                  uid: '-2',
                  name: 'image.jpg',
                  status: 'done',
                  url: res.data.url,
                  type: "image/jpeg"
                }

                setFileList([image])
                setImageUploadvalid(true)
                setimagearpoved('done')
              }
              setLoadingSkeleton(false)
            })
            .catch((error: any) => {
              setLoadingSkeleton(false)
            })
        } else {
          setLoadingSkeleton(false)
        }
      })
      .catch((error: any) => {
        alert(JSON.stringify(error))
        setLoadingSkeleton(false)
      })
  }, [])

  const normFile = (e: any) => {
    if (e.file.status !== 'removed') {
      setImageUploadvalid(true);
      if (e.file.type === 'image/png' || e.file.type === 'image/jpeg') {
        if (e.file.size / 1024 / 1024 > 5) {
          // erro de tamanho
          validarImg('size');
          setimagearpoved('size');
          e.fileList[0].status = 'error';
        } else {
          form.append('fotoestudante', e.fileList[0].originFileObj);
          setimagedata(form);
          setimagearpoved('done');
        }
      } else if (e.file.type !== 'image/png' || e.file.type !== 'image/jpeg') {
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

  const onFinish = () => {
    if (imageaproved === 'done') {
      setFotoEstudante(idUser, imagedata, props.idTransaction)
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
      
        if (loadingback) {
        props.goToPrev()
      } else {
        props.goToNext()
      }
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

  const uploadButton = (
    <Button icon={<UploadOutlined />}>Selecionar a foto</Button>
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

    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  }

  return (
    <div>
      <Skeleton loading={loadingSkeleton} active>
        <Row>
          <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={() => setPreviewVisible(false)}
          >
            <Image alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>

          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <p className={"subTitleMainP"}>Para continuar a solicitação é necessário enviar uma foto.</p>
            <p id={"textHowPictureHasToBe"}>
              Capriche na foto, mas antes confira se ela atende as regras
            exigidas. <br />Caso a foto não atenda as regras, será negada e você será
            avisado(a) para fazer uploade de uma nova foto.
          </p>
            <Image src={Fotoexemplo} alt="" />
          </Col>
          <Col xs={0} sm={0} md={0} lg={2} xl={2} />
          <Col xs={24} sm={24} md={24} lg={10} xl={10} className={"divLoadPicture"}>
            <p className={"titleUploadArea"}>Carregar Foto do Estudante</p>
            <p className={"subTitleMainPJustified"}>Selecione uma foto sua recente e com uma boa qualidade, pois ela será a foto que irá constar no seu cadastro do Sistema de Bilhetagem. Seu rosto deverá estar em primeiro plano, por isso, não esqueça de ajustar bem sua foto.</p>
            <br />
            <Form
              // eslint-disable-next-line react/jsx-props-no-spreading
              form={form1}
              name="enviofotoestudante"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <div id="botaocadpessoa">
                <Form.Item
                  // valuePropName="fileList"
                  getValueFromEvent={normFile}
                  name="fotoestudante"
                  status="error"
                >

                  <Upload
                    listType="picture"
                    fileList={fileList}
                    showUploadList={true}
                    accept="image/*"
                    className="avatar-uploader"
                    beforeUpload={() => false}
                    name="fotoestudante"
                    onChange={handleChange}
                    onPreview={handlePreview}
                  >
                    {imageupload === true ? null : uploadButton}
                  </Upload>
                  {/* <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleChange}
                >
                  {imageupload === true ? null : uploadButton}
                </Upload>*/}
                </Form.Item>

              </div>
            </Form>

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
                form1.submit()
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
                form1.submit()
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
                form1.submit()
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