import { Breadcrumb, Button, Card, Form, Input, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../../../../utils/api";
import { BiHome } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "./style.scss";
import { t } from "i18next";

const EditTest = () => {
  const [number, setNumber] = useState(3);
  const location = useLocation();
  const navigate = useNavigate();
  const param = useParams();
  const [loading, setLoading] = useState(false);
  const [subjectItems, setSubjectItems] = useState();
  const [answer, setAnswer] = useState([
    {
      id: 0,
      text: t('correctAnswer'),
    },
    {
      id: 1,
      text:t('wrongAnswer'),
    },
    {
      id: 2,
      text:t('wrongAnswer'),
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
          toast.success(t('wasCreated'));
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
        answer: res.data.data.answer,
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
        text: t('wrongAnswer'),
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
      course_subject_id: parseInt(location.state.message),
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
              <div style={{ cursor: "pointer" }} onClick={() => navigate(-1)}>
                {t('back')}
              </div>
            ),
          },
          {
            title: <p style={{ color: "grey" }}>{t('editTest')}</p>,
          },
        ]}
      />
      <Card title={t('editTest')}>
        <Card>
          <Form
            form={form}
            name="createTest"
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="question"
              label={t('question')}
              rules={[{ required: true }]}
            >
              <Input placeholder="test savoli" />
            </Form.Item>
            <Form.Item
              name="from_subject_id"
              label={t('cours')}
              rules={[{ required: true }]}
            >
              <Select
                className="select"
                placeholder={t('byCoursTest')}
                options={subjectItems}
              />
            </Form.Item>
            <p style={{ marginBottom: "1rem", fontSize: "18px" }}>
             {t('alwaysRight')}
            </p>
            {answer.map((item, index) => {
              return (
                <div key={index}>
                  <Form.Item
                    name={["answer", index]}
                    label={`${index + 1}-variant`}
                    style={{ marginBottom: "10px" }}
                  >
                    <Input required className="answers" disabled={loading} />
                  </Form.Item>
                  {index > 1 ? (
                    <Button
                      style={{
                        marginBottom: "2rem",
                        background: "orangered",
                        color: "#fff",
                      }}
                      disabled={loading}
                      onClick={() => DeleteField(item.id)}
                    >
                     {t('delete')}
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
                  {t('addOption')}
                </Button>
              </Form.Item>
              <Form.Item>
                <Button loading={loading} type="primary" htmlType="submit">
                  {t('save')}
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
