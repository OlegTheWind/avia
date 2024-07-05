import React from 'react'
import { Row, Col } from 'antd'

import CheckBox from '../CheckBox/CheckBox'
import './Main.css'
// import FilterList from '../FilterList/FilterList'
import ItemList from '../ItemList/ItemList'

function Main() {
    return (
        <main className="main_color">
            <Row>
                <Col span={18} push={6}>
                    <div className="main_width">
                        <ItemList />
                    </div>
                </Col>
                <Col span={6} pull={18}>
                    <div className="block_checkBox">
                        <CheckBox />
                    </div>
                </Col>
            </Row>
        </main>
    )
}

export default Main
