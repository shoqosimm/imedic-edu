import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Input,
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
import { BsArrowRight } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import CommentCard from "../../../generics/CommentCard";
import { AiFillEye } from "react-icons/ai";

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
  const [paginateComment, setPaginateComment] = useState(12);
  const [form] = Form.useForm();
  const controller = new AbortController();

  // getSubject
  const getSubject = () => {
    setSkeleton(true);
    api
      .get(`api/nurse/subject/item/${param.id}`, { signal: controller.signal })
      .then((res) => {
        setSkeleton(false);
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
        setComment(res.data.data);
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
      <div
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
      </div>
      <Row gutter={16} className="ItemCard">
        <Col span={24}>
          <Card
            title={
              skeleton ? (
                <Skeleton title paragraph={false} />
              ) : (
                subject?.data?.name
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
                <p>{subject?.data?.teaser}</p>
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
                        href={`https://api.edu.imedic.uz${subject?.data?.content}`}
                        target="_blank"
                      >
                        PDF -ni ko'rish
                      </a>
                    </Button>
                  </div>
                  <object
                    data={`https://api.edu.imedic.uz${subject?.data?.content}`}
                    width="100%"
                    type="application/pdf"
                    style={{ height: "100vh" }}
                  />
                </>
              )) ||
              (subject?.type === "video" && (
                <video controls width={"100%"}>
                  <source
                    src={`https://api.edu.imedic.uz${subject?.data?.content}`}
                    type="video/mp4"
                  />
                </video>
              )) || (
                <div
                  className="content"
                  style={{ width: "90%", margin: "0 auto" }}
                  dangerouslySetInnerHTML={{ __html: subject?.data?.content }}
                />
              )
            )}
          </Card>

          <div
            style={{ flexWrap: "wrap", marginTop: "1rem" }}
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
                  style={{ background: "#5bc7d4", color: "#fff" }}
                  loading={loadingComment}
                  htmlType="submit"
                  form="form"
                >
                  Izohni yuborish
                </Button>
              </div>
              <Card title="Izohlar" className="izohCard">
                {skeleton && <Spin />}
                {comment?.map((item) => {
                  return <CommentCard key={item.id} data={item} />;
                })}
                <Button onClick={handleMoreComment}>Ko'proq ko'rsatish</Button>
              </Card>
            </Form>
          </div>
        </Col>
      </Row>
      <ToastContainer />
    </>
  );
};
export default MySubjectItemPage;
