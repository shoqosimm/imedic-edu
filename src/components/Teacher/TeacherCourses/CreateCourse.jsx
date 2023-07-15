import {
  Breadcrumb,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Upload,
} from "antd";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../../utils/api";
import "./styles/createCourseStyle.scss";
import { BiHome } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import { PlusOutlined } from "@ant-design/icons";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const CreateCourse = () => {
  const [category, setCategory] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [imagesToken, setImagesToken] = useState();

  // img-Upload
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
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

  // create
  const onFinish = (values) => {
    setLoading(true);
    let body = {
      name: values.title,
      category_id: values.category,
      images: imagesToken.split(),
    };
    api
      .post("/api/teacher/course/add", body)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.success) {
            toast.success("Yaratildi");
            setTimeout(() => {
              setLoading(false);
              form.resetFields();
              navigate("/teacher/course");
            }, 1500);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
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

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <div className="createCourse_teacher">
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
      <h1 style={{ color: "#fff" }}>Kurs yaratilishi</h1>
      <Card>
        <Form form={form} name="create-course" onFinish={onFinish}>
          <Form.Item name="title">
            <Input
              disabled={loading}
              className="create_input"
              placeholder="Kursning nomi"
              rules={[
                {
                  required: true,
                  message: "Iltimos, kursning nomini kiriting!",
                },
              ]}
            />
          </Form.Item>
          <Form.Item name="category">
            <Select
              disabled={loading}
              className="create_input"
              options={category}
              placeholder="Turkumni tanlang"
              style={{ width: "100%" }}
              rules={[
                {
                  required: true,
                  message: "Iltimos,kursga oid turkum tanlang!",
                },
              ]}
            />
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
          <Form.Item>
            <Button
              loading={loading}
              className="create_btn"
              type="primary"
              htmlType="submit"
            >
              Yaratish
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <ToastContainer />
    </div>
  );
};
export default CreateCourse;
