import { Breadcrumb, Card, Col, Row } from "antd";
import React from "react";
import { BiHome } from "react-icons/bi";
import "./style.scss";

import { useParams, Link } from "react-router-dom";

const SubjectPage = () => {
  const { id } = useParams();

  const breadcrumbsItems = [
    {
      title: (
        <Link to="/">
          <BiHome />
        </Link>
      ),
    },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbsItems} />
      <Row>
        <Col span={24}>
          <Card title="Subject title">
            <Row gutter={16}>
              <Col span={8}>
                <Card
                  extra={
                    <Link to={`/nurse/course/subject/${id}`}>Boshlash</Link>
                  }
                  title="Card title"
                  hoverable={true}
                >
                  Card content
                </Card>
              </Col>
              <Col span={8}>
                <Card
                  extra={<a href="#">Boshlash</a>}
                  title="Card title"
                  hoverable={true}
                >
                  Card content
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default SubjectPage;
