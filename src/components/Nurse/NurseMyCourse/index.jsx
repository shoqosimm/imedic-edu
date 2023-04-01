import { Card, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MyCardItem from "../../generics/MyCard";
import { api } from "../../../utils/api";
import "./style.scss";

const NurseMyCourse = () => {
  const [courses, setCourses] = useState([]);

  // getCourseList
  const getCourseList = () => {
    api.get("api/nurse/course/list").then((res) =>
      setCourses(
        res.data.data.map((item) => {
          return {
            key: item.id,
            ...item,
          };
        })
      )
    );
  };

  useEffect(() => {
    getCourseList();
  }, []);

  return (
    <Row className="mycourse__wrapper">
      <Col span={24}>
        <Card title="Мои курсы">
          <div
            style={{ flexWrap: "wrap" }}
            className="d-flex align-center gap-2"
          >
            {courses?.map((item) => {
              return <MyCardItem key={item.id} item={item} />;
            })}
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default NurseMyCourse;
