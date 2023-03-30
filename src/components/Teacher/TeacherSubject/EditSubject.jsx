import { Breadcrumb, Button, Card, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { api } from "../../../utils/api";
import "react-quill/dist/quill.snow.css";
import { Notification } from "../../Notification/Notification";
import "./styles/edtSubjectStyle.scss";
import { BiHome } from "react-icons/bi";

const EditSubject = () => {
  const params = useParams();
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  //   getSubject
  const getSubject = (id) => {
    setLoading(true);
    api
      .get(`api/teacher/course-subject/show/${id}`)
      .then((res) => {
        setLoading(false);
        location.state.subject_type !== "test"
          ? form.setFieldsValue({
              name: res.data.data.name,
              content: res.data.data.content,
              teaser: res.data.data.teaser,
            })
          : form.setFieldsValue({
              name: res.data.data.name,
              count_test: String(res.data.data.count_test),
              time: res.data.data.time,
              right_test: String(res.data.data.right_test),
              resubmit: res.data.data.resubmit,
              teaser: res.data.data.teaser,
            });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  //   editSubject
  const onFinish = (values) => {
    setLoading(true);
    values.subject_type = "topic";
    api
      .post(`api/teacher/course-subject/update/${params.id}`, values)
      .then((res) => {
        if (res.data.success === 1) {
          Notification();
          setTimeout(() => {
            setLoading(false);
            navigate(`/teacher/course/${location.state.message}/view`);
          }, 1000);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  // updateTest
  const updateTest = (values) => {
    console.log(values, "test-Values");
  };

  useEffect(() => {
    getSubject(params.id);
  }, []);

  return (
    <div className="editSubject__teacher">
      <Breadcrumb
        style={{ marginBottom: "1rem" }}
        items={[
          {
            title: (
              <Link to={`/teacher/course`}>
                <BiHome />
              </Link>
            ),
          },
          {
            title: (
              <Link to={`/teacher/course/${location.state.message}/view`}>
                Назад
              </Link>
            ),
          },
          {
            title: (
              <p style={{ color: "grey" }}>
                {location.pathname.slice(1).replaceAll("/", "-")}
              </p>
            ),
          },
        ]}
      />
      <Card title="Редактирование">
        {location.state.subject_type !== "test" ? (
          <Form id="sujectForm" name="basic" form={form} onFinish={onFinish}>
            <Form.Item name="name">
              <Input disabled={loading} />
            </Form.Item>

            <Form.Item name="content">
              <ReactQuill theme="snow" disabled={loading} />
            </Form.Item>
            <Form.Item name="teaser">
              <Input disabled={loading} />
            </Form.Item>
            <Form.Item>
              <Button loading={loading} type="primary" htmlType="submit">
                Редактировать
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form
            form={form}
            id="testForm"
            name="create-topic"
            layout="vertical"
            onFinish={updateTest}
          >
            <>
              <Form.Item
                name="name"
                rules={[{ required: true, whitespace: true }]}
              >
                <Input placeholder="Test name" disabled={loading} />
              </Form.Item>
              <Form.Item
                name="count_test"
                rules={[{ required: true, whitespace: true }]}
              >
                <Input placeholder="Test count" disabled={loading} />
              </Form.Item>
              <Form.Item
                name="time"
                rules={[{ required: true, whitespace: true }]}
              >
                <Input placeholder="Test Vaqti (Munit)" disabled={loading} />
              </Form.Item>
              <Form.Item
                name="right_test"
                rules={[{ required: true, whitespace: true }]}
              >
                <Input placeholder="O`tish soni " disabled={loading} />
              </Form.Item>
              <Form.Item
                name="resubmit"
                rules={[{ required: true, whitespace: true }]}
              >
                <Input
                  placeholder="Qayta topshirish vaqti"
                  disabled={loading}
                />
              </Form.Item>
              <Form.Item
                name="teaser"
                rules={[{ required: true, whitespace: true }]}
              >
                <Input placeholder="тизер" disabled={loading} />
              </Form.Item>
            </>

            <Form.Item>
              <Button
                form={
                  location.state.subject_type === "test"
                    ? "testForm"
                    : "sujectForm"
                }
                loading={loading}
                type="primary"
                htmlType="submit"
              >
                Создавать
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};
export default EditSubject;
