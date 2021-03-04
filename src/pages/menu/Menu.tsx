import React from 'react';
import 'antd/dist/antd.css';
import './Menu.css';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { isLogged } from '../../globals/globalFunctions';

export default function Menu() {
    let history = useHistory();
    if (!isLogged()) {
        history.replace('/')
    }
    function Primeira() {
        history.push({
            pathname: "/redirectprimeira",
            state: {
                origin: 'primeiravia'
            }
        });
    }
    function Atualizacao() {
        history.push({
            pathname: "/redirect",
            state: {
                origin: 'atualizacao'
            }
        });
    }

    return (
        <div className={"fullDiv"}>
            <div id={"divRedirectContent"}>
                <Button type="primary" onClick={Primeira}>Primeira Via</Button>
                <Button type="primary" danger onClick={Atualizacao}>Atualizacao</Button>
            </div>
        </div>
    )
}