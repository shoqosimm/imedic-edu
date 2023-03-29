import { Card, Col, Row } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const NurseMyCourse = () => {
  const id = 1;

  return (
    <Row>
      <Col span={24}>
        <Card title="Мои курсы">
          <Row gutter={[20, 20]}>
            <Col xl={8} lg={8} md={12} sm={24} xs={24}>
              <Card
                extra={<Link to={`/nurse/course/subject/${id}`}>Boshlash</Link>}
                title="Card title"
                hoverable={true}
              >
                Card content
              </Card>
            </Col>
            <Col xl={8} lg={8} md={12} sm={24} xs={24}>
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
  );
};

export default NurseMyCourse;
