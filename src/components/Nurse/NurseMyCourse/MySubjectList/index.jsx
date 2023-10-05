import { Breadcrumb, Button, Card, Form, Input, Rate, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./style.scss";
import { api } from "../../../../utils/api";
import { BiHome } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import CommentCard from "../../../generics/CommentCard";
import EmptyBox from "../../../../assets/illustration/emptyBox.webp";
import { motion } from "framer-motion";
import MyCardSubjectList from "../../../generics/MyCardSubjectList";
import { t } from "i18next";

const NurseMyCourse = () => {
  const params = useParams();
  const [courses, setCourses] = useState([]);
  const [loadingComment, setLoadingComment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [emptyText, setEmptyText] = useState();
  const [paginateComment, setPaginateComment] = useState(12);
  const [comment, setComment] = useState();
  const [initialRate, setInitialRate] = useState(false);
  const [form] = Form.useForm();
  const controller = new AbortController();

  // getCourseList
  const getCourseList = () => {
    setLoading(true);
    api
      .get(`api/nurse/subject/mycourse/${params.id}`, {
        signal: controller.signal,
      })
      .then((res) => {
        if (res.data.length <= 0) {
          setEmptyText(t('notTopic'));
        }
        setCourses(
          res.data.map((item) => {
            return {
              ...item,
              key: item.id,
            };
          })
        );
        if (res.data.length > 0) {
          getComments(res.data[0].course_id, paginateComment);
          getRate(res.data[0].course_id);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err, "err");
        setLoading(false);
      });
  };

  // getRate
  const getRate = async (id) => {
    try {
      const res = await api.get(`api/receive-rate/${id}`);
      setInitialRate(res.data);
    } catch (err) {
      console.log(err, "err");
    }
  };

  // getComments
  const getComments = (id, newPerPage) => {
    const body = {
      per_page: newPerPage,
      course_id: courses[0]?.course_id ?? id,
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
    getComments(courses[0].course_id, newPerPage);
    setLoadingBtn(false);
  };

  // handleComment
  const handleComment = async (values) => {
    if (courses.length > 0) {
      setLoadingComment(true);
      const body = {
        course_id: String(courses[0].course_id),
        comment: values.comment,
      };
      try {
        const response = await api.post("api/nurse/notion/comment", body);
        response &&
          toast.success(t('commentAdd') , {
            position: "bottom-right",
          });
        setLoadingComment(false);
        form.resetFields();
        getComments(courses[0].course_id, paginateComment);
      } catch (err) {
        console.log(err, "err");
        setLoadingComment(false);
      }
    } else {
      toast.warn(t('notComment'), {
        position: "bottom-right",
      });
    }
  };

  // handleRate
  const handleRate = async (e) => {
    if (courses.length > 0) {
      const body = {
        rate: String(e),
        course_id: String(courses[0].course_id),
      };
      try {
        const response = await api.post(`api/nurse/notion/rate`, body);
        response &&
          toast.success(t('price'), {
            position: "bottom-right",
          });
        getRate(courses[0].course_id);
      } catch (err) {
        console.log(err, "err");
      }
    } else {
      toast.warn(t('notPrice'), {
        position: "bottom-right",
      });
    }
  };

  useEffect(() => {
    getCourseList();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="mycourse__wrapper">
      <Breadcrumb
        style={{ marginBottom: "1.5rem" }}
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

      <div className="w-100 d-flex  gap-3 flex-column">
        {loading && <Spin />}
        {emptyText && (
          <div
            className="d-flex flex-column align-center justify-center"
            style={{ background: "#fff", width: "100%", height: "500px" }}
          >
            <img src={EmptyBox} alt="empty" width={"200px"} />
            <em style={{ fontSize: "18px" }}>{emptyText}</em>
          </div>
        )}
        <div className="w-100 d-flex align-center justify-center gap-3 flex-wrap">
          {!loading &&
            courses &&
            courses?.map((item) => {
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "just", duration: 1.4, bounce: 0.1 }}
                >
                  <MyCardSubjectList
                    key={item.id}
                    title={item.subject.name}
                    teaser={item.subject.teaser}
                    disabled={item.status === 0 ? true : false}
                    item={item}
                    subject={item.subject.subject_type}
                  />
                </motion.div>
              );
            })}
        </div>

        <div className="wrapperComment">
          <Form
            onFinish={handleComment}
            id="form"
            layout="vertical"
            form={form}
          >
            <Form.Item label={t('coureseRate')}>
              <Rate
                onChange={handleRate}
                value={initialRate.rate}
                allowClear={false}
              />
            </Form.Item>

            <div>
              <Form.Item
                name="comment"
                label={t('coment')}
                rules={[{ required: true }]}
              >
                <Input.TextArea
                  autoSize={{ minRows: 5 }}
                  placeholder={t('coment')}
                  disabled={loadingComment}
                />
              </Form.Item>
              <Button
                style={{ marginBottom: "2rem" }}
                loading={loadingComment}
                htmlType="submit"
                form="form"
              >
                {t('sentComent')}
              </Button>
            </div>
            <Card title={t('coments')} className="izohCard">
              {loading && <Spin />}
              {comment?.map((item) => {
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "just", duration: 1.4, bounce: 0.1 }}
                  >
                    <CommentCard data={item} />
                  </motion.div>
                );
              })}
              {!loading && (
                <Button
                  disabled={emptyText ? true : false}
                  onClick={handleMoreComment}
                  loading={loadingBtn}
                >
                 {t('leanMore')}
                </Button>
              )}
            </Card>
          </Form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default NurseMyCourse;
