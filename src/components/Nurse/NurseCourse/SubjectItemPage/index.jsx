import { Card, Col, Row } from "antd";
import React from "react";
import './style.scss'
// import  Document  from "react-pdf/dist/esm/Document";

const SubjectItemPage = () =>{
    return (
        <>
            <Row gutter={16}>
                <Col span={24}>
                    <Card title="Text Subject">
                        {/* <Document file={'pdf-test.pdf'}>

                        </Document> */}
                    </Card>
                </Col>
            </Row>
        </>
    )
}
export default SubjectItemPage;