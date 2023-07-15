import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Breadcrumb,
  Upload,
  Modal,
} from "antd";
import React, { useState, useEffect } from "react";
import { api } from "../../../utils/api";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import "./styles/editStyle.scss";
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

const EditCourse = () => {
  const [category, setCategory] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [imagesToken, setImagesToken] = useState(false);

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

  // onFinish
  const onFinish = (values) => {
    setSaveLoading(true);

    let body = {
      name: values.title,
      category_id: values.category,
      images: imagesToken && imagesToken.split(),
    };
    api
      .post(`api/teacher/course/update/${params.id}`, body)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.success) {
            toast.success("O'zgartirildi");
            setTimeout(() => {
              navigate("/teacher/course");
            }, 1500);
          }
        }
      })
      .catch((err) => {
        console.log(err);
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

  //  getItemCourse
  const getItemCourse = (id) => {
    setLoading(true);
    api
      .get(`api/teacher/course/show/${id}`)
      .then((res) => {
        form.setFieldsValue({
          title: res.data.name,
          category: res.data.category_id,
        });
        if (res.data?.image?.file_url) {
          setFileList([
            { url: `https://api.edu.imedic.uz${res.data?.image?.file_url}` },
          ]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getCategory();
    getItemCourse(params.id);
  }, []);

  return (
    <div className="editTeacherCourse">
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

      <h1 style={{ color: "#fff" }}>Kursni o'zgartirish</h1>
      <Card>
        <Form form={form} name="edit-course" onFinish={onFinish}>
          <Form.Item name="title">
            <Input
              className="editInput"
              disabled={loading}
              placeholder="Kurs nomi"
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
              className="editInput"
              disabled={loading}
              options={category}
              placeholder="Turkum tanlang"
              style={{ width: "100%" }}
              rules={[
                {
                  required: true,
                  message: "Iltimos, kursga oid turkumni tanlang!",
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
              className="editBtn"
              type="primary"
              htmlType="submit"
              loading={saveLoading}
            >
              O'zgartirish
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <ToastContainer />
    </div>
  );
};
export default EditCourse;
