import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Modal,
  Rate,
  Row,
  Skeleton,
  Spin,
} from "antd";
import React, { useEffect, useState } from "react";
import "./style.scss";
import { BiHome } from "react-icons/bi";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { api } from "../../../../utils/api";
import { Notification } from "../../../Notification/Notification";
import { BsPlus } from "react-icons/bs";
import { ToastContainer } from "react-toastify";
import CommentCard from "../../../generics/CommentCard";
import { AiFillEye } from "react-icons/ai";

const SubjectItemPage = () => {
  const param = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [addCours, setAddCours] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [addCourseText, setAddCourseText] = useState();
  const [subject, setSubject] = useState();
  const [skeleton, setSkeleton] = useState(false);
  const [comment, setComment] = useState();
  const [paginateComment, setPaginateComment] = useState(12);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [commentEmptyText, setCommentEmptyText] = useState(false);
  const controller = new AbortController();
  // getSubject
  const getSubject = async () => {
    setSkeleton(true);
    try {
      const res = await api.get(`api/nurse/course/subject/${param.id}`, {
        signal: controller.signal,
      });
      setSubject({
        id: res.data.id,
        name: res.data.name,
        teaser: res.data.teaser,
        content: res.data.content,
        average_rate: res.data.average_rate,
        type: res.data.type,
      });
      getComments(param.id, paginateComment);
      setSkeleton(false);
    } catch (err) {
      console.log(err, "err");
      setSkeleton(false);
    } finally {
      setSkeleton(false);
    }
  };

  // getComments
  const getComments = (id, newPerPage) => {
    const body = {
      per_page: newPerPage,
      course_subjects_id: param.id ?? id,
    };
    api
      .post("api/receive-comment", body)
      .then((res) => {
        if (res.data.data.length > 0) {
          setComment(res.data.data);
        } else {
          setCommentEmptyText("Ushbu mavzu bo'yicha izohlar mavjud emas...");
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
      })
      .finally(() => {
        setConfirmLoading(false);
        setAddCours(false);
      });
  };

  useEffect(() => {
    getSubject();
    addCourseList();
    addCourseListText(subject);

    return () => {
      controller.abort();
    };
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
              <Link to={`/nurse/course/${location.state.message}`}>Mavzu</Link>
            ),
          },
        ]}
      />

      <Row gutter={16} className="ItemCard">
        <Col span={24}>
          <Card
            title={
              skeleton ? (
                <Skeleton title paragraph={false} />
              ) : (
                <div className="d-flex align-center justify-between">
                  {subject?.name}
                  <Rate disabled value={subject?.average_rate} />
                </div>
              )
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
              (subject?.type === "pdf" && (
                <>
                  <div
                    style={{
                      margin: "1rem 0",
                    }}
                    className="d-flex align-center"
                  >
                    <Button
                      className="d-flex align-center gap-1"
                      style={{ margin: "0 auto" }}
                    >
                      <AiFillEye style={{ fontSize: "18px" }} />
                      <a
                        href={`https://api.edu.imedic.uz${subject?.content}`}
                        target="_blank"
                      >
                        PDF -ni ko'rish
                      </a>
                    </Button>
                  </div>
                  <object
                    data={`https://api.edu.imedic.uz${subject?.content}`}
                    width="100%"
                    type="application/pdf"
                    style={{ height: "100vh" }}
                  />
                </>
              )) ||
              (subject?.type === "video" && (
                <video controls width={"100%"}>
                  <source
                    src={`https://api.edu.imedic.uz${subject?.content}`}
                    type="video/mp4"
                  />
                </video>
              )) || (
                <div
                  className="content"
                  style={{ width: "90%", margin: "0 auto" }}
                  dangerouslySetInnerHTML={{ __html: subject?.content }}
                />
              )
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
      <Card title="Izohlar" className="izohCard">
        {skeleton && <Spin />}
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
export default SubjectItemPage;
