import React, { useEffect, useState } from "react";
import "./style.scss";
import { Button, Table, Modal, Form, Row, Col, Input, DatePicker } from "antd";
import { api } from "../../../utils/api";
import { BiCheckCircle } from "react-icons/bi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";

const AdminTeacherList = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [tableLoading, setTableLoading] = useState(false);
  const [loading, setLoading] = useState(false);
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
    },
    {
      title: "Ism",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Familiya",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Otasining ismi",
      dataIndex: "patronymic",
      key: "patronymic",
    },
    {
      title: "Tug'ilgan yili",
      dataIndex: "birth_date",
      key: "birth_date",
    },
    {
      title: "Telefon raqami",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Pasport",
      dataIndex: "passport",
      key: "passport",
      render: (text) => {
        return (
          <p>
            {text.series}-{text.number}
          </p>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      align: "center",
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
      title: "Blok",
      dataIndex: "is_block",
      key: "is_block",
      align: "center",
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
  ];

  // getTeacherList
  const getTeacherList = async (page, pageSize) => {
    setTableLoading(true);
    const body = {
      page,
      pageSize,
    };
    const res = await api.get("api/admin/teacher/list", { params: body });
    try {
      if (res) {
        setData(
          res.data.data.map((item) => {
            return {
              ...item,
              key: item.id,
              passport: { series: item.series, number: item.number },
            };
          })
        );
        setPagination({
          current: res.data.current_page,
          pageSize: res.data.per_page,
          total: res.data.total,
        });
        setTableLoading(false);
      }
    } catch (err) {
      console.log(err, "err");
      setTableLoading(false);
    } finally {
      setTableLoading(false);
    }
  };
  // handlePnfl
  const handlePnfl = async () => {
    setLoading(true);
    const body = { pinfl: form.getFieldValue("pinfl") };
    const res = await api.post("api/get-client-by-pinfl", body);
    try {
      if (res) {
        setLoading(false);
        form.setFieldsValue({
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          patronymic: res.data.patronymic,
          series: res.data.series,
          number: res.data.number,
          birth_date: moment(res.data.birth_date),
        });
      }
    } catch (err) {
      console.log(err, "err");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  // addTeacher
  const handleAdd = () => {
    setIsModalOpen(true);
  };
  const addTeacher = async (values) => {
    setLoading(true);
    const body = {
      ...values,
      birth_date: moment(values.birth_date).format("YYYY-MM-DD"),
    };
    const res = await api.post("api/admin/teacher/add", body);
    try {
      if (res) {
        setLoading(false);
        toast.success("Yaratildi!");
      }
      toast.error("Ma'lumotlar noto'g'ri ko'rsatildi");
    } catch (err) {
      console.log(err, "err");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTeacherList(1, 15);
  }, []);

  return (
    <div className="admin_teacher">
      <Button onClick={handleAdd} className="teacher_btn" type="primary">
        Qo'shish
      </Button>
      <Table
        loading={tableLoading}
        scroll={{ x: 400 }}
        columns={columns}
        dataSource={data}
        pagination={{
          current_page: pagination.current,
          per_page: pagination.pageSize,
          total: pagination.total,
          onChange: (current_page, per_page) => {
            getTeacherList(current_page, per_page);
          },
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      />
      <Modal
        width={720}
        title="O'qituvchi qo'shish"
        open={isModalOpen}
        onCancel={() => {
          form.resetFields();
          setIsModalOpen(false);
        }}
        footer={
          <div>
            <Button
              disabled={loading}
              onClick={() => {
                form.resetFields();
                setIsModalOpen(false);
              }}
              style={{ borderRadius: "2px", height: "40px" }}
            >
              Bekor qilish
            </Button>
            <Button
              htmlType="submit"
              form="addTeacher"
              style={{ borderRadius: "2px", height: "40px" }}
              type="primary"
              loading={loading}
            >
              Qo'shish
            </Button>
          </div>
        }
      >
        <Form
          onFinish={addTeacher}
          form={form}
          layout="vertical"
          id="addTeacher"
        >
          <Row gutter={[20]}>
            <Col xl={8} lg={8} md={24} sm={24} xs={24}>
              <Form.Item name="first_name" label="Ismi">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={24} sm={24} xs={24}>
              <Form.Item name="last_name" label="Familiyasi">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={24} sm={24} xs={24}>
              <Form.Item name="patronymic" label="Otasining ismi">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[20]}>
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <Form.Item name="series" label="Pasport seriyasi">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <Form.Item name="number" label="Pasport raqami">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="pinfl"
            label="PINFL"
            rules={[{ required: true, min: 14, max: 14 }]}
          >
            <Input suffix={<Button onClick={handlePnfl}>Tekshirish</Button>} />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Telefon raqami"
            rules={[{ required: true, min: 12 }]}
          >
            <Input placeholder="998901234567" disabled={loading} />
          </Form.Item>
          <Form.Item name={"birth_date"} label="Tug'ilgan yili">
            <DatePicker disabled style={{ width: "100%" }} />
          </Form.Item>
          <Row gutter={[20]}>
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <Form.Item
                name="password"
                label="Parol"
                required={[{ required: true, min: 6 }]}
              >
                <Input disabled={loading} />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <Form.Item
                name="password_confirmation"
                label="Parolni takrorlang"
                required={[{ required: true, min: 6 }]}
              >
                <Input disabled={loading} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default AdminTeacherList;
