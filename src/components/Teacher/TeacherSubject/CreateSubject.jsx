import { Breadcrumb, Button, Card, Col, Form, Input, Modal, Row } from "antd";
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { api } from "../../../utils/api";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Notification } from "../../Notification/Notification";
import "./styles/createSubjectStyle.scss";
import { BiHome } from "react-icons/bi";

// quill-modules
const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ header: 1 }, { header: 2 }],
      [{ direction: "rtl" }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ size: [] }],
      [{ align: [] }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
    ],
  },
};
const formats = [
	"header",
	"font",
	"size",
	"bold",
	"italic",
	"underline",
	"align",
	"strike",
	"script",
	"blockquote",
	"background",
	"list",
	"bullet",
	"indent",
	"link",
	"image",
	"color",
	"code-block",
];

const CreateSubject = () => {
  const [openModal, setOpenModal] = useState(true);
  const [type, setType] = useState(false);
  const [contentValue, setContentValue] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const location = useLocation();
  const params = useParams();

  //   create
  const onFinish = (values) => {
    setLoading(true);
    let body = {};
    if (type === 0) {
      body.content = contentValue;
      body.course_id = parseInt(params.id);
      body.subject_type = "topic";
      body.name = values.name;
      body.teaser = values.teaser;
    } else {
      body.course_id = parseInt(params.id);
      body.subject_type = "test";
      body.name = values.name;
      body.count_test = values.count_test;
      body.right_test = values.right_test;
      body.time = values.time;
      body.resubmit = values.resubmit;
      body.teaser = values.teaser;
    }
    api
      .post("/api/teacher/course-subject/add", body)
      .then((res) => {
        if (res.data.success) {
          setTimeout(() => {
            Notification();
            setLoading(false);
            form.resetFields();
            navigate(`/teacher/course/${location.state.message}/view`);
          }, 1000);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const handleModal = () => {
      if (type === false) {
        setOpenModal(true);
      } else {
        setOpenModal(false);
      }
    };
    handleModal();
  }, [type]);

  return (
    <div className="createSubject_teacher">
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
      <Modal title="Coздать" centered closable={false} open={openModal} footer>
        <Row
          style={{ height: "100px" }}
          gutter={[20, 20]}
          title="Create Subject"
        >
          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <Card
              className="d-flex align-center justify-center"
              style={
                location.state.subject_type === "test"
                  ? { display: "none" }
                  : {
                      height: "100%",
                      textTransform: "uppercase",
                      background: "whitesmoke",
                    }
              }
              hoverable
              onClick={() => setType(0)}
            >
              Subject
            </Card>
          </Col>
          <Col xl={12} lg={12} md={24} sm={24} xs={24}>
            <Card
              className="d-flex align-center justify-center"
              style={{
                height: "100%",
                textTransform: "uppercase",
                background: "whitesmoke",
              }}
              hoverable
              onClick={() => setType(1)}
            >
              Тест
            </Card>
          </Col>
        </Row>
      </Modal>
      <Card loading={openModal}>
        <Card title="Create Subject">
          <Form
            form={form}
            name="create-topic"
            layout="vertical"
            initialValues={{
              modifier: "public",
            }}
            onFinish={onFinish}
          >
            {type == 0 ? (
              <>
                <Form.Item
                  name="name"
                  rules={[{ required: true, whitespace: true }]}
                >
                  <Input placeholder="Subject name" disabled={loading} />
                </Form.Item>
                <Form.Item
                  name="content"
                  rules={[{ required: true, whitespace: true }]}
                >
                  <ReactQuill
                    modules={modules}
                    formats={formats}
                    value={contentValue}
                    onChange={setContentValue}
                  />
                </Form.Item>
                <Form.Item
                  name="teaser"
                  rules={[{ required: true, whitespace: true }]}
                >
                  <Input placeholder="тизер" disabled={loading} />
                </Form.Item>
              </>
            ) : (
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
            )}
            <Form.Item>
              <Button loading={loading} type="primary" htmlType="submit">
                Создавать
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Card>
    </div>
  );
};
export default CreateSubject;
