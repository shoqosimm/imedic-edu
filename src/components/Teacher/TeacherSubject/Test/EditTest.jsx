import { Breadcrumb, Button, Card, Form, Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { api } from "../../../../utils/api";
import { BiHome } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "./style.scss";

const EditTest = () => {
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
      course_subject_id: parseInt(location.state.message),
      answer: arrayAns,
    };
    api
      .post(`api/teacher/test/update/${param.id}`, body)
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

  // getTest
  const getTest = async () => {
    setLoading(true);
    try {
      const res = await api.get(`api/teacher/test/show/${param.id}`);
      const answers = document.querySelectorAll(".answers");
      const arrayAns = Array.from(answers);
      res.data.data.answer.map((item, index) => {
        return (arrayAns[index] = item[index]);
      });

      form.setFieldsValue({
        question: String(res.data.data.question),
        from_subject_id: res.data.data.from_subject_id,
        answer:res.data.data.answer
      });
      setAnswer(
        res.data.data.answer.map((item, index) => {
          return {
            id: index,
            text: item,
          };
        })
      );

      setLoading(false);
    } catch (err) {
      console.log(err, "err");
      setLoading(false);
    }
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

  //   deleteOption
  const DeleteField = (id) => {
    setNumber(number - 1);
    setAnswer(answer.filter((item) => item.id !== id));
  };

  // getSubjectForSelect
  const getSubjectForSelect = () => {
    const body = {
      course_subject_id: parseInt(param.id),
    };
    api.post("api/select/subject", body).then((res) => {
      setSubjectItems(
        res.data.map((item) => {
          return {
            key: item.id,
            value: item.id,
            label: item.name,
          };
        })
      );
    });
  };

  useEffect(() => {
    getSubjectForSelect();
    getTest();
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
            <p style={{marginBottom:'1rem',fontSize:'18px'}}>1-й вариант всегда надо указать правильный ответ</p>

            {answer.map((item, index) => {
              return (
                <div key={index}>
                  <Form.Item
                    name={["answer", index]}
                    label={`${index + 1}-вариант`}
                    style={{ marginBottom: "10px" }}
                  >
                    <Input
                      required
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
export default EditTest;
