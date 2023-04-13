import React, { useEffect, useState } from "react";
import "./style.scss";
import { Col, DatePicker, Form, Input, Button, Row, Modal } from "antd";
import Swal from "sweetalert2";
import { api } from "../../../utils/api";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeacherSetting = () => {
  const [form] = Form.useForm();
  const [formPassword] = Form.useForm();
  const [loading, setloading] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [disabled, setDisabled] = useState(true);

  // getUserInfo
  const getUserInfo = async () => {
    try {
      const res = await api.get("api/user/me");
      setUserInfo(res.data);
    } catch (err) {
      console.log(err, "err");
    }
  };

  // getPnflInfo
  const getPnflInfo = async () => {
    setloading(true);
    const body = {
      pinfl: form.getFieldValue("pinfl"),
    };
    try {
      const res = await api.post("api/get-client-by-pinfl", body);
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Найдено",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        form.setFieldsValue({
          birth_date: moment(res.data.birth_date),
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          number: res.data.number,
          patronymic: res.data.patronymic,
          pinfl: res.data.pinfl,
          series: res.data.series,
        });
        setDisabled(true);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Не найдено",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      console.log(err, "err");
      setloading(false);
    } finally {
      setloading(false);
    }
  };

  // handleUpdateInfo
  const handleUpdateInfo = async (values) => {
    setloading(true);
    const body = {
      ...values,
      birth_date: moment(values.birth_date).format("YYYY-MM-DD"),
    };
    try {
      const res = await api.post(`api/user/update/${userInfo.id}`, body);
      if (res) {
        Swal.fire({ icon: "success", title: "Изменено!" });
        getUserInfo();
      }
    } catch (err) {
      console.log(err, "err");
    } finally {
      setloading(false);
      form.resetFields();
    }
  };

  // handlePassword
  const handlePassword = async (values) => {
    const body = values;
    try {
      const res = await api.post(`api/user/password-update/${userInfo.id}`, body);
      if (res) {
        toast.success("Изменено!");
        setIsModalOpen(false);
      }
    } catch (err) {
      console.log(err, "err");
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className="setting">
      <Form
        form={form}
        id="settingForm"
        layout="vertical"
        onFinish={handleUpdateInfo}
      >
        <Row className="d-flex align-start justify-between" gutter={[20, 20]}>
          <Col
            className="settingTextPanel"
            xl={10}
            lg={10}
            md={24}
            sm={24}
            xs={24}
          >
            <ul>
              <li>
                <strong>Имя:</strong> {userInfo?.first_name}
              </li>
              <li>
                <strong>Фамилия:</strong> {userInfo?.last_name}
              </li>
              <li>
                <strong>Отчество:</strong> {userInfo?.patronymic}
              </li>
              <li>
                <strong>Серия пасспорта:</strong> {userInfo?.series}
              </li>
              <li>
                <strong>Номер пасспорта:</strong> {userInfo?.number}
              </li>
              <li>
                <strong>ПНФЛ:</strong> {userInfo?.pinfl}
              </li>
              <li>
                <strong>Номер телефона:</strong> {userInfo?.phone}
              </li>
              <li>
                <strong>Дата рождения:</strong> {userInfo?.birth_date}
              </li>
              <li>
                <Button
                  className="passwordBtn"
                  type="primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  Изменить пароль
                </Button>
              </li>
            </ul>
          </Col>
          <Col className="updateForm" xl={12} lg={12} md={24} sm={24} xs={24}>
            <Row gutter={[20]}>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <Form.Item
                  name="first_name"
                  label="Имя"
                  rules={[
                    {
                      required: true,
                      message: "Не указань или указан неправильно",
                      whitespace: true,
                    },
                  ]}
                >
                  <Input disabled={disabled} />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <Form.Item
                  name="last_name"
                  label="Фамилия"
                  rules={[
                    {
                      required: true,
                      message: "Не указань или указан неправильно",
                      whitespace: true,
                    },
                  ]}
                >
                  <Input disabled={disabled} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Form.Item name="patronymic" label="Отчество">
                <Input disabled={disabled} />
              </Form.Item>
            </Row>
            <Row gutter={[20]}>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <Form.Item name="series" label="Серия пасспорта">
                  <Input disabled={disabled} placeholder="AA" />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <Form.Item name="number" label="Номер пасспорта">
                  <Input disabled={disabled} placeholder="1234567" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="pinfl"
              label="ПНФЛ"
              rules={[
                {
                  required: true,
                  message: "Введите ПНФЛ",
                  whitespace: true,
                  min: 14,
                  max: 14,
                },
              ]}
            >
              <Input
                className="d-flex align-center"
                disabled={loading}
                placeholder="14 цифр"
                suffix={<Button onClick={getPnflInfo}>Проверить</Button>}
              />
            </Form.Item>
            <Form.Item name="phone" label="Номер телефона">
              <Input
                disabled={loading}
                placeholder="998901234567"
                rules={[
                  {
                    required: true,
                    message: "Введите номер телефона",
                    whitespace: true,
                    min: 12,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item name="birth_date" label="Дата рождения">
              <DatePicker disabled />
            </Form.Item>
            <Button
              htmlType="submit"
              form="settingForm"
              type="primary"
              style={{ width: "100%", margin: "1rem 0", height: "40px" }}
            >
              Изменить
            </Button>
          </Col>
        </Row>
        <Modal
          title="Изменить пароль"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={
            <>
              <Button onClick={() => setIsModalOpen(false)}>Отменить</Button>
              <Button type="primary" htmlType="submit" form="passwordUpdate">
                Изменить
              </Button>
            </>
          }
        >
          <Form
            onFinish={handlePassword}
            form={formPassword}
            id="passwordUpdate"
            layout="vertical"
          >
            <Row
              style={{ margin: "1rem 0" }}
              className="passwordUpdate"
              gutter={[20]}
            >
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <Form.Item
                  name="old_password"
                  label="Старый пароль"
                  rules={[
                    {
                      required: true,
                      message: "Введите пароль",
                      whitespace: true,
                      min: 6,
                    },
                  ]}
                >
                  <Input disabled={loading} type="password" />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <Form.Item
                  name="password"
                  label="Пароль"
                  rules={[
                    {
                      required: true,
                      message: "Введите пароль",
                      whitespace: true,
                      min: 6,
                    },
                  ]}
                >
                  <Input disabled={loading} type="password" />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <Form.Item
                  name="password_confirmation"
                  label="Подтвердите пароль"
                  rules={[
                    {
                      required: true,
                      message: "Введите пароль",
                      whitespace: true,
                      min: 6,
                    },
                  ]}
                >
                  <Input disabled={loading} type="password" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default TeacherSetting;

// import React from "react";
// import "./style.scss";

// const TeacherSetting = () => {
//   return (
//     <div>
//       <h1>Teacher Setting</h1>
//     </div>
//   );
// };

// export default TeacherSetting;
