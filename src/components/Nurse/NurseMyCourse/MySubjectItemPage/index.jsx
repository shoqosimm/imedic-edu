import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Rate,
  Row,
  Skeleton,
  Spin,
  Tabs,
} from "antd";
import React, { useEffect, useState } from "react";
import "./style.scss";
import { BiHome } from "react-icons/bi";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { api } from "../../../../utils/api";
import { Notification } from "../../../Notification/Notification";
import { BsArrowRight, BsPeopleFill } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import CommentCard from "../../../generics/CommentCard";
import { AiFillEye } from "react-icons/ai";
import { MdStarRate } from "react-icons/md";
import EmptyBox from "../../../../assets/illustration/emptyBox.webp";
import { motion } from "framer-motion";

const MySubjectItemPage = () => {
  const param = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [subject_id, setSubject_id] = useState();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [skeleton, setSkeleton] = useState(false);
  const [subject, setSubject] = useState();
  const [comment, setComment] = useState();
  const [commentEmptyText, setCommentEmptyText] = useState(false);
  const [paginateComment, setPaginateComment] = useState(12);
  const [form] = Form.useForm();
  const [pdfUrl, setPdfUrl] = useState();
  const [videoUrl, setVideoUrl] = useState();
  const controller = new AbortController();

  // getSubject
  const getSubject = () => {
    setSkeleton(true);
    api
      .get(`api/nurse/subject/item/${param.id}`, { signal: controller.signal })
      .then((res) => {
        setSkeleton(false);
        if (res.data.content.type === "media") {
          res.data.content?.media
            ?.filter((value) => value.type === "pdf")
            .map((item) => {
              setPdfUrl({ url: `https://api.edu.imedic.uz${item.file_url}` });
            });
          res.data.content?.media
            ?.filter((value) => value.type === "video")
            .map((item) => {
              setVideoUrl({
                url: `https://api.edu.imedic.uz${item.file_url}`,
              });
            });
        }
        setSubject({
          data: res.data.content,
          subject_id: res.data.course_subject_id,
          type: res.data.content.type,
        });
        getComments(res.data.course_subject_id, paginateComment);
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
          if (res.data?.subject_type === "test") {
            if (res.data?.status == 2) {
              return navigate(`/nurse/answers`, {
                state: { message: res.data.id },
              });
            }
            return navigate(
              `/nurse/mycourse/${subject_id}/subject/test/${res.data.id}`,
              { state: { message: subject_id } }
            );
          } else {
            navigate(`/nurse/mycourse/${subject_id}/subject/${res.data.id}`, {
              state: { message: subject_id },
            });
            getComments(res.data.course_subject_id, paginateComment);
            Notification();
          }
          setConfirmLoading(false);
          setSkeleton(false);
          if (res.data.content.type === "media") {
            res.data.content?.media
              ?.filter((value) => value.type === "pdf")
              .map((item) => {
                setPdfUrl({ url: `https://api.edu.imedic.uz${item.file_url}` });
              });
            res.data.content?.media
              ?.filter((value) => value.type === "video")
              .map((item) => {
                setVideoUrl({
                  url: `https://api.edu.imedic.uz${item.file_url}`,
                });
              });
          }
          setSubject({
            data: res.data.content,
            subject_id: res.data.course_subject_id,
            type: res.data.content.type,
          });
        }
      })
      .catch((err) => {
        console.log(err, "err");
        setConfirmLoading(false);
        setSkeleton(false);
      });
  };

  // getComments
  const getComments = (id, per_page) => {
    const body = {
      per_page: per_page,
      course_subjects_id: subject?.course_subject_id ?? id,
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
    getComments(subject?.subject_id, newPerPage);
    setLoadingBtn(false);
  };

  // handleComment
  const handleComment = async (values) => {
    setLoadingComment(true);
    const body = {
      course_subjects_id: String(subject.subject_id),
      comment: values.comment,
    };
    try {
      const response = await api.post("api/nurse/notion/comment", body);
      response && toast.success("Sizning izohingiz qa'bul qilindi");
      setLoadingComment(false);
      form.resetFields();
      getComments(subject?.subject_id, paginateComment);
    } catch (err) {
      console.log(err, "err");
      setLoadingComment(false);
    }
  };

  // handleRate
  const handleRate = async (e) => {
    const body = {
      rate: String(e),
      course_subjects_id: String(subject.id),
    };
    try {
      const response = await api.post(`api/nurse/notion/rate`, body);
      response && toast.success("Sizning bahoyingiz qa'bul qilindi");
    } catch (err) {
      console.log(err, "err");
    }
  };

  useEffect(() => {
    setSubject_id(location.state.message);
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
              <Link to="/nurse/mycourse">
                <BiHome />
              </Link>
            ),
          },
          {
            title: <Link to={`/nurse/mycourse/${subject_id}`}>Ortga</Link>,
          },
        ]}
      />
      {/* <div
        style={{
          width: "100%",
          height: "auto",
          background: "#c55ab5",
          padding: "1rem ",
          color: "#fff",
          borderRadius: "6px",
          fontSize: "18px",
        }}
      >
        <div className="d-flex align-center gap-1">
          <p>O'rtacha ball:</p>{" "}
          <Rate
            disabled
            allowClear={false}
            value={subject?.data?.average_rate}
          />
        </div>
        <div className="d-flex align-center gap-1">
          <p>Ovoz berganlar soni:</p> <p>{subject?.data?.rate_count}ta</p>
        </div>
      </div> */}

      <Row gutter={16} className="ItemCard">
        <Col span={24}>
          <div className="card__badge">
            <div className="badge__content">
              <h1>{subject?.data.name}</h1>
              <ul className="badge__reyting d-flex align-center gap-x-3">
                <li className="d-flex align-center gap-x-1">
                  <MdStarRate className="icon" />
                  <p>{subject?.data.average_rate} O'rtacha baho</p>
                </li>
                <li className="d-flex align-center gap-x-1">
                  <BsPeopleFill className="icon" />
                  <p>{subject?.data.rate_count} Baholaganlar soni</p>
                </li>
              </ul>
            </div>
          </div>
          {/* <div className="card">
            {skeleton ? (
              <Skeleton title paragraph={false} />
            ) : (
              <TitleText style={{ margin: "0" }} title={subject?.data?.name} />
            )}
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
                <>
                  <p>{subject?.data?.teaser}</p>
                  <Divider />
                </>
              )}
            </div>
            {skeleton && <Skeleton title={false} paragraph />}
            {pdfUrl && (
              <>
                <Button
                  className="d-flex align-center gap-1"
                  style={{ margin: "1rem auto" }}
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
            {videoUrl && (
              <video controls width="100%">
                <source src={videoUrl?.url} type="video/mp4" />
              </video>
            )}
            {pdfUrl && videoUrl ? null : (
              <div
                className="teacher__subject__content"
                dangerouslySetInnerHTML={{ __html: subject?.data.content }}
              />
            )}
          </div> */}
          <Tabs
            items={[
              {
                key: "1",
                label: "Mavzu",
                children: (
                  <>
                    <div
                      className="teaser"
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
                          <p>{subject?.data.teaser}</p>
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
                        className="w-100 teacher__subject__content"
                        dangerouslySetInnerHTML={{
                          __html: subject?.data.content,
                        }}
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
                  <div className="wrapperComment">
                    <Form
                      onFinish={handleComment}
                      id="form"
                      layout="vertical"
                      form={form}
                    >
                      <Form.Item label="Sizning ovozingiz">
                        <Rate
                          onChange={handleRate}
                          value={subject?.data?.user_rate?.rate}
                          allowClear={false}
                        />
                      </Form.Item>

                      <div>
                        <Form.Item
                          name="comment"
                          label="Izoh"
                          rules={[{ required: true }]}
                        >
                          <Input.TextArea
                            autoSize={{ minRows: 5 }}
                            placeholder="Izoh"
                            disabled={loadingComment}
                          />
                        </Form.Item>
                        <Button
                          style={{ marginBottom: "2rem" }}
                          loading={loadingComment}
                          htmlType="submit"
                          form="form"
                        >
                          Izohni yuborish
                        </Button>
                      </div>
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
                              <CommentCard data={item} />
                            </motion.div>
                          );
                        })}
                        <Button
                          disabled={commentEmptyText ? true : false}
                          onClick={handleMoreComment}
                          loading={loadingBtn}
                        >
                          Ko'proq ko'rsatish
                        </Button>
                      </Card>
                    </Form>
                  </div>
                ),
              },
            ]}
          />

          <div
            style={{ flexWrap: "wrap", marginTop: "1rem" }}
            className="d-flex align-center gap-2"
          >
            <Button
              loading={confirmLoading}
              icon={<BsArrowRight />}
              className="finish__btn d-flex align-center gap-x-1"
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
