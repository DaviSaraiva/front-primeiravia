import { useEffect, useState } from "react";
import { Row, Col, Table, Tag, Modal, Button, message, Tooltip, Card } from "antd";
import Header from "../../../visual_components/header/Header";
import ModalContent from "../../../visual_components/modals/ModalContent"
import "./Main.css"
import "../../../globals/globalStyle.css";
import { deleteSolicitacao, getSolicitacoesFromServer, updateSolicitacao } from "../../../services/SolicitacoesService";
import { DeleteFilled, EditFilled, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getDateFromMoment, getOption, isLogged, logout, maskForDate } from "../../../globals/globalFunctions";
import { useHistory } from "react-router-dom";

function Main() {

    let history = useHistory()

    if (!isLogged()) {
        history.replace('/')
    }

    let estudante = { id: "", pessoaId: "", nome: "" }
    let estudanteLocal = localStorage.getItem("usuario")

    if (estudanteLocal !== null && estudanteLocal !== undefined) {
        estudante = JSON.parse(estudanteLocal)
    } else {
        localStorage.setItem("functionLooked", "bloqueio")
        history.replace('/')
    }

    let emptyObject = { id_solicitacao: "", name_aluno: "", email: "", phone: "", cpf: "", school: "", created_at: new Date(), dateMasked: "", motivoTitle: "", motivo: "", situation: false }
    const [, setObjectDataModal] = useState(emptyObject)
    const [modal1Visible, setModal1Visible] = useState(false)
    const [solicitacoes, setSolicitacoes] = useState([])

    const [idModal, setIdModal] = useState("")
    const [nameModal, setNameModal] = useState("")
    const [emailModal, setEmailModal] = useState("")
    const [phoneModal, setPhoneModal] = useState("")
    const [cpfModal, setCPFModal] = useState("")
    const [schoolModal, setSchoolModal] = useState("")
    const [motivoModal, setMotivoModal] = useState("")

    useEffect(() => {
        if (estudante === null || estudante === undefined) {

            Modal.info({
                content: "Você deve logar primeiro!",
                onOk: () => {
                    history.replace('/')
                }
            })
        } else {
            getSolicitacoesFromServer(estudante.pessoaId).then((response) => {
                if (response === undefined) {
                    logout()
                    history.replace("/")
                } else {
                    response.forEach((element: any) => {
                        let motivoTitle = getOption(element.motivo)
                        let newDate = getDateFromMoment(element.created_at)
                        let newMaskedDate = maskForDate(newDate)
                        element.created_at = newDate
                        element.dateMasked = newMaskedDate
                        element.motivoTitle = motivoTitle
                    });

                    setSolicitacoes(response)
                }
            })
        }
    }, [])

    const goToNovaSolicitacao = () => {
        history.push("/nova-solicitacao")
    }

    const setDataInModal = (params: any) => {
        // alert(JSON.stringify(params))
        setObjectDataModal(params)

        setIdModal(params.id_solicitacao)
        setNameModal(params.name_aluno)
        setEmailModal(params.email)
        setPhoneModal(params.phone)
        setCPFModal(params.cpf)
        setSchoolModal(params.school)
        setMotivoModal(params.motivo)

        setModal1Visible(true)
    }

    const columns = [

        {
            title: 'Nome',
            dataIndex: 'name_aluno',
            key: 'name',
            ellipsis: {
                showTitle: false,
            },
            render: (name: string) => (
                <Tooltip placement="topLeft" title={name}>
                    {name}
                </Tooltip>
            )
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ellipsis: {
                showTitle: false,
            },
            render: (email: string) => (
                <Tooltip placement="topLeft" title={email}>
                    {email}
                </Tooltip>
            )
        },
        {
            title: 'Telefone',
            dataIndex: 'phone',
            key: 'phone',
            ellipsis: {
                showTitle: false,
            },
            render: (phone: string) => (
                <Tooltip placement="topLeft" title={phone}>
                    {phone}
                </Tooltip>
            )
        },
        {
            title: 'CPF',
            dataIndex: 'cpf',
            key: 'cpf',
            ellipsis: {
                showTitle: false,
            },
            render: (cpf: string) => (
                <Tooltip placement="topLeft" title={cpf}>
                    {cpf}
                </Tooltip>
            )
        },
        {
            title: 'Escola',
            dataIndex: 'school',
            key: 'school',
            ellipsis: {
                showTitle: false,
            },
            render: (school: string) => (
                <Tooltip placement="topLeft" title={school}>
                    {school}
                </Tooltip>
            )
        },
        {
            title: 'Data',
            dataIndex: 'dateMasked',
            key: 'created_at',
            ellipsis: {
                showTitle: false,
            },
            render: (created_at: string) => (
                <Tooltip placement="topLeft" title={created_at}>
                    {created_at}
                </Tooltip>
            )
        },
        {
            title: 'Motivo',
            dataIndex: 'motivoTitle',
            key: 'motivo',
            ellipsis: {
                showTitle: false,
            },
            render: (motivo: string) => (
                <Tooltip placement="topLeft" title={motivo}>
                    {motivo}
                </Tooltip>
            )
            // filters: getOptionsToFilter(),
            // filterMultiple: false,
        },
        {
            title: 'Situação',
            dataIndex: 'situation',
            key: 'situation',
            ellipsis: {
                showTitle: false,
            },

            render: (situation: Boolean) => {
                let color = situation ? 'green' : 'volcano';
                let valueText = situation ? "Concluído" : "Pendente"
                return (
                    <Tag color={color} key={valueText}>
                        {valueText}
                    </Tag>
                )
            }
        },
        {
            title: 'Action',
            key: 'operation',
            fixed: false,
            width: 200,
            render: (situation: Boolean, record: any) => (
                situation ?
                    (
                        <div>
                            <a><EditFilled onClick={() => setDataInModal(record)} style={{ fontSize: '24px', color: '#817f7f' }} /></a>
                            <a><DeleteFilled onClick={() => confirm(record)} style={{ fontSize: '24px', marginLeft: '18px', color: '#ad2727' }} /></a>
                        </div>
                    ) : (
                        <div />
                    )
            )
        },
    ]

    function confirm(params: any) {
        Modal.confirm({
            title: 'Deseja excluir essa solicitação?',
            icon: <ExclamationCircleOutlined />,
            content: 'Essa operação não poderá ser desfeita...',
            okText: 'Sim, excluir',
            onOk: async () => {
                try {
                    let retorno = await deleteSolicitacao(params.id_solicitacao)
                    getSolicitacoesFromServer(estudante.pessoaId).then((response) => {
                        if (response === undefined) {
                            logout()
                            history.replace("/")
                        } else {
                            response.forEach((element: any) => {
                                let motivoTitle = getOption(element.motivo)
                                let newDate = getDateFromMoment(element.created_at)
                                let newMaskedDate = maskForDate(newDate)
                                element.created_at = newDate
                                element.dateMasked = newMaskedDate
                                element.motivoTitle = motivoTitle
                            });

                            setSolicitacoes(response)
                            message.success("Solicitação excluída com sucesso!")
                        }
                    })
                } catch (error) {
                    message.error(error.response.data.message)
                }


            },
            cancelText: 'Cancelar'
        });
    }

    const nomeApply = (e: any) => { setNameModal(e.target.value) }
    const emailApply = (e: any) => { setEmailModal(e.target.value) }
    const phoneApply = (e: any) => { setPhoneModal(e.target.value) }
    const cpfApply = (e: any) => { setCPFModal(e.target.value) }
    const schoolApply = (e: any) => { setSchoolModal(e.target.value) }
    const motivoApply = (value: any) => { setMotivoModal(value) }

    return (
        <div className={"fullDiv"}>
            <Header />
            <Modal
                title={"Solicitação de Bloqueio do Cartão"}
                style={{ top: 20 }}
                visible={modal1Visible}
                okText={"Salvar"}
                cancelText={"Cancelar"}
                cancelButtonProps={{
                    danger: true
                }}
                onOk={async () => {
                    try {
                        let object = {
                            id_solicitacao: idModal,
                            name_aluno: nameModal,
                            email: emailModal,
                            phone: phoneModal,
                            cpf: cpfModal,
                            school: schoolModal,
                            motivo: motivoModal
                        }

                        await updateSolicitacao(object)

                        getSolicitacoesFromServer(estudante.pessoaId).then((response) => {
                            response.forEach((element: any) => {
                                let motivoTitle = getOption(element.motivo)
                                let newDate = getDateFromMoment(element.created_at)
                                let newMaskedDate = maskForDate(newDate)
                                element.created_at = newDate
                                element.dateMasked = newMaskedDate
                                element.motivoTitle = motivoTitle
                            });

                            setSolicitacoes(response)
                        })
                        setModal1Visible(false)
                        message.success('Solicitação atualizada com sucesso!')
                    } catch (error) {
                        message.error(error.response.data.message)
                    }
                }}
                onCancel={() => setModal1Visible(false)}

            >
                <ModalContent
                    nameAluno={nameModal}
                    emailAluno={emailModal}
                    phoneAluno={phoneModal}
                    cpfAluno={cpfModal}
                    schoolAluno={schoolModal}
                    motivoAluno={motivoModal}
                    setNomeApply={nomeApply}
                    setEmailApply={emailApply}
                    setPhoneApply={phoneApply}
                    setCPFApply={cpfApply}
                    setEscolaApply={schoolApply}
                    setMotivoApply={motivoApply}
                />
            </Modal>
            <Row>
                <Col xs={1} sm={1} md={1} lg={2} xl={2} />
                <Col className={"divTitleMain"} xs={22} sm={22} md={22} lg={20} xl={20}>
                    <p className={"divTitleMainP"}>Veja abaixo suas solicitações</p>
                    <Button id={"btnAddSolicitacaoDesktop"} type="primary" shape={"round"} icon={<PlusOutlined />} size={"middle"} onClick={() => goToNovaSolicitacao()}>
                        Nova Solicitação
                    </Button>
                </Col>
                <Col xs={1} sm={1} md={1} lg={2} xl={2} />
            </Row>
            <Row>
                <Col xs={0} sm={0} md={0} lg={2} xl={2} />
                <Col style={{ height: "75vh" }} xs={0} sm={0} md={0} lg={20} xl={20}>
                    <Table dataSource={solicitacoes} columns={columns} scroll={{ x: 1000, y: 300 }} bordered />
                </Col>
                <Col id={"divSolicitacoes"} xs={24} sm={24} md={24} lg={0} xl={0}>
                    {
                        solicitacoes.map((item: any) => {
                            return (
                                <Card
                                    id={"cardSolicitacao"}
                                    actions={[
                                        <EditFilled onClick={() => setDataInModal(item)} />,
                                        <DeleteFilled onClick={() => confirm(item)} style={{ color: '#ad2727' }} />,
                                    ]}
                                    bordered
                                >
                                    <div id={"rowDataAluno"}>
                                        <p id={"idNameAluno"}>{item.motivoTitle}</p>
                                        <p id={"idDataSolicitacao"}>{item.dateMasked}</p>
                                    </div>
                                    <div id={"rowDataAluno"}>
                                        <p className={"dataSolicitacao"}>{item.name_aluno}</p>
                                        <p className={"dataSolicitacao"}>{item.situation ? "Concluído" : "Pendente"}</p>
                                    </div>
                                    {/* <Meta
                                        title={item.name_aluno}
                                        description={item.dateMasked}
                                    /> */}
                                </Card>
                            )
                        })
                    }
                </Col>
                <Col xs={0} sm={0} md={0} lg={2} xl={2} />
            </Row>
            <Button id={"btnAddSolicitacaoMobile"} type="primary" shape="circle" icon={<PlusOutlined />} size={"large"} onClick={() => goToNovaSolicitacao()} />

            {/* <Footer /> */}
        </div>
    )
}

export default Main;

