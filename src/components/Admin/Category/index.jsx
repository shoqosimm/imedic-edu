import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Table,
  message,
  Popconfirm,
  Modal,
} from "antd";
import React, { useEffect, useState } from "react";
import "./style.scss";
import { api } from "../../../utils/api";
import Swal from "sweetalert2";
import { BiCheckCircle, BiPencil, BiTrash } from "react-icons/bi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminCategory = () => {
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [record, setRecord] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 100,
  });
  const columns = [
    {
      title: "№",
      dataIndex: "id",
      key: "id",
      width: "5%",
    },
    {
      title: "Turkum nomi",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Yo'nalish",
      dataIndex: "is_malaka",
      key: "is_malaka",
      render: (text) => {
        return (
          <p>{(text === "1" && "Malaka") || (text === "0" && "Iqtisos")}</p>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (text) => {
        return (
          (text === "1" && (
            <BiCheckCircle style={{ fill: "green", fontSize: "18px" }} />
          )) ||
          (text === "0" && (
            <AiOutlineCloseCircle style={{ fill: "red", fontSize: "18px" }} />
          ))
        );
      },
    },
    {
      title: "O'zgartirish",
      dataIndex: "edit",
      key: "edit",
      align: "center",
      width: "5%",
      render: (t, record) => {
        return (
          <div className="d-flex align-center gap-x-3">
            <BiPencil
              onClick={() => {
                form2.setFieldsValue({
                  name: record.name,
                  is_malaka: record.is_malaka,
                });
                setRecord(record);
                setIsModalOpen(true);
              }}
              style={{ cursor: "pointer" }}
            />

            <Popconfirm
              title="O'chirish"
              description="siz haqiqatdan ham ushbu hodimni o'chirmoqchimisiz?"
              onConfirm={() => deleteCategory(record)}
              onCancel={() => message.error("Bekor qilindi")}
              okText="Ha"
              cancelText="Yo'q"
            >
              <BiTrash style={{ cursor: "pointer" }} />
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  // getListCategory
  const getListCategory = async (page, pageSize) => {
    setTableLoading(true);
    const body = {
      current: page,
      pageSize: pageSize,
    };
    const res = await api.get("api/admin/category/list", { params: body });
    try {
      if (res) {
        setTableLoading(false);
        setData(
          res.data.data.map((item) => {
            return {
              ...item,
              key: item.id,
            };
          })
        );
        setPagination({
          current: res.data.current_page,
          pageSize: res.data.per_page,
          total: res.data.total,
        });
      }
    } catch (err) {
      console.log(err, "err");
      setTableLoading(false);
    } finally {
      setTableLoading(false);
    }
  };

  // handleAdd
  const handleAdd = async (values) => {
    setLoading(true);
    const body = values;
    const res = await api.post("api/admin/category/add", body);
    try {
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Qo'shildi",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
        setLoading(false);
        form.resetFields();
        getListCategory(pagination.current,pagination.pageSize);
      }
    } catch (err) {
      console.log(err, "err");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // handleReset
  const handleReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    getListCategory(1, 15);
  }, []);

  // editCategory
  const editCategory = async (values) => {
    const body = values;
    const res = await api.post(`api/admin/category/update/${record.id}`, body);
    try {
      if (res) {
        toast.success("Muvaffaqiyatli", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        setIsModalOpen(false);
        getListCategory(pagination.current,pagination.pageSize);
      }
    } catch (err) {
      console.log(err, "err");
    } finally {
    }
  };

  // deleteCategory
  const deleteCategory = async (record) => {
    const res = await api.get(`api/admin/category/delete/${record.id}`);
    try {
      if (res) {
        message.success("O'chirildi!");
        getListCategory(pagination.current,pagination.pageSize);
      }
    } catch (err) {
      console.log(err, "err");
    }
  };

  return (
    <div className="admin_category">
      <Form
        autoComplete="false"
        onFinish={handleAdd}
        layout="vertical"
        form={form}
        id="adminCategoryForm"
      >
        <Row gutter={[20, 20]} className="d-flex align-end">
          <Col xl={9} lg={9} md={24} sm={24} xs={24}>
            <Form.Item
              name="name"
              label="Turkum nomi"
              rules={[{ required: true, whitespace: true }]}
            >
              <Input disabled={loading} />
            </Form.Item>
          </Col>
          <Col xl={9} lg={9} md={24} sm={24} xs={24}>
            <Form.Item
              name="is_malaka"
              label="Yo'nalish"
              rules={[{ required: true, whitespace: true }]}
            >
              <Select
                disabled={loading}
                options={[
                  {
                    value: "0",
                    label: "Iqtisos",
                  },
                  {
                    value: "1",
                    label: "Malaka",
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xl={3} lg={3} md={24} sm={24} xs={24}>
            <Button loading={loading} htmlType="submit" type="primary">
              Qo'shish
            </Button>
          </Col>
          <Col xl={3} lg={3} md={24} sm={24} xs={24}>
            <Button disabled={loading} onClick={handleReset}>
              Bekor qilish
            </Button>
          </Col>
        </Row>
      </Form>
      <Table
        loading={tableLoading}
        scroll={{ x: 400 }}
        columns={columns}
        dataSource={data}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page, pageSize) => {
            getListCategory(page, pageSize);
          },
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      />
      <Modal
        title="O'zgartirish"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={
          <div>
            <Button
              onClick={() => setIsModalOpen(false)}
              style={{ borderRadius: "2px", height: "40px" }}
            >
              Bekor qilish
            </Button>
            <Button
              htmlType="submit"
              form="editForm"
              style={{ borderRadius: "2px", height: "40px" }}
              type="primary"
            >
              Saqlash
            </Button>
          </div>
        }
      >
        <Form
          onFinish={editCategory}
          form={form2}
          id="editForm"
          layout="vertical"
        >
          <Row gutter={[20]}>
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <Form.Item name="name" label="Turkum nomi">
                <Input />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <Form.Item
                rules={[{ required: true }]}
                name="is_malaka"
                label="Yo'nalish"
              >
                <Select
                  style={{ width: "100%" }}
                  options={[
                    {
                      value: "0",
                      label: "Iqtisos",
                    },
                    {
                      value: "1",
                      label: "Malaka",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default AdminCategory;
