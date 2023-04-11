import { Breadcrumb, Button, Card, Col, Modal, Row, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import "./style.scss";
import { BiHome } from "react-icons/bi";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { api } from "../../../../utils/api";
import { Notification } from "../../../Notification/Notification";
import { BsPlus } from "react-icons/bs";
import { ToastContainer } from "react-toastify";

const SubjectItemPage = () => {
  const param = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [addCours, setAddCours] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [addCourseText, setAddCourseText] = useState();
  const [subject, setSubject] = useState();
  const [skeleton, setSkeleton] = useState(false);

  // getSubject
  const getSubject = async () => {
    setSkeleton(true);
    try {
      const res = await api.get(`api/nurse/course/subject/${param.id}`);
      setSubject({
        id: res.data.id,
        name: res.data.name,
        teaser: res.data.teaser,
        content: res.data.content,
      });
      setSkeleton(false);
    } catch (err) {
      console.log(err, "err");
      setSkeleton(false);
    } finally {
      setSkeleton(false);
    }
  };

  // modal
  // handleCancelModal
  const handleCancelModal = () => {
    navigate("/");
  };

  // addCourseList
  const addCourseList = () => {
    setTimeout(() => {
      setAddCours(true);
    }, 10000);
  };

  // addCourseListText
  const addCourseListText = () => {
    setAddCourseText(
      `Kursni o'qishda davom etish uchun ushbu kursni "Ha" tugmasi orqali mening kurslarim ro'yxatiga qo'shing.`
    );
  };

  // setAddCoursList
  const setAddCoursList = (type) => {
    setConfirmLoading(true);
    api
      .post(`api/nurse/course/add`, {
        course_id: location.state.message,
        next: type,
      })
      .then((res) => {
        if (res.data.success) {
          Notification("Kurs qo'shildi");
          setTimeout(() => {
            navigate("/nurse/mycourse");
          }, 1500);
        }
      })
      .catch((err) => {
        console.log(err, "err");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      })
      .finally(() => {
        setConfirmLoading(false);
        setAddCours(false);
      });
  };

  useEffect(() => {
    getSubject();
    addCourseList(param.id);
    addCourseListText(subject);
  }, []);

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
            title: (
              <Link to={`/nurse/course/${location.state.message}`}>
                Предмет
              </Link>
            ),
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
              icon={<BsPlus style={{ fontSize: "22px" }} />}
              className="d-flex align-center gap-x-1"
              type="primary"
              onClick={() => setAddCoursList(false)}
            >
              Kursni qo`shish
            </Button>
          </div>
        </Col>
      </Row>
      <Modal
        title="Kursni qo'shish"
        open={addCours}
        onOk={() => setAddCoursList(false)}
        confirmLoading={confirmLoading}
        onCancel={handleCancelModal}
        okText="Ha"
        cancelText="Yo'q"
        closable={false}
        maskClosable={false}
      >
        {addCourseText}
      </Modal>

      <ToastContainer />
    </>
  );
};
export default SubjectItemPage;
