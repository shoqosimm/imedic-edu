import React, { useState } from "react";
import "./style.scss";
import { Button, DatePicker, Form, Input, InputNumber } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment/moment";

const Register = () => {
  const [form] = Form.useForm();
  const [loading, setloading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const navigate = useNavigate();

  // handleRegister
  const handleRegister = async (values) => {
    setloading(true);
    const body = {
      ...values,
      birth_date: moment(values.birth_date).format("YYYY-MM-DD"),
    };
    const res = await api.post("api/user/register", body);
    try {
      if (res) {
        toast.success("Успешно", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        setTimeout(() => {
          setloading(false);
          navigate("/login");
        }, 1000);
      }
    } catch (err) {
      console.log(err, "err");
      setloading(false);
      form.resetFields();
    } finally {
      setloading(false);
      form.resetFields();
    }
  };

  // getPnflInfo
  const getPnflInfo = async () => {
    setloading(true);
    const body = {
      pinfl: form.getFieldValue("pinfl"),
    };
    const res = await api.post("api/get-client-by-pinfl", body);
    try {
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

  return (
    <div className="RegisterPage">
      <div className="container form_wrapper">
        <Form
          onFinish={handleRegister}
          autoComplete="false"
          layout="vertical"
          form={form}
          id="registerForm"
        >
          <div className="main_text">
            <h1>Регистрация</h1>
          </div>
          <div>
            <div className="d-flex align-center gap-2">
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
            </div>
            <Form.Item name="patronymic" label="Отчество">
              <Input disabled={disabled} />
            </Form.Item>
            <div className="d-flex align-center gap-2">
              <Form.Item name="series" label="Серия пасспорта">
                <Input disabled={disabled} placeholder="AA" />
              </Form.Item>
              <Form.Item name="number" label="Номер пасспорта">
                <Input disabled={disabled} placeholder="1234567" />
              </Form.Item>
            </div>
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
                className="d-flex align-start"
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
              <DatePicker disabled/>
            </Form.Item>
            <div className="d-flex align-center gap-2">
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
            </div>
          </div>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            style={{ width: "100%", marginTop: "1rem" }}
          >
            Регистрация
          </Button>
          <div className="other__sign">
            <p>
              уже есть аккаунт <Link to="/login">Войти</Link>
            </p>
          </div>
        </Form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
