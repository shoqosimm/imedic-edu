import {
  Breadcrumb,
  Button,
  Card,
  Form,
  Input,
  Select,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { api } from "../../../../utils/api";
import { BiHome } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "./style.scss";

const CreateTest = () => {
  const [number, setNumber] = useState(3);
  const location = useLocation();
  const param = useParams();
  const [loading, setLoading] = useState(false);
  const [subjectItems, setSubjectItems] = useState();
  const [answer, setAnswer] = useState([
    {
      id: 0,
      text: "правильный ответ",
    },
    {
      id: 1,
      text: `неправильный ответ`,
    },
    {
      id: 2,
      text: `неправильный ответ`,
    },
  ]);
  const [form] = Form.useForm();

  //   onFinish
  const onFinish = (values) => {
    setLoading(true);
    const answers = document.querySelectorAll(".answers");
    const arrayAns = Array.from(answers).map((item) => item.value);
    const body = {
      ...values,
      course_subject_id: parseInt(param.id),
      answer: arrayAns,
    };
    api
      .post(`api/teacher/test/add`, body)
      .then((res) => {
        if (res) {
          toast.success("Создано");
          setLoading(false);
          form.resetFields();
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        form.resetFields();
      });
  };

  // addForm
  const AddForm = (id) => {
    setNumber(number + 1);
    setAnswer([
      ...answer,
      {
        id: parseInt(number),
        text: `неправильный ответ`,
      },
    ]);
  };

  // getSubjectForSelect
  const getSubjectForSelect = () => {
    const body = {
      course_subject_id: parseInt(param.id),
    };
    api.post("api/select/subject", body).then((res) =>
      setSubjectItems(
        res.data.map((item) => {
          return {
            key: item.id,
            value: item.id,
            label: item.name,
          };
        })
      )
    );
  };

  //   deleteOption
  const DeleteField = (id) => {
    setNumber(number - 1);
    setAnswer(answer.filter((item) => item.id !== id));
  };

  useEffect(() => {
    getSubjectForSelect();
  }, []);

  return (
    <>
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
      <Card title="Добавить тест">
        <Card>
          <Form
            form={form}
            name="createTest"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="question"
              label="Вопрос"
              rules={[{ required: true }]}
            >
              <Input placeholder="Вопрос теста" />
            </Form.Item>
            <Form.Item
              name="from_subject_id"
              label="Тип предмета"
              rules={[{ required: true }]}
            >
              <Select
                className="select"
                placeholder="Тип предмета"
                options={subjectItems}
              />
            </Form.Item>
            {answer.map((item, index) => {
              return (
                <div key={index}>
                  <Form.Item label={item.text} style={{ marginBottom: "10px" }}>
                    <Input
                      required
                      placeholder={item.text}
                      className="answers"
                      disabled={loading}
                    />
                  </Form.Item>
                  {index > 1 ? (
                    <Button
                      style={{ marginBottom: "2rem" }}
                      disabled={loading}
                      onClick={() => DeleteField(item.id)}
                    >
                      Удалить
                    </Button>
                  ) : null}
                </div>
              );
            })}
            <div>
              <Form.Item>
                <Button
                  disabled={loading}
                  type="primary"
                  onClick={() => AddForm(answer)}
                >
                  Добавить ответ
                </Button>
              </Form.Item>
              <Form.Item>
                <Button loading={loading} type="primary" htmlType="submit">
                  Добавить тест
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Card>
        <ToastContainer />
      </Card>
    </>
  );
};
export default CreateTest;
