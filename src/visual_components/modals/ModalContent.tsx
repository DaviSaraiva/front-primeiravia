import { Form, Input, Select } from "antd";
import { MaskedInput } from "antd-mask-input";
import "../../globals/globalStyle.css";
import { getOptions, validateCPF, validateEmail, validateEscola, validateNome, validatePhone } from "../../globals/globalFunctions";


function ModalContent(props: any) {
    const { Option } = Select;
    const [form] = Form.useForm();

    let options = getOptions()

    let nameAluno = props.nameAluno
    let emailAluno = props.emailAluno
    let phoneAluno = props.phoneAluno
    let cpfAluno = props.cpfAluno
    let schoolAluno = props.schoolAluno
    let motivoAluno = props.motivoAluno
    
    form.setFieldsValue({
        name: props.nameAluno,
        email: props.emailAluno,
        phone: props.phoneAluno,
        cpf: props.cpfAluno,
        escola: props.schoolAluno,
        motivo: props.motivoAluno
    }) 

    return (
        <div>
            <p className={"firstLabelInputField"}>Nome Completo:</p>
            <Form form={form} name="register" scrollToFirstError>
                <Form.Item
                    name="name"
                    initialValue={nameAluno}
                    rules={[
                        {
                            required: true,
                            message: "Por-favor, informe o seu nome!",
                        },
                    ]}
                >
                    <Input className={"inputText"} disabled onChange={props.setNomeApply} onBlur={() => validateNome(nameAluno) } />
                </Form.Item>

                <p className={"labelInputField"}>E-mail:</p>
                <Form.Item
                    name="email"
                    initialValue={emailAluno}
                    rules={[
                        {
                            type: "email",
                            message: "O E-mail informado não é válido!",
                        },
                        {
                            required: true,
                            message: "Por-favor, informe um e-mail!",
                        },
                    ]}
                >
                    <Input className={"inputText"} disabled onChange={props.setEmailApply} onBlur={() => validateEmail(emailAluno)} />
                </Form.Item>

                <p className={"labelInputField"}>Telefone:</p>
                <Form.Item
                    name="phone"
                    initialValue={phoneAluno}
                    rules={[
                        {
                            required: true,
                            message: "Por-favor, informe um telefone para contato!",
                        },
                    ]}
                >
                    <MaskedInput
                        className={"inputText"}
                        mask="(11) 1 1111-1111"
                        disabled
                        onChange={props.setPhoneApply}
                        onBlur={() => { validatePhone(phoneAluno, 'phone') }}
                    />
                </Form.Item>

                <p className={"labelInputField"}>CPF:</p>
                <Form.Item
                    name="cpf"
                    initialValue={cpfAluno}
                    rules={[
                        {
                            required: true,
                            message: "Por-favor, informe o seu CPF!",
                        },
                    ]}
                >
                    <MaskedInput
                        className={"inputText"}    
                        mask="111.111.111-11"
                        disabled
                        onChange={props.setCPFApply}
                        onBlur={() => { validateCPF(cpfAluno) }}
                    />
                </Form.Item>

                <p className={"labelInputField"}>Escola onde você estuda:</p>
                <Form.Item
                    name="escola"
                    initialValue={schoolAluno}
                    rules={[
                        {
                            required: true,
                            message: "Por-favor, informe a sua escola!",
                        },
                    ]}
                >
                    <Input className={"inputText"} disabled onChange={props.setEscolaApply} onBlur={() => { validateEscola(schoolAluno) }} />
                </Form.Item>

                <p className={"labelInputField"}>Motivo do bloqueio:</p>
                <Form.Item
                    name="motivo"
                    initialValue={motivoAluno}
                >
                    <Select
                        className={"formItemSelector"}
                        bordered={false}
                        onChange={props.setMotivoApply}
                    >
                        {
                            options.map((it) => {
                                return <Option value={it.value}>{it.title}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Form>
        </div>
    )
}

export default ModalContent