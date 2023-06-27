import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Modal,
  Row,
  Skeleton,
  Spin,
  Tabs,
} from "antd";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./style.scss";
import { BiHome } from "react-icons/bi";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { api } from "../../../../utils/api";
import { Notification } from "../../../Notification/Notification";
import { BsPeopleFill, BsPlus } from "react-icons/bs";
import { ToastContainer } from "react-toastify";
import CommentCard from "../../../generics/CommentCard";
import { AiFillEye } from "react-icons/ai";
import { MdStarRate } from "react-icons/md";
import EmptyBox from "../../../../assets/illustration/emptyBox.webp";

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
  const [myCourse, setMyCourse] = useState(false);
  const [pdfUrl, setPdfUrl] = useState();
  const [videoUrl, setVideoUrl] = useState();

  // getSubject
  const getSubject = async () => {
    setSkeleton(true);
    try {
      const res = await api.get(`api/nurse/course/subject/${param.id}`, {
        signal: controller.signal,
      });
      if (res.data.type === "media") {
        res.data?.media
          ?.filter((value) => value.type === "pdf")
          .map((item) => {
            setPdfUrl({ url: `https://api.edu.imedic.uz${item.file_url}` });
          });
        res.data?.media
          ?.filter((value) => value.type === "video")
          .map((item) => {
            setVideoUrl({
              url: `https://api.edu.imedic.uz${item.file_url}`,
            });
          });
      }
      setSubject({
        id: res.data.id,
        name: res.data.name,
        teaser: res.data.teaser,
        content: res.data.content,
        average_rate: res.data.average_rate,
        rate_count: res.data.rate_count,
        type: res.data.type,
      });
      getComments(param.id, paginateComment);
      setMyCourse(res.data.my_course);
      if (!res.data.my_course) {
        setTimeout(() => {
          setAddCours(true);
        }, 10000);
        setAddCourseText(
          `Kursni o'qishda davom etish uchun ushbu kursni "Ha" tugmasi orqali mening kurslarim ro'yxatiga qo'shing.`
        );
      }
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
    navigate(-1);
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
          <div className="card__badge">
            <div className="badge__content">
              <h1>{subject?.name}</h1>
              <ul className="badge__reyting d-flex align-center gap-x-3">
                <li className="d-flex align-center gap-x-1">
                  <MdStarRate className="icon" />
                  <p>{subject?.average_rate} O'rtacha baho</p>
                </li>
                <li className="d-flex align-center gap-x-1">
                  <BsPeopleFill className="icon" />
                  <p>{subject?.rate_count} Baholaganlar soni</p>
                </li>
              </ul>
            </div>
          </div>
          <Tabs
            items={[
              {
                key: "1",
                label: "Mavzu",
                children: (
                  <>
                    <div className="teaser"
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
                        <>
                          <p>{subject?.teaser}</p>
                          <Divider />
                        </>
                      )}
                    </div>
                    {skeleton && <Skeleton title={false} paragraph />}
                    {pdfUrl && (
                      <>
                        <Button
                          className="pdfViewBtn d-flex align-center gap-1"
                          style={{
                            margin: "1rem auto",
                            height: "40px",
                            borderRadius: "4px",
                          }}
                        >
                          <AiFillEye style={{ fontSize: "18px" }} />
                          <a href={`${pdfUrl?.url}`} target="_blank">
                            PDF -ni ko'rish
                          </a>
                        </Button>
                        <object
                          data={pdfUrl?.url}
                          width="100%"
                          type="application/pdf"
                          style={{
                            height: "100%",
                            aspectRatio: "1",
                            marginBottom: "1rem",
                          }}
                        ></object>
                      </>
                    )}
                    {pdfUrl || videoUrl ? null : (
                      <div
                        className="teacher__subject__content"
                        dangerouslySetInnerHTML={{ __html: subject?.content }}
                      />
                    )}
                  </>
                ),
              },
              {
                key: "2",
                label: "Video",
                children: videoUrl ? (
                  <video controls width="100%">
                    <source src={videoUrl?.url} type="video/mp4" />
                  </video>
                ) : (
                  <div className="emptyBox">
                    <img src={EmptyBox} alt="imgEmpty" />
                    <h1>Ushbu mavzuda video fayl mavjud emas!</h1>
                  </div>
                ),
              },
              {
                key: "4",
                label: "Izohlar",
                children: (
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
                      return (
                        <motion.div
                        key={item.id}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ type: "just", duration: 1.7 }}
                        >
                          <CommentCard  data={item} />
                        </motion.div>
                      )
                    })}
                    <Button
                      disabled={commentEmptyText ? true : false}
                      onClick={handleMoreComment}
                      loading={loadingBtn}
                    >
                      Ko'proq ko'rsatish
                    </Button>
                  </Card>
                ),
              },
            ]}
          />

          <div
            style={{ flexWrap: "wrap" }}
            className="d-flex align-center gap-2"
          >
            {!myCourse && (
              <Button
                icon={<BsPlus style={{ fontSize: "22px" }} />}
                className="card__btn d-flex align-center gap-x-1"
                type="primary"
                onClick={() => setAddCoursList(false)}
              >
                {'Kursni qo`shish'}
              </Button>
            )}
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
