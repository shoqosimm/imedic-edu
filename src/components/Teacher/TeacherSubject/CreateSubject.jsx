import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Upload,
} from "antd";
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { api } from "../../../utils/api";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Notification } from "../../Notification/Notification";
import "./styles/createSubjectStyle.scss";
import { BiHome } from "react-icons/bi";
import { VscFilePdf } from "react-icons/vsc";
import {
  AiFillEye,
  AiOutlineVideoCameraAdd,
} from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import { PlusOutlined } from "@ant-design/icons";
import { t } from "i18next";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

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
  const [pdfToken, setPdfTokens] = useState();
  const [videoToken, setVideoTokens] = useState();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [imagesToken, setImagesToken] = useState();
  const [deleted_pdf, setDeletedPdf] = useState(false);
  const [deleted_video, setDeletedVideo] = useState(false);
  const [updateBtn, setUpdateBtn] = useState(false);
  // img-Upload
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        {t('upload')}
      </div>
    </div>
  );
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleCancel = () => setPreviewOpen(false);

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  // handleGetToken
  const handleGetToken = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    const fmData = new FormData();
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };
    fmData.append("file", file);
    fmData.append("type", "image");
    try {
      const res = await api.post(`api/media/upload`, fmData, config);
      if (res.data.token) {
        onSuccess("Ok");
        setImagesToken((prev) => (prev = res.data.token));
      } else {
        onError({ res });
      }
    } catch (err) {
      console.log("upload error", err);
      onError({ err });
    }
  };
  // onRemove
  const onRemove = () => {
    const body = {
      token: imagesToken,
    };
    api.post(`api/media/delete`, body).then((res) => {
      if (res) {
        console.log(res.data, "res");
      }
    });
  };

  //   create
  const onFinish = (values) => {
    setLoading(true);
    let body = {};
    if (type === 0) {
      if (pdfToken && videoToken) {
        body.content = [pdfToken, videoToken];
        body.type = "media";
        body.course_id = parseInt(params.id);
        body.subject_type = "topic";
        body.name = values.name;
        body.teaser = values.teaser;
        body.images = imagesToken && imagesToken.split();
        body.deleted = {
          deleted_pdf,
          deleted_video,
        };
      } else if (pdfToken) {
        body.content = [pdfToken];
        body.type = "media";
        body.course_id = parseInt(params.id);
        body.subject_type = "topic";
        body.name = values.name;
        body.teaser = values.teaser;
        body.images = imagesToken && imagesToken.split();
        body.deleted = {
          deleted_pdf,
          deleted_video,
        };
      } else if (videoToken) {
        body.content = [videoToken];
        body.type = "media";
        body.course_id = parseInt(params.id);
        body.subject_type = "topic";
        body.name = values.name;
        body.teaser = values.teaser;
        body.images = imagesToken && imagesToken.split();
        body.deleted = {
          deleted_pdf,
          deleted_video,
        };
      } else {
        body.content = contentValue;
        body.course_id = parseInt(params.id);
        body.subject_type = "topic";
        body.name = values.name;
        body.teaser = values.teaser;
        body.type = "text";
        body.images = imagesToken && imagesToken.split();
        body.deleted = {
          deleted_pdf,
          deleted_video,
        };
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
      body.images = imagesToken && imagesToken.split();
    }

    api
      .post("/api/teacher/course-subject/add", body)
      .then((res) => {
        if (res.status === 200) {
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
  const handlePdf = async (e) => {
    setUpdateBtn(true);
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
      setUpdateBtn(false);
    } catch (err) {
      console.log(err, "err");
      toast.warn(err.message, { position: "bottom-right" });
    }
  };

  // handleVideo
  const handleVideo = async (e) => {
    setUpdateBtn(true);
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
      setUpdateBtn(false);
    } catch (err) {
      console.log(err, "err");
      toast.warn(err.message, { position: "bottom-right" });
    }
  };

  // handleDeleteFiles
  const handleDeleteFiles = (file) => {
    if (file === "pdf") {
      setDeletedPdf(true);
      setPdfUrl(false);
      setPdfTokens(false);
    } else if (file === "video") {
      setDeletedVideo(true);
      setVideoUrl(false);
      setVideoTokens(false);
    }
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
                {t('back')}
              </Link>
            ),
          },
          {
            title: <p style={{ color: "grey" }}>{t('create')}</p>,
          },
        ]}
      />
      <Modal
        className="create_subject"
        title={t('create')}
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
              {t('cours')}
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
              {t('test')}
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
                <Upload
                  maxCount={1}
                  customRequest={handleGetToken}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  onRemove={onRemove}
                >
                  {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal
                  open={previewOpen}
                  title={previewTitle}
                  footer={null}
                  onCancel={handleCancel}
                >
                  <img
                    alt="example"
                    style={{
                      width: "100%",
                    }}
                    src={previewImage}
                  />
                </Modal>
                <Form.Item
                  name="name"
                  rules={[{ required: true, whitespace: true }]}
                >
                  <Input placeholder={t('titleCouts')} disabled={loading} />
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
                    className={
                      pdfToken
                        ? "disabled d-flex align-center gap-x-1"
                        : "uploadLabelPDF d-flex align-center gap-x-1"
                    }
                  >
                    <VscFilePdf style={{ fontSize: "18px" }} />
                   {t('pdf')}
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
                  {t('videoUpload')}
                    <input
                      disabled={videoToken}
                      type="file"
                      id="video"
                      accept="video/mp4,video/x-m4v,video/*"
                      onChange={handleVideo}
                    />
                  </label>
                </div>
                <Divider />
                {pdfUrl && (
                  <>
                    <Button
                      className="d-flex align-center gap-1"
                      style={{ margin: "1rem auto" }}
                    >
                      <AiFillEye style={{ fontSize: "18px" }} />
                      <a href={`${pdfUrl?.url}`} target="_blank">
                        {t('viewPdf')}
                      </a>
                    </Button>
                    <div className="pdfWrapper">
                      <Button
                        className="closePdf"
                        onClick={() => handleDeleteFiles("pdf")}
                      >
                        X
                      </Button>
                      <object
                        data={pdfUrl?.url}
                        width="100%"
                        type="application/pdf"
                        style={{
                          height: "100%",
                          aspectRatio: "1",
                        }}
                      ></object>
                    </div>
                  </>
                )}
                {videoUrl && (
                  <div className="videoWrapper">
                    <Button
                      className="closeVideo"
                      onClick={() => handleDeleteFiles("video")}
                    >
                      X
                    </Button>
                    <video controls width="100%">
                      <source src={videoUrl?.url} type="video/mp4" />
                    </video>
                  </div>
                )}
                {pdfUrl || videoUrl ? null : (
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
                  <Input placeholder={t('testName')} disabled={loading} />
                </Form.Item>
                <Form.Item
                  name="count_test"
                  rules={[{ required: true, whitespace: true }]}
                >
                  <Input placeholder={t('testNumber')} disabled={loading} />
                </Form.Item>
                <Form.Item
                  name="time"
                  rules={[{ required: true, whitespace: true }]}
                >
                  <Input placeholder={t('testTime')} disabled={loading} />
                </Form.Item>
                <Form.Item
                  name="right_test"
                  rules={[{ required: true, whitespace: true }]}
                >
                  <Input placeholder="o`tish soni " disabled={loading} />
                </Form.Item>
                <Form.Item
                  name="resubmit"
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
                    controls={false}
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
                <Upload
                  maxCount={1}
                  customRequest={handleGetToken}
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  onRemove={onRemove}
                >
                  {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal
                  open={previewOpen}
                  title={previewTitle}
                  footer={null}
                  onCancel={handleCancel}
                >
                  <img
                    alt="example"
                    style={{
                      width: "100%",
                    }}
                    src={previewImage}
                  />
                </Modal>
              </>
            )}
            <Form.Item>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                disabled={updateBtn}
              >
                {t('create +')}
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
