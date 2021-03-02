import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import './Menu.css';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';

export default function Menu() {
    let history = useHistory();

    function Primeira() {
        history.push({
            pathname: "/pagamento",
            state: {
                origin: '1via'
            }
        });
    }
    function Atualizacao() {
        history.push({
            pathname: "/pagamento",
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