import "antd/dist/antd.css";
import "./Footer.css";
import logo from "../../images/logo_cutter.png";
import building1 from "../../images/icon_building.png";
import { Col, Row } from "antd";

function Footer() {
    return (
        <Row className={"fixedBottom"}>
            <Col xs={0} sm={0} md={0} lg={8} xl={8}></Col>
            <Col id={"divContainerFooter"} xs={24} sm={24} md={24} lg={8} xl={8}>
                <img id={"logoFooterSimple"} src={logo} alt={"logo transmobi"} />
                <p id={"subtitleFooterSimple"}>Transmobi © {new Date().getFullYear()} - Todos os direitos reservados.</p>
            </Col>
            <Col style={{display: "flex", flexDirection: "row-reverse", paddingRight: "16px"}} xs={24} sm={24} md={24} lg={8} xl={8}>
                <img src={building1} alt={"aaa"} style={{height: "8vh"}} />
            </Col>
        </Row>
    );
}

export default Footer;