import { Card, Space, Table, Modal, Button, Breadcrumb, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import {
  BiCheckCircle,
  BiHome,
  BiNoEntry,
  BiPencil,
  BiPlus,
  BiPlusCircle,
  BiTrash,
  BiWindowOpen,
} from "react-icons/bi";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "../../../utils/api";
import { Notification } from "../../Notification/Notification";
import "./styles/viewStyle.scss";
import { AiOutlineSync } from "react-icons/ai";
import moment from "moment";

const ViewCourse = () => {
  const params = useParams();
  const [course, setCourse] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [ModalText, setModalText] = useState(
    "Вы уверены, что хотите изменить статус с активного на неактивный или наоборот?"
  );
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idModal, setIdModal] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const columns = [
    {
      title: "№",
      dataIndex: "id",
      key: "id",
      width: "5%",
    },
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Описание",
      dataIndex: "teaser",
      key: "teaser",
    },
    {
      title: "Статус",
      dataIndex: "is_active",
      key: "is_active",
      align: "center",
      render: (text) => {
        return text == 1 ? (
          <BiCheckCircle style={{ fontSize: "18px", fill: "green" }} />
        ) : (
          <BiNoEntry style={{ fontSize: "18px", fill: "red" }} />
        );
      },
    },
    {
      title: "Создано",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => {
        return moment(text).format("DD.MM.YYYY HH:mm");
      },
    },
    {
      title: "Тип",
      dataIndex: "subject_type",
      key: "subject_type",
      align: "center",
    },
    {
      title: "Действие",
      dataIndex: "action",
      key: "action",
      align: "end",
      width: "5%",
      render: (text, record) =>
        record.subject_type == "topic" ? (
          <Space size="middle">
            <Tooltip title="Изменить">
              <BiPencil className="iconView" onClick={() => edit(record)} />
            </Tooltip>
            <Tooltip title="Изменить статус">
              <AiOutlineSync
                className="iconView"
                onClick={() => showModal(record)}
              />
            </Tooltip>
            <Tooltip title="Посмотреть">
              <BiWindowOpen className="iconView" onClick={() => view(record)} />
            </Tooltip>
          </Space>
        ) : (
          <Space size="middle">
            <Tooltip title="Добавить">
              <BiPlusCircle
                className="iconView"
                onClick={() =>
                  navigate(`/teacher/subject/create/test/${record.key}`, {
                    state: {
                      message: params.id,
                      subject_type: record.subject_type,
                    },
                  })
                }
              />
            </Tooltip>
            <Tooltip title="Изменить">
              <BiPencil className="iconView" onClick={() => edit(record)} />
            </Tooltip>
            <Tooltip title="Удалить">
              <AiOutlineSync
                className="iconView"
                onClick={() => showModal(record)}
              />
            </Tooltip>
            <Tooltip title="Посмотреть">
              <BiWindowOpen className="iconView" onClick={() => view(record)} />
            </Tooltip>
          </Space>
        ),
    },
  ];

  //   getCourse
  const getCourse = (id) => {
    api
      .get(`api/teacher/course/show/${id}`)
      .then((res) => {
        setCourse(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //   getSubjects
  const getSubjects = (id) => {
    setLoading(true);
    api
      .get(`api/teacher/course-subject/list/${id}`)
      .then((res) => {
        setSubjects(
          res.data.data.map((item) => {
            return {
              ...item,
              key: item.id,
              name: item.name,
              teaser: item.teaser,
              subject_type: item.subject_type,
            };
          })
        );
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const showModal = (record) => {
    setModalOpen(true);
    setIdModal(record.key);
  };

  const edit = (record) => {
    navigate(`/teacher/subject/edit/${record.id}`, {
      state: { message: params.id, subject_type: record.subject_type },
    });
  };

  const view = (record) => {
    navigate(`/teacher/subject/view/${record.key}`, {
      state: { message: params.id, subject_type: record.subject_type },
    });
  };

  //   modal
  const handleOk = () => {
    setConfirmLoading(true);
    setModalText("Загрузка...");
    api
      .get(`/api/teacher/course-subject/active/${idModal}`)
      .then((res) => {
        if (res.data.success) {
          setTimeout(() => {
            setModalOpen(false);
            setConfirmLoading(false);
            Notification();
            getSubjects(params.id);
          }, 1500);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCourse(params.id);
    getSubjects(params.id);
  }, []);

  return (
    <div className="viewCourse_teacher">
      <Breadcrumb
        style={{ marginBottom: "1rem" }}
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
      <Card title={course.name}>
        <Card
          className="inside_card"
          title="Список"
          extra={
            <Button
              type="primary"
              className="d-flex align-center gap-1"
              icon={<BiPlus />}
              onClick={() =>
                navigate(`/teacher/subject/create/${course.id}`, {
                  state: { message: params.id },
                })
              }
            >
              Boshlash
            </Button>
          }
        >
          <Table loading={loading} bordered columns={columns} dataSource={subjects} />
        </Card>
      </Card>
      <Modal
        title={"Изменить статус"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
        okText="Изменить"
        cancelText="Отменить"
        confirmLoading={confirmLoading}
      >
        <p>{ModalText}</p>
      </Modal>
    </div>
  );
};
export default ViewCourse;
