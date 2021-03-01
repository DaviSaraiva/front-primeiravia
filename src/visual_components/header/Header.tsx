import "antd/dist/antd.css";
import "./Header.css";
import { Col, Row, Menu, Drawer } from "antd";
import { useHistory } from "react-router-dom";
import { capitalizeFirstLetter, logout } from "../../globals/globalFunctions";
import { CaretDownFilled, FileSyncOutlined, LockOutlined, MenuOutlined } from "@ant-design/icons";
import { useState } from "react";

function Header() {
  let history = useHistory()
  let estudante = { id: "", nome: "" }
  let estudanteLocal = localStorage.getItem("usuario")

  if (estudanteLocal !== null && estudanteLocal !== undefined) {
    estudante = JSON.parse(estudanteLocal)
  }

  const [visible, setVisible] = useState(false)
  const { SubMenu } = Menu;

  const handleClick = (e: any) => {
    if (e.key === "setting:atualizacao") {
      localStorage.setItem("functionLooked", "atualizacao")
      history.push("/redirect")
    }

    if (e.key === "setting:bloqueio") {
      localStorage.setItem("functionLooked", "bloqueio")
      history.push("/redirect")
    }

    if (e.key === "setting:redefinir") {
      history.push("/redefinir-senha")
    }

    if (e.key === "setting:sair") {
      logout()
      history.replace('/')
    }
  };

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };


  return (
    <div className={"divContainerHeader"}>
      <Drawer
        title={"Bem-vindo, " + capitalizeFirstLetter(estudante.nome.split(" ")[0])}
        placement="left"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <Menu onClick={handleClick} mode="inline">
          {/* <SubMenu key="SubMenu" icon={<CaretDownFilled />} title={"Bem-vindo, " + capitalizeFirstLetter(estudante.nome.split(" ")[0])}>  */}
          <Menu.ItemGroup>
            <Menu.Item key="setting:atualizacao">Atualização Cadastral</Menu.Item>
            <Menu.Item key="setting:bloqueio">Solicitações de Bloqueio</Menu.Item>

          </Menu.ItemGroup>
          <Menu.ItemGroup title="Área do estudante">
            <Menu.Item key="setting:redefinir">Redefinir Senha</Menu.Item>
            <Menu.Item key="setting:sair">Sair</Menu.Item>
          </Menu.ItemGroup>
          {/* </SubMenu> */}
        </Menu>
      </Drawer>
      <Row>
        {/* sizes: sm md lg xl */}
        <Col xs={1} sm={1} md={1} lg={2} xl={2} />
        <Col xs={3} sm={3} md={2} lg={0} xl={0}>
          <a onClick={showDrawer}>
            <MenuOutlined style={{ color: "#000", fontSize: "4vh", marginTop: "1vh" }} />
          </a>
        </Col>
        <Col id={"divLogoHeader"} xs={8} sm={8} md={7} lg={2} xl={2}>
          <img id={"logoHeader"} src={"http://transmobibeneficios.com.br/estudante/assets/images/logo.svg"} alt={"logo transmobi"} />
        </Col>
        <Col span={0} lg={2} xl={2} />
        <Col className={"invertedDiv"} xs={0} sm={0} md={0} lg={15} xl={15}>
          <Menu onClick={handleClick} mode="horizontal" style={{ border: "none" }}>
            <Menu.Item key="setting:atualizacao" icon={<FileSyncOutlined />}>Atualização Cadastral</Menu.Item>
            <Menu.Item key="setting:bloqueio" icon={<LockOutlined />}>Bloqueio</Menu.Item>
            <SubMenu key="SubMenu" title={"Bem-vindo, " + capitalizeFirstLetter(estudante.nome.split(" ")[0])} icon={<CaretDownFilled />}>
              <Menu.ItemGroup title="Área do estudante">
                <Menu.Item key="setting:redefinir">Redefinir Senha</Menu.Item>
                <Menu.Item key="setting:sair">Sair</Menu.Item>
              </Menu.ItemGroup>
            </SubMenu>
          </Menu>

          {/* {notShowEndSession(history) ?
            (
              <Menu onClick={handleClick} mode="horizontal">
                <SubMenu key="SubMenu" icon={<CaretDownFilled />} title={"Bem-vindo, " + capitalizeFirstLetter(estudante.nome.split(" ")[0])}>
                  <Menu.ItemGroup title="Área do estudante">
                    <Menu.Item key="setting:atualizacao">Atualização Cadastral</Menu.Item>
                    <Menu.Item key="setting:bloqueio">Solicitações de Bloqueio</Menu.Item>
                    <Menu.Item key="setting:sair">Sair</Menu.Item>
                  </Menu.ItemGroup>
                </SubMenu>
              </Menu>
            ) : (
              <p />
            )
          } */}
        </Col>
        <Col xs={3} sm={3} md={4} lg={2} xl={2} />
      </Row>
    </div>
  );
}

export default Header;