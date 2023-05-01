import { Breadcrumb, Button, Card, Form, Input, Select } from "antd";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../../utils/api";
import "./styles/createCourseStyle.scss";
import { BiHome } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";

const CreateCourse = () => {
  const [category, setCategory] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // create
  const onFinish = (values) => {
    setLoading(true);
    let body = {
      name: values.title,
      category_id: values.category,
    };
    api
      .post("/api/teacher/course/add", body)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.success) {
            toast.success("Yaratildi");
            setTimeout(() => {
              setLoading(false);
              form.resetFields();
              navigate("/teacher/course");
            }, 1500);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  // getCategory
  const getCategory = () => {
    api
      .get("/api/select/category")
      .then((res) => {
        setCategory(
          res.data.map((item) => {
            return {
              key: item.id,
              value: item.id,
              label: item.name,
            };
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <div className="createCourse_teacher">
      <Breadcrumb
        style={{ marginBottom: "0.5rem" }}
        items={[
          {
            title: (
              <Link to="/teacher/course">
                <BiHome />
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
      <h1>Kurs yaratilishi</h1>
      <Card>
        <Form form={form} name="create-course" onFinish={onFinish}>
          <Form.Item name="title">
            <Input
              disabled={loading}
              className="create_input"
              placeholder="Kursning nomi"
              rules={[
                {
                  required: true,
                  message: "Iltimos, kursning nomini kiriting!",
                },
              ]}
            />
          </Form.Item>
          <Form.Item name="category">
            <Select
              disabled={loading}
              className="create_input"
              options={category}
              placeholder="Turkumni tanlang"
              style={{ width: "100%" }}
              rules={[
                {
                  required: true,
                  message: "Iltimos,kursga oid turkum tanlang!",
                },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Button
              loading={loading}
              className="create_btn"
              type="primary"
              htmlType="submit"
            >
              Yaratish
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <ToastContainer />
    </div>
  );
};
export default CreateCourse;
