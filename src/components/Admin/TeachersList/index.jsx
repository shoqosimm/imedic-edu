import React, { useEffect, useState } from "react";
import "./style.scss";
import { Button, Table, Modal, Form, Row, Col, Input, DatePicker } from "antd";
import { api } from "../../../utils/api";
import { BiCheckCircle } from "react-icons/bi";
import { AiOutlineCloseCircle } from "react-icons/ai";

const AdminTeacherList = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [tableLoading, setTableLoading] = useState(false);
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
      title: "Имя",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Фамилия",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Отчество",
      dataIndex: "patronymic",
      key: "patronymic",
    },
    {
      title: "Дата рождения",
      dataIndex: "birth_date",
      key: "birth_date",
    },
    {
      title: "Номер телефона",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Пасспорт",
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
      title: "Cтатус",
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
      title: "Блок",
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
  // addTeacher
  const handleAdd = () => {
    setIsModalOpen(true);
  };
  useEffect(() => {
    getTeacherList(1, 15);
  }, []);

  return (
    <div className="admin_teacher">
      <Button onClick={handleAdd} className="teacher_btn" type="primary">
        Добавить
      </Button>
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
            getTeacherList(page, pageSize);
          },
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      />
      <Modal
      width={720}
        title="Добавить сотрудника"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={
          <div>
            <Button
              onClick={() => setIsModalOpen(false)}
              style={{ borderRadius: "2px", height: "40px" }}
            >
              Отменить
            </Button>
            <Button
              htmlType="submit"
              form="addTeacher"
              style={{ borderRadius: "2px", height: "40px" }}
              type="primary"
            >
              Добавить
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical" id="addTeacher">
          <Row gutter={[20]}>
            <Col xl={8} lg={8} md={24} sm={24} xs={24}>
              <Form.Item name="first_name" label="Имя">
                <Input />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={24} sm={24} xs={24}>
              <Form.Item name="last_name" label="Фамилия">
                <Input />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={24} sm={24} xs={24}>
              <Form.Item name="patronymic" label="Отчество">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[20]}>
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <Form.Item name="series" label="Серия пасспорта">
                <Input />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <Form.Item name="number" label="Номер пасспорта">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="pinfl"
            label="ПНФЛ"
            rules={[{ required: true, min: 14, max: 14 }]}
          >
            <Input suffix={<Button>Проверить</Button>} />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Номер телефона"
            rules={[{ required: true, min: 12 }]}
          >
            <Input placeholder="998901234567" />
          </Form.Item>
          <Form.Item name="birth_date" label="Дата рождения">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Row gutter={[20]}>
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <Form.Item
                name="password"
                label="Пароль"
                required={[{ required: true, min: 6 }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <Form.Item
                name="password_confirmation"
                label="Подтвердите пароль"
                required={[{ required: true, min: 6 }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminTeacherList;
