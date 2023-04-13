import { Breadcrumb, Button, Card, Col, Modal, Row, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import "./style.scss";
import { BiHome } from "react-icons/bi";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { api } from "../../../../utils/api";
import { Notification } from "../../../Notification/Notification";
import { BsArrowRight, BsCheckCircle } from "react-icons/bs";
import { ToastContainer } from "react-toastify";

const MySubjectItemPage = () => {
  const param = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [subject_id, setSubject_id] = useState();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [skeleton, setSkeleton] = useState(false);
  const [subject, setSubject] = useState();

  // getSubject
  const getSubject = () => {
    setSkeleton(true);
    api
      .get(`api/nurse/subject/item/${param.id}`)
      .then((res) => {
        setSkeleton(false);
        setSubject(res.data.content);
      })
      .catch((err) => {
        console.log(err, "err");
        setSkeleton(false);
      });
  };

  // getNextSubject
  const getNextSubject = () => {
    setConfirmLoading(true);
    setSkeleton(true);
    api
      .get(`api/nurse/subject/next/${param.id}`)
      .then((res) => {
        if (res.status == 200) {
          if (res.data?.subject?.subject_type === "test") {
            return navigate(
              `/nurse/mycourse/${subject_id}/subject/test/${res.data.id}`,
              { state: {message:subject_id} }
            );
          } else {
            navigate(`/nurse/mycourse/${subject_id}/subject/${res.data.id}`, {
              state: {message:subject_id},
            });
            Notification();
          }
          setConfirmLoading(false);
          setSkeleton(false);
          setSubject(res.data.content);
        }

      
      })
      .catch((err) => {
        console.log(err, "err");
        setConfirmLoading(false);
        setSkeleton(false);
      });
  };

  useEffect(() => {
    setSubject_id(location.state.message);
    getSubject();
  }, []);

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: "2rem" }}
        items={[
          {
            title: (
              <Link to="/nurse/mycourse">
                <BiHome />
              </Link>
            ),
          },
          {
            title: <Link to={`/nurse/mycourse/${subject_id}`}>Назад</Link>,
          },
        ]}
      />
      <Row gutter={16} className="ItemCard">
        <Col span={24}>
          <Card
            title={
              skeleton ? <Skeleton title paragraph={false} /> : subject?.name
            }
          >
            <div
              style={{
                textAlign: "center",
                letterSpacing: "1.5px",
                fontSize: "18px",
                fontWeight: "600",
                marginBottom: "1.5rem",
              }}
            >
              {skeleton ? (
                <Skeleton title={false} paragraph />
              ) : (
                <p>{subject?.teaser}</p>
              )}
            </div>
            {skeleton ? (
              <Skeleton title={false} paragraph />
            ) : (
              <div
                style={{ width: "90%", margin: "0 auto" }}
                dangerouslySetInnerHTML={{ __html: subject?.content }}
              />
            )}
          </Card>
          <div
            style={{ flexWrap: "wrap" }}
            className="d-flex align-center gap-2"
          >
            <Button
              icon={<BsArrowRight />}
              className="d-flex align-center gap-x-1"
              type="primary"
              onClick={getNextSubject}
            >
              Yakunlash va Davom etish
            </Button>
          </div>
        </Col>
      </Row>
      <ToastContainer />
    </>
  );
};
export default MySubjectItemPage;
