import { Card, Form, Input, Select, Button, Breadcrumb } from "antd";
import React, { useState, useEffect } from "react";
import { api } from "../../../utils/api";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import "./styles/editStyle.scss";
import { BiHome } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";

const EditCourse = () => {
  const [category, setCategory] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const onFinish = (values) => {
    setSaveLoading(true);

    let body = {
      name: values.title,
      category_id: values.category,
    };
    api
      .post(`api/teacher/course/update/${params.id}`, body)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.success) {
            toast.success("Изменено");
            setTimeout(() => {
              navigate("/teacher/course");
            }, 1500);
          }
        }
      })
      .catch((err) => {
        console.log(err);
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

  //  getItemCourse
  const getItemCourse = (id) => {
    setLoading(true);
    api
      .get(`api/teacher/course/show/${id}`)
      .then((res) => {
        form.setFieldsValue({
          title: res.data.name,
          category: res.data.category_id,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getCategory();
    getItemCourse(params.id);
  }, []);

  return (
    <div className="editTeacherCourse">
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

      <h1>Редактирование курса</h1>
      <Card>
        <Form form={form} name="edit-course" onFinish={onFinish}>
          <Form.Item name="title">
            <Input
              className="editInput"
              disabled={loading}
              placeholder="Название курса"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите название вашего курса!",
                },
              ]}
            />
          </Form.Item>
          <Form.Item name="category">
            <Select
              className="editInput"
              disabled={loading}
              options={category}
              placeholder="Выберите категорию"
              style={{ width: "100%" }}
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, выберите категорию вашего курса!",
                },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Button
              className="editBtn"
              type="primary"
              htmlType="submit"
              loading={saveLoading}
            >
              Редактировать
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <ToastContainer/>
    </div>
  );
};
export default EditCourse;
