import { Breadcrumb, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { BiHome } from "react-icons/bi";
import "./style.scss";

import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../../../../utils/api";
import CardItem from "../../../generics/Card";

const SubjectPage = () => {
  const param = useParams();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);

  // getSubjects
  const getSubjects = (id) => {
    api
      .get(`api/nurse/course/list/${id}`)
      .then((res) => {
        setSubjects(
          res.data.data.map((item) => {
            return {
              id: item.id,
              name: item.name,
              teaser: item.teaser,
              subject_type: item.subject_type,
            };
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const breadcrumbsItems = [
    {
      title: (
        <Link to="/">
          <BiHome />
        </Link>
      ),
    },
  ];

  // linkToSubject
  const linkToSubject = (id) => {
    navigate(`/nurse/course/subject/${id}`, { state: { message: param.id } });
  };

  useEffect(() => {
    getSubjects(param.id);
  }, [param]);

  return (
    <>
      <Breadcrumb style={{ marginBottom: "2rem" }} items={breadcrumbsItems} />

      <Row
        gutter={[20, 20]}
        style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
      >
        {subjects.map((item, index) => {
          return (
            <Col key={index}>
              <CardItem
                title={item.name}
                teaser={item.teaser}
                subject={item.subject_type}
                click={item.id}
                // disabled={index === 0 ? false : true}
              />
            </Col>
          );
        })}
      </Row>
    </>
  );
};
export default SubjectPage;
