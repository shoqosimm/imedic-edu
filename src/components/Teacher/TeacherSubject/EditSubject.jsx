import {
  Breadcrumb,
  Button,
  Card,
  Divider,
  Form,
  Input,
  Modal,
  Upload,
} from "antd";
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
          if (res.data.data.image?.file_url) {
            setFileList([
              {
                url: `https://api.edu.imedic.uz${res.data.data.image?.file_url}`,
              },
            ]);
          }
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
        if (res.data.data.image?.file_url) {
          setFileList([
            { url: `https://api.edu.imedic.uz${res.data.data.image.file_url}` },
          ]);
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
    if (pdfUrl || videoUrl) {
      if (pdfToken && videoToken) {
        values.content = [pdfToken, videoToken];
        (values.type = "media"), (values.subject_type = "topic");
        values.images = imagesToken && imagesToken.split();
        values.deleted = {
          deleted_pdf,
          deleted_video,
        };
      } else if (pdfToken) {
        values.content = [pdfToken];
        (values.type = "media"), (values.subject_type = "topic");
        values.images = imagesToken && imagesToken.split();
        values.deleted = {
          deleted_pdf,
          deleted_video,
        };
      } else if (videoToken) {
        values.content = [videoToken];
        (values.type = "media"), (values.subject_type = "topic");
        values.images = imagesToken && imagesToken.split();
        values.deleted = {
          deleted_pdf,
          deleted_video,
        };
      } else {
        values.subject_type = "topic";
        values.images = imagesToken && imagesToken.split();
        values.type = "media";
        values.deleted = {
          deleted_pdf,
          deleted_video,
        };
      }
    } else {
      values.subject_type = "topic";
      values.type = "text";
      values.images = imagesToken && imagesToken.split();
      values.deleted = {
        deleted_pdf,
        deleted_video,
      };
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
      images: imagesToken && imagesToken.split(),
    };
    try {
      const res = await api.post(
        `api/teacher/course-subject/update/${params.id}`,
        body
      );
      if (res) {
        toast.success(t('changed'), { position: "bottom-right" });
        setLoading(false);
      }
    } catch (err) {
      console.log(err, "err");
      setLoading(false);
    }
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
        toast.success(t('uploaded'), { position: "bottom-right" });
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
        toast.success(t('uploaded'), { position: "bottom-right" });
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
               {t('back')}
              </Link>
            ),
          },
          {
            title: <p style={{ color: "grey" }}>{subject?.name}</p>,
          },
        ]}
      />
      <Card title={t('change')}>
        {location.state?.subject_type !== "test" ? (
          <Form id="sujectForm" name="basic" form={form} onFinish={onFinish}>
            <Upload
              maxCount={1}
              customRequest={handleGetToken}
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
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
            <Form.Item name="name">
              <Input disabled={loading} />
            </Form.Item>
            <Form.Item name="teaser">
              <Input disabled={loading} />
            </Form.Item>
            <div className="d-flex align-center justify-between flex-wrap gap-1">
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
                <ReactQuill modules={modules} formats={formats} />
              </Form.Item>
            )}

            <Form.Item>
              <Button
                className="add-button"
                loading={loading}
                type="primary"
                htmlType="submit"
                disabled={updateBtn}
              >
                {t('save')}
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
                label={t('testName')}
              >
                <Input placeholder="Test name" disabled={loading} />
              </Form.Item>
              <Form.Item
                name="count_test"
                rules={[{ required: true, whitespace: true }]}
                label={t('testNumber')}
              >
                <Input placeholder={t('testNumber')} disabled={loading} />
              </Form.Item>
              <Form.Item
                name="time"
                rules={[{ required: true, whitespace: true }]}
                label={t('testTime')} 
              >
                <Input placeholder={t('testTime')}  disabled={loading} />
              </Form.Item>
              <Form.Item
                name="right_test"
                rules={[{ required: true, whitespace: true }]}
                label={t('correctAnswer')}
              >
                <Input placeholder={t('transitions')}  disabled={loading} />
              </Form.Item>
              <Form.Item
                name="resubmit"
                label={t('resubmit')}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    min: 1,
                    message: t('typeNumber'),
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder={t('resubmit')}
                  disabled={loading}
                />
              </Form.Item>
              <Form.Item
                name="teaser"
                rules={[{ required: true, whitespace: true }]}
                label={t('teaser')}
              >
                <Input placeholder={t('teaser')} disabled={loading} />
              </Form.Item>
              <Upload
                maxCount={1}
                customRequest={handleGetToken}
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
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
                {t('save')}
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
