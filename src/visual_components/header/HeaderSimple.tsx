import "antd/dist/antd.css";
import "./Header.css";
import { Col, Row } from "antd";
import { useHistory } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

function HeaderSimple() {
  let history = useHistory()
  let path = history.location.pathname

  return (
    <div className={"divContainerHeader"}>
      <Row>
        <Col xs={1} sm={1} md={2} lg={3} xl={3} />
        <Col xs={2} sm={2} md={2} lg={3} xl={3} id={"buttonBackHeader"} className={"centerVertical noPadding "}>
          {path === "/registro" || path === "/nova-solicitacao" || path === "/esqueci-minha-senha" ?
            (
              <a id={"aBackLogin"} onClick={() => history.goBack()}>
                <ArrowLeftOutlined id={"buttonBackLogin"} />
              </a>
            ) : (
              <div />
            )
          }
        </Col>
        <Col id={"divLogoHeaderSimple"} xs={18} sm={18} md={16} lg={12} xl={12}>
          <img id={"logoHeaderSimple"} src={"http://transmobibeneficios.com.br/estudante/assets/images/logo.svg"} alt={"logo transmobi"} />
        </Col>
        <Col xs={3} sm={3} md={4} lg={6} xl={6} />
      </Row>
    </div>
  );
}

export default HeaderSimple;