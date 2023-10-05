import React, { useEffect, useState } from "react";
import "./style.scss";
import { Col, DatePicker, Form, Input, Button, Row, Modal } from "antd";
import Swal from "sweetalert2";
import { api } from "../../../utils/api";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TitleText from "../../generics/TitleText";
import { t } from "i18next";

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
          title:t('find'),
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
        title: t('notPinflItem'),
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
        Swal.fire({ icon: "success", title:t('change') });
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
      const res = await api.post(
        `api/user/password-update/${userInfo.id}`,
        body
      );
      if (res) {
        toast.success(t('changed'));
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
          <TitleText title={t('setting')} />
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
                <strong>{t('name')}</strong> {userInfo?.first_name}
              </li>
              <li>
                <strong>{t('surName')}</strong> {userInfo?.last_name}
              </li>
              <li>
                <strong>{t('midName')}</strong> {userInfo?.patronymic}
              </li>
              <li>
                <strong>{t('passportSeries')}</strong> {userInfo?.series}
              </li>
              <li>
                <strong>{t('passportNumber')}</strong> {userInfo?.number}
              </li>
              <li>
                <strong>{t('pinfl')}</strong> {userInfo?.pinfl}
              </li>
              <li>
                <strong>{t('phoneNumber')}</strong> {userInfo?.phone}
              </li>
              <li>
                <strong>{t('birth')}</strong> {userInfo?.birth_date}
              </li>
              <li>
                <Button
                  className="passwordBtn"
                  type="primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  {t('resetPassword')}
                </Button>
              </li>
            </ul>
          </Col>
          <Col className="updateForm" xl={12} lg={12} md={24} sm={24} xs={24}>
            <Row gutter={[20]}>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <Form.Item
                  name="first_name"
                  label={t('name')}
                  rules={[
                    {
                      required: true,
                      message:"nameError",
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
                  label={t('surName')}
                  rules={[
                    {
                      required: true,
                      message: t('surNameError'),
                      whitespace: true,
                    },
                  ]}
                >
                  <Input disabled={disabled} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Form.Item name="patronymic" label={t('midName')}>
                <Input disabled={disabled} />
              </Form.Item>
            </Row>
            <Row gutter={[20]}>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <Form.Item name="series" label={t('passportSeries')}>
                  <Input disabled={disabled} placeholder="AA" />
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={24} sm={24} xs={24}>
                <Form.Item name="number" label= {t('passportNumber')}>
                  <Input disabled={disabled} placeholder="1234567" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="pinfl"
              label={t('pinfl')}
              rules={[
                {
                  required: true,
                  message: t('typingPinfl'),
                  whitespace: true,
                  min: 14,
                  max: 14,
                },
              ]}
            >
              <Input
                className="d-flex align-center"
                disabled={loading}
                placeholder={t('count14')}
                suffix={<Button onClick={getPnflInfo}>{t('check')}</Button>}
              />
            </Form.Item>
            <Form.Item name="phone" label={t('phoneNumber')}>
              <Input
                disabled={loading}
                placeholder="998901234567"
                rules={[
                  {
                    required: true,
                    message: t('typingPhoneNumber'),
                    whitespace: true,
                    min: 12,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item name="birth_date" label={t('birth')}>
              <DatePicker disabled />
            </Form.Item>
            <Button
              htmlType="submit"
              form="settingForm"
              type="primary"
              style={{ width: "100%", margin: "1rem 0", height: "40px" }}
            >
              {t('change')}
            </Button>
          </Col>
        </Row>
        <Modal
          title={t('resetPassword')}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={
            <>
              <Button onClick={() => setIsModalOpen(false)}>
                {t('notSave')}
              </Button>
              <Button type="primary" htmlType="submit" form="passwordUpdate">
                {t('save')}
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
                  label={t('oldPassword')}
                  rules={[
                    {
                      required: true,
                      message:t('newPassword'),
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
                  label={t('newParol')}
                  rules={[
                    {
                      required: true,
                      message: t('newPassword'),
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
                  label={t('passwordConfirmation')}
                  rules={[
                    {
                      required: true,
                      message: t('newPassword'),
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
