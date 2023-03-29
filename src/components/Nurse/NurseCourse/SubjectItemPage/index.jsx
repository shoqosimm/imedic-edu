import { Breadcrumb, Card, Col, Row } from "antd";
import React from "react";
import "./style.scss";
import { Document } from "react-pdf";
import { BiHome } from "react-icons/bi";
import { Link } from "react-router-dom";

const SubjectItemPage = () => {
  return (
    <>
      <Breadcrumb
        style={{ marginBottom: "2rem" }}
        items={[
          {
            title: (
              <Link to="/">
                <BiHome />
              </Link>
            ),
          },
          {
            title: <Link to="/nurse/course/101">Предмет</Link>,
          },
        ]}
      />
      <Row gutter={16}>
        <Col span={24}>
          <Card title="Text Subject">
            <Document file="some pdf"></Document>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default SubjectItemPage;
