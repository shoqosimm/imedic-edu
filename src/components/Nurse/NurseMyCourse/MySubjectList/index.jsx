import { Breadcrumb, Card, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./style.scss";
import MyCardItem from "../../../generics/MyCard";
import { api } from "../../../../utils/api";
import { BiHome } from "react-icons/bi";

const NurseMyCourse = () => {
  const params = useParams();
  const [courses, setCourses] = useState([]);

  // getCourseList
  const getCourseList = () => {
    api.get(`api/nurse/subject/mycourse/${params.id}`).then((res) => {
      setCourses(
        res.data.map((item) => {
          return {
            key: item.id,
            ...item,
          };
        })
      );
    });
  };

  useEffect(() => {
    getCourseList();
  }, []);

  return (
    <div className="mycourse__wrapper">
      <Breadcrumb
        style={{ marginBottom: "0.5rem" }}
        items={[
          {
            title: (
              <Link to="/nurse/mycourse">
                <BiHome />
              </Link>
            ),
          },
        ]}
      />
      <div>
        <Card title="Мои курсы">
          <div
            style={{ flexWrap: "wrap" }}
            className="d-flex align-center gap-3"
          >
            {courses?.map((item) => {
              return (
                <MyCardItem
                  disabled={item.status === 0 ? true : false}
                  key={item.id}
                  item={item}
                />
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NurseMyCourse;
