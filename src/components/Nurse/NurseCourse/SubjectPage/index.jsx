import { Breadcrumb, Button, Card, Col,  Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { BiHome } from "react-icons/bi";
import "./style.scss";
import { useParams, Link } from "react-router-dom";
import { api } from "../../../../utils/api";
import CardItem from "../../../generics/Card";
import { TbMoodEmpty } from "react-icons/tb";
import CommentCard from "../../../generics/CommentCard";

const SubjectPage = () => {
  const param = useParams();
  const [subjects, setSubjects] = useState([]);
  const [emptyText, setEmptyText] = useState();
  const [commentEmptyText, setCommentEmptyText] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState();
  const [paginateComment, setPaginateComment] = useState(12);
  const [loadingBtn, setLoadingBtn] = useState(false);

  // getSubjects
  const getSubjects = (id) => {
    setLoading(true);
    api
      .get(`api/nurse/course/list/${id}`)
      .then((res) => {
        setLoading(false);
        if (res.data.data.length <= 0) {
          setEmptyText(" Ushbu kurs bo'yicha mavzular yo'q!...");
          getComments(param.id, paginateComment);
        } else {
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
          getComments(param.id, paginateComment);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  // getComments
  const getComments = (id, newPerPage) => {
    const body = {
      per_page: newPerPage,
      course_id: param.id ?? id,
    };
    api
      .post("api/receive-comment", body)
      .then((res) => {
        if (res.data.data.length > 0) {
          setComment(res.data.data);
        } else {
          setCommentEmptyText("Ushbu kurs bo'yicha izohlar mavjud emas...");
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  // handleMoreComment
  const handleMoreComment = () => {
    setLoadingBtn(true);
    const newPerPage = paginateComment + 12;
    setPaginateComment(newPerPage);
    getComments(param.id, newPerPage);
    setLoadingBtn(false);
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
            <div
              className="d-flex align-center "
              style={{ flexDirection: "column" }}
            >
              <TbMoodEmpty style={{ fontSize: "54px", fill: "yellow" }} />
              <p style={{ fontSize: "24px", textAlign: "center" }}>
                {emptyText}
              </p>
            </div>
          </div>
        )}
      </Row>
      <Card title="Izohlar" className="izohCard">
        {loading && <Spin />}
        {commentEmptyText && (
          <em
            style={{
              display: "block",
              margin: "2rem 0",
              textAlign: "center",
              color: "grey",
            }}
          >
            {commentEmptyText}
          </em>
        )}
        {comment?.map((item) => {
          return <CommentCard key={item.id} data={item} />;
        })}
        <Button
          disabled={commentEmptyText ? true : false}
          onClick={handleMoreComment}
          loading={loadingBtn}
        >
          Ko'proq ko'rsatish
        </Button>
      </Card>
    </>
  );
};
export default SubjectPage;
