import { Breadcrumb, Button, Card, Col, Form, Input, Modal, Row } from "antd";
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { api } from "../../../utils/api";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Notification } from "../../Notification/Notification";
import "./styles/createSubjectStyle.scss";
import { BiHome } from "react-icons/bi";
import { VscFilePdf } from "react-icons/vsc";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { ToastContainer } from "react-toastify";

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
  const [pdfUrl, setPdfUrl] = useState();
  const [videoUrl, setVideoUrl] = useState();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const location = useLocation();
  const params = useParams();

  //   create
  const onFinish = (values) => {
    setLoading(true);
    let body = {};
    if (type === 0) {
      if (videoUrl) {
        const fmData = new FormData();
        fmData.append("video", videoUrl.file);
        body.content = fmData.get("video");
        body.type = "video";
        body.course_id = parseInt(params.id);
        body.subject_type = "topic";
        body.name = values.name;
        body.teaser = values.teaser;
      } else if (pdfUrl) {
        const fmData = new FormData();
        fmData.append("pdf", pdfUrl.file);
        body.content = fmData.get("pdf");
        body.type = "pdf";
        body.course_id = parseInt(params.id);
        body.subject_type = "topic";
        body.name = values.name;
        body.teaser = values.teaser;
      } else {
        body.content = contentValue;
        body.course_id = parseInt(params.id);
        body.subject_type = "topic";
        body.name = values.name;
        body.teaser = values.teaser;
      }
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
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
    };
    api
      .post("/api/teacher/course-subject/add", body, config)
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

  // handlePdf
  const handlePdf = (e) => {
    setVideoUrl(false);
    setPdfUrl({
      url: URL.createObjectURL(e.target.files[0]),
      file: e.target.files[0],
    });
  };
  // handleVideo
  const handleVideo = (e) => {
    setPdfUrl(false);
    setVideoUrl({
      url: URL.createObjectURL(e.target.files[0]),
      file: e.target.files[0],
    });
  };

  // handleCloseFiles
  const handleCloseFiles = () => {
    setVideoUrl(false);
    setPdfUrl(false);
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
                Ortga
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
      <Modal
        className="create_subject"
        title="Yaratish"
        centered
        closable={false}
        open={openModal}
        footer
      >
        <Row gutter={[20, 20]} title="Create Subject">
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
              Mavzu
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
              Test
            </Card>
          </Col>
        </Row>
      </Modal>
      <Card loading={openModal}>
        <Card title="Mavzu yoki Test qo'shish">
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
                  <Input placeholder="mavzu nomi" disabled={loading} />
                </Form.Item>
                <Form.Item
                  name="teaser"
                  rules={[{ required: true, whitespace: true }]}
                >
                  <Input placeholder="tizer" disabled={loading} />
                </Form.Item>
                <div
                  style={{ margin: "1rem 0", flexWrap: "wrap" }}
                  className="d-flex align-center gap-1"
                >
                  <label
                    htmlFor="pdf"
                    className={"uploadLabelPDF d-flex align-center gap-x-1"}
                  >
                    <VscFilePdf style={{ fontSize: "18px" }} />
                    PDF yuklash
                    <input
                      type="file"
                      id="pdf"
                      accept="application/pdf"
                      onChange={handlePdf}
                    />
                  </label>

                  <label
                    htmlFor="video"
                    className={
                      videoUrl
                        ? "disabled d-flex align-center gap-x-1"
                        : "uploadLabelVideo d-flex align-center gap-x-1"
                    }
                  >
                    <AiOutlineVideoCameraAdd style={{ fontSize: "18px" }} />
                    Video yuklash
                    <input
                      disabled={videoUrl}
                      type="file"
                      id="video"
                      accept="video/mp4,video/x-m4v,video/*"
                      onChange={handleVideo}
                    />
                  </label>

                  {pdfUrl || videoUrl ? (
                    <Button
                      onClick={handleCloseFiles}
                      style={{ background: "red", color: "#fff" }}
                    >
                      X
                    </Button>
                  ) : null}
                </div>
                {(pdfUrl && (
                  <object
                    data={pdfUrl?.url}
                    width="100%"
                    style={{ height: "100vh" }}
                  />
                )) ||
                  (videoUrl && (
                    <video controls width="100%">
                      <source src={videoUrl?.url} type="video/mp4" />
                    </video>
                  )) || (
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
                  )}
              </>
            ) : (
              <>
                <Form.Item
                  name="name"
                  rules={[{ required: true, whitespace: true }]}
                >
                  <Input placeholder="test nomi" disabled={loading} />
                </Form.Item>
                <Form.Item
                  name="count_test"
                  rules={[{ required: true, whitespace: true }]}
                >
                  <Input placeholder="test soni" disabled={loading} />
                </Form.Item>
                <Form.Item
                  name="time"
                  rules={[{ required: true, whitespace: true }]}
                >
                  <Input placeholder="test vaqti (minut)" disabled={loading} />
                </Form.Item>
                <Form.Item
                  name="right_test"
                  rules={[{ required: true, whitespace: true }]}
                >
                  <Input placeholder="o`tish soni " disabled={loading} />
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
                  <Input placeholder="tizer" disabled={loading} />
                </Form.Item>
              </>
            )}
            <Form.Item>
              <Button loading={loading} type="primary" htmlType="submit">
                Yaratish +
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Card>
      <ToastContainer />
    </div>
  );
};
export default CreateSubject;
