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
  const [videoUrl, setVideoUrl] = useState();
  const [pdfToken, setPdfTokens] = useState();
  const [videoToken, setVideoTokens] = useState();
  const [subject, setSubject] = useState();

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
          setSubject(res.data.data);
          if (res.data.data.type === "media") {
            res.data.data?.media
              ?.filter((value) => value.type === "pdf")
              .map((item) => {
                setPdfUrl({ url: `https://api.edu.imedic.uz${item.file_url}` });
              });
            res.data.data?.media
              ?.filter((value) => value.type === "video")
              .map((item) => {
                setVideoUrl({
                  url: `https://api.edu.imedic.uz${item.file_url}`,
                });
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
    if (pdfToken || videoToken) {
      values.content = [pdfToken, videoToken];
      (values.type = "media"), (values.subject_type = "topic");
    } else {
      values.subject_type = "topic";
      values.type = "text";
    }
    try {
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
        });
    } catch (err) {
      console.log(err, "err");
    } finally {
      setLoading(false);
    }
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
        toast.success("O'zgartirildi", { position: "bottom-right" });
        setLoading(false);
      }
    } catch (err) {
      console.log(err, "err");
      setLoading(false);
    }
  };

  // handlePdf
  const handlePdf = async (e) => {
    setPdfUrl({
      url: URL.createObjectURL(e.target.files[0]),
      file: e.target.files[0],
    });
    const body = {
      type: "pdf",
      file: e.target.files[0],
    };
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
    };
    try {
      const res = await api.post(`api/media/upload`, body, config);
      res.status === 200 &&
        toast.success("Загружено", { position: "bottom-right" });
      setPdfTokens((prev) => (prev = res.data.token));
    } catch (err) {
      console.log(err, "err");
      toast.warn(err.message, { position: "bottom-right" });
    }
  };

  // handleVideo
  const handleVideo = async (e) => {
    setVideoUrl({
      url: URL.createObjectURL(e.target.files[0]),
      file: e.target.files[0],
    });
    const body = {
      type: "video",
      file: e.target.files[0],
    };
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
    };
    try {
      const res = await api.post(`api/media/upload`, body, config);
      res.status === 200 &&
        toast.success("Загружено", { position: "bottom-right" });
      setVideoTokens((prev) => (prev = res.data.token));
    } catch (err) {
      console.log(err, "err");
      toast.warn(err.message, { position: "bottom-right" });
    }
  };

  // handleCloseFiles
  const handleCloseFilesVideo = async () => {
    setVideoUrl(false);
    try {
      const res = await api.post(`api/media/delete`, { token: videoToken });
      res.status === 200 &&
        toast.success("Отменено", { position: "bottom-right" });
      setVideoTokens(false);
    } catch (err) {
      console.log(err, "err");
      toast.warn(err.message, { position: "bottom-right" });
    }
  };

  // handleCloseFilesPdf
  const handleCloseFilesPdf = async () => {
    setPdfUrl(false);
    try {
      const res = await api.post(`api/media/delete`, { token: pdfToken });
      res.status === 200 &&
        toast.success("Отменено", { position: "bottom-right" });
      setPdfTokens(false);
    } catch (err) {
      console.log(err, "err");
      toast.warn(err.message, { position: "bottom-right" });
    }
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
              <Link to={`/teacher/course/${location.state?.message}/view`}>
                Ortga
              </Link>
            ),
          },
          {
            title: <p style={{ color: "grey" }}>{subject?.name}</p>,
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
                className={
                  pdfToken
                    ? "disabled d-flex align-center gap-x-1"
                    : "uploadLabelPDF d-flex align-center gap-x-1"
                }
              >
                <VscFilePdf style={{ fontSize: "18px" }} />
                PDF yuklash
                <input
                  disabled={pdfToken}
                  type="file"
                  id="pdf"
                  accept="application/pdf"
                  onChange={handlePdf}
                />
              </label>

              <label
                htmlFor="video"
                className={
                  videoToken
                    ? "disabled d-flex align-center gap-x-1"
                    : "uploadLabelVideo d-flex align-center gap-x-1"
                }
              >
                <AiOutlineVideoCameraAdd style={{ fontSize: "18px" }} />
                Video yuklash
                <input
                  disabled={videoToken}
                  type="file"
                  id="video"
                  accept="video/mp4,video/x-m4v,video/*"
                  onChange={handleVideo}
                />
              </label>
              {pdfToken && (
                <Button
                  className="restore-btn d-flex align-center gap-1"
                  onClick={handleCloseFilesPdf}
                  style={{ background: "red", color: "#fff" }}
                >
                  <AiOutlineClose style={{ fill: "#fff" }} />
                  Сбросить pdf
                </Button>
              )}
              {videoToken && (
                <Button
                  className="restore-btn d-flex align-center gap-1"
                  onClick={handleCloseFilesVideo}
                  style={{ background: "red", color: "#fff" }}
                >
                  <AiOutlineClose style={{ fill: "#fff" }} />
                  Сбросить video
                </Button>
              )}
            </div>

            {pdfUrl && (
              <>
                <Button
                  className="d-flex align-center gap-1"
                  style={{ margin: "1rem auto" }}
                >
                  <AiFillEye style={{ fontSize: "18px" }} />
                  <a href={`${pdfUrl?.url}`} target="_blank">
                    PDF -ni ko'rish
                  </a>
                </Button>
                <object
                  data={pdfUrl?.url}
                  width="100%"
                  type="application/pdf"
                  style={{
                    height: "100%",
                    aspectRatio: "1",
                    marginBottom: "1rem",
                  }}
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
              <Button
                className="add-button"
                loading={loading}
                type="primary"
                htmlType="submit"
              >
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
