import "antd/dist/antd.css";
import "./Footer.css";
import logo from "../../images/logo_cutter.png";

function FooterSimple(props: any) {
    let isFixed = props.isFixed===undefined || props.isFixed===null ? false : props.isFixed
    return (
        <div id={isFixed ? "divContainerFooterSimpleFixed" : "divContainerFooterSimple"}>
            <img id={"logoFooterSimple"} src={logo} alt={"logo transmobi"} />
            <p id={"subtitleFooterSimple"}>Transmobi © {new Date().getFullYear()} - Todos os direitos reservados.</p>
        </div>
    );
}

export default FooterSimple;