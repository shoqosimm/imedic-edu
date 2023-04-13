import { Breadcrumb, Col, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { BiHome } from "react-icons/bi";
import "./style.scss";
import { useParams, Link } from "react-router-dom";
import { api } from "../../../../utils/api";
import CardItem from "../../../generics/Card";

const SubjectPage = () => {
  const param = useParams();
  const [subjects, setSubjects] = useState([]);
  const [emptyText, setEmptyText] = useState();
  const [loading, setLoading] = useState(false);

  // getSubjects
  const getSubjects = (id) => {
    setLoading(true);
    api
      .get(`api/nurse/course/list/${id}`)
      .then((res) => {
        setLoading(false);

        res.data.data.length <= 0
          ? setEmptyText(" Ushbu kurs bo'yicha mavzular yo'q!...")
          : setSubjects(
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
        setLoading(false);
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

  useEffect(() => {
    getSubjects(param.id);
  }, [param]);

  return (
    <>
      <Breadcrumb style={{ marginBottom: "2rem" }} items={breadcrumbsItems} />

      {loading && (
        <Spin
          className="d-flex align-center justify-center"
          style={{ height: "100%" }}
        />
      )}
      <Row
        gutter={[20, 20]}
        style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
      >
        {!emptyText ? (
          subjects.map((item, index) => {
            return (
              <Col key={index}>
                <CardItem
                  title={item.name}
                  teaser={item.teaser}
                  subject={item.subject_type}
                  click={item.id}
                  disabled={index === 0 ? false : true}
                />
              </Col>
            );
          })
        ) : (
          <div
            style={{
              width: "100%",
              height: "20rem",
              fontSize: "18px",
              letterSpacing: "1px",
              fontWeight: "600",
            }}
            className="d-flex align-center justify-center"
          >
            {emptyText}
          </div>
        )}
      </Row>
    </>
  );
};
export default SubjectPage;
