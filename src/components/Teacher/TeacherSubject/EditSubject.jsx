import { Breadcrumb, Button, Card, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { api } from "../../../utils/api";
import "react-quill/dist/quill.snow.css";
import { Notification } from "../../Notification/Notification";
import "./styles/edtSubjectStyle.scss";
import { BiHome } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import {
  AiFillEye,
  AiOutlineClose,
  AiOutlineVideoCameraAdd,
} from "react-icons/ai";
import { VscFilePdf } from "react-icons/vsc";

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

const EditSubject = () => {
  const params = useParams();
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState();
  const [contentType, setContentType] = useState(false);
  const [videoUrl, setVideoUrl] = useState();

  //   getSubject
  const getSubject = (id) => {
    setLoading(true);
    api
      .get(`api/teacher/course-subject/show/${id}`)
      .then((res) => {
        setLoading(false);
        if (location.state?.subject_type !== "test") {
          form.setFieldsValue({
            name: res.data.data.name,
            content: res.data.data.content,
            teaser: res.data.data.teaser,
          });
          setContentType(res.data.data.type);
          if (res.data.data.type === "pdf") {
            setPdfUrl({
              url: `https://api.edu.imedic.uz${res.data.data.content}`,
            });
          } else if (res.data.data.type === "video") {
            setVideoUrl({
              url: `https://api.edu.imedic.uz${res.data.data.content}`,
            });
          }
        }
        form.setFieldsValue({
          name: res.data.data.name,
          count_test: String(res.data.data.count_test),
          time: res.data.data.time,
          right_test: String(res.data.data.right_test),
          resubmit: res.data.data.resubmit,
          teaser: res.data.data.teaser,
          is_active: res.data.data.is_active,
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
    if (contentType === "pdf") {
      if (pdfUrl.file) {
        const fm = new FormData();
        fm.append("pdf", pdfUrl.file);
        values.content = fm.get("pdf");
        values.subject_type = "topic";
        values.type = "pdf";
      }
      values.subject_type = "topic";
    } else if (contentType === "video") {
      if (videoUrl.file) {
        const fm = new FormData();
        fm.append("video", videoUrl.file);
        values.content = fm.get("video");
        values.subject_type = "topic";
        values.type = "video";
      }
      values.subject_type = "topic";
    } else {
      values.subject_type = "topic";
      values.type = "text";
    }

    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
    };
    api
      .post(`api/teacher/course-subject/update/${params.id}`, values, config)
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
  const updateTest = async (values) => {
    setLoading(true);
    const body = {
      ...values,
      subject_type: "test",
    };
    try {
      const res = await api.post(
        `api/teacher/course-subject/update/${params.id}`,
        body
      );
      if (res) {
        toast.success("O'zgartirildi");
        setLoading(false);
      }
    } catch (err) {
      console.log(err, "err");
      setLoading(false);
    }
  };

  // handlePdf
  const handlePdf = (e) => {
    setContentType("pdf");
    setPdfUrl({
      url: URL.createObjectURL(e.target.files[0]),
      file: e.target.files[0],
    });
  };
  // handleVideo
  const handleVideo = (e) => {
    setContentType("video");
    setVideoUrl({
      url: URL.createObjectURL(e.target.files[0]),
      file: e.target.files[0],
    });
  };

  // handleCloseFiles
  const handleCloseFiles = () => {
    setVideoUrl(false);
    setPdfUrl(false);
    setContentType(false);
  };

  useEffect(() => {
    getSubject(params.id);
  }, []);

  console.log(pdfUrl?.url, "pdf");
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
              <Link to={`/teacher/course/${location.state?.message}/view`}>
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
      <Card title="O'zgartirish">
        {location.state?.subject_type !== "test" ? (
          <Form id="sujectForm" name="basic" form={form} onFinish={onFinish}>
            <Form.Item name="name">
              <Input disabled={loading} />
            </Form.Item>
            <Form.Item name="teaser">
              <Input disabled={loading} />
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
                className="restore-btn"
                  onClick={handleCloseFiles}
                  style={{ background: "red" }}
                >
                  <AiOutlineClose style={{ fill: "#fff" }} />
                </Button>
              ) : null}
            </div>

            {pdfUrl && (
              <>
                <Button
                  className="d-flex align-center gap-1"
                  style={{ margin: "1rem auto" }}
                >
                  <AiFillEye style={{ fontSize: "18px" }} />
                  <a
                    href={`${pdfUrl?.url}`}
                    target="_blank"
                  >
                    PDF -ni ko'rish
                  </a>
                </Button>
                <object
                  data={pdfUrl?.url}
                  width="100%"
                  type="application/pdf"
                  style={{ height: "100%", aspectRatio:"1" }}
                ></object>
              </>
            )}
            {videoUrl && (
              <video controls width="100%">
                <source src={videoUrl?.url} type="video/mp4" />
              </video>
            )}
            {pdfUrl || videoUrl ? null : (
              <Form.Item
                name="content"
                rules={[{ required: true, whitespace: true }]}
              >
                <ReactQuill modules={modules} formats={formats} />
              </Form.Item>
            )}

            <Form.Item>
              <Button className="add-button" loading={loading} type="primary" htmlType="submit">
                Saqlash
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
                label="Test nomi"
              >
                <Input placeholder="Test name" disabled={loading} />
              </Form.Item>
              <Form.Item
                name="count_test"
                rules={[{ required: true, whitespace: true }]}
                label="Test soni"
              >
                <Input placeholder="Test count" disabled={loading} />
              </Form.Item>
              <Form.Item
                name="time"
                rules={[{ required: true, whitespace: true }]}
                label="Test vaqti"
              >
                <Input placeholder="Test Vaqti (Minut)" disabled={loading} />
              </Form.Item>
              <Form.Item
                name="right_test"
                rules={[{ required: true, whitespace: true }]}
                label="To'g'ri javoblar soni"
              >
                <Input placeholder="O`tish soni " disabled={loading} />
              </Form.Item>
              <Form.Item
                name="resubmit"
                label="Qayta topshirish oraliq vaqti"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    min: 1,
                    message: "son ko'rinishida bo'lishi kerak!",
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder="Qayta topshirish vaqti"
                  disabled={loading}
                />
              </Form.Item>
              <Form.Item
                name="teaser"
                rules={[{ required: true, whitespace: true }]}
                label="Tizer"
              >
                <Input placeholder="tizer" disabled={loading} />
              </Form.Item>
            </>

            <Form.Item>
              <Button
                form={
                  location.state?.subject_type === "test"
                    ? "testForm"
                    : "sujectForm"
                }
                loading={loading}
                type="primary"
                htmlType="submit"
              >
                Saqlash
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
      <ToastContainer />
    </div>
  );
};
export default EditSubject;
