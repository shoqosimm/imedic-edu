import { Breadcrumb, Button, Card, Form, Input, Rate, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./style.scss";
import MyCardItem from "../../../generics/MyCard";
import { api } from "../../../../utils/api";
import { BiHome } from "react-icons/bi";
import { TbMoodEmpty } from "react-icons/tb";
import { toast } from "react-toastify";
import CommentCard from "../../../generics/CommentCard";

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

  // getCourseList
  const getCourseList = () => {
    setLoading(true);
    api
      .get(`api/nurse/subject/mycourse/${params.id}`)
      .then((res) => {
        if (res.data.length <= 0) {
          setEmptyText("Bu kurs bo'yicha mavzular mavjud emas!");
        }
        setCourses(
          res.data.map((item) => {
            return {
              key: item.id,
              ...item,
            };
          })
        );
        getComments(res.data[0].course_id, paginateComment);
        getRate(res.data[0].course_id);
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
    setLoadingComment(true);
    const body = {
      course_id: String(courses[0].course_id),
      comment: values.comment,
    };
    try {
      const response = await api.post("api/nurse/notion/comment", body);
      response && toast.success("Sizning izohingiz qa'bul qilindi");
      setLoadingComment(false);
      form.resetFields();
      getComments(courses[0].course_id, paginateComment);
    } catch (err) {
      console.log(err, "err");
      setLoadingComment(false);
    }
  };

  // handleRate
  const handleRate = async (e) => {
    const body = {
      rate: String(e),
      course_id: String(courses[0].course_id),
    };
    try {
      const response = await api.post(`api/nurse/notion/rate`, body);
      response && toast.success("Sizning bahoyingiz qa'bul qilindi");
      getRate(courses[0].course_id);
    } catch (err) {
      console.log(err, "err");
    }
  };

  useEffect(() => {
    getCourseList();
  }, []);

  return (
    <div className="mycourse__wrapper">
      <Breadcrumb
        style={{ marginBottom: "0.5rem" }}
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
      <div>
        <Card title="Kursga oid mavzular">
          <div
            style={{
              flexWrap: "wrap",
              justifyContent: "center",
              padding: "1.5rem 0",
            }}
            className="d-flex align-center gap-3"
          >
            {loading && <Spin />}
            {emptyText ? (
              <div
                className="d-flex align-center "
                style={{ flexDirection: "column" }}
              >
                <TbMoodEmpty style={{ fontSize: "54px", fill: "yellow" }} />
                <p style={{ fontSize: "24px", textAlign: "center" }}>
                  {emptyText}
                </p>
              </div>
            ) : (
              courses?.map((item) => {
                return (
                  <MyCardItem
                    disabled={item.status === 0 ? true : false}
                    key={item.id}
                    item={item}
                  />
                );
              })
            )}
          </div>
        </Card>
        <div className="wrapperComment">
          <Form
            onFinish={handleComment}
            id="form"
            layout="vertical"
            form={form}
          >
            <Form.Item label="Kursni baholang">
              <Rate
                onChange={handleRate}
                value={initialRate.rate}
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
              {loading && <Spin />}
              {comment?.map((item) => {
                return <CommentCard key={item.id} data={item} />;
              })}
              <Button
                disabled={emptyText ? true : false}
                onClick={handleMoreComment}
                loading={loadingBtn}
              >
                Ko'proq ko'rsatish
              </Button>
            </Card>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default NurseMyCourse;
