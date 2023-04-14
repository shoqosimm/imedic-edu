import { Button, Card, Modal, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { BiCheckCircle, BiNoEntry, BiPencil } from "react-icons/bi";
import { TbEyeTable } from "react-icons/tb";
import { Link } from "react-router-dom";
import { api } from "../../../utils/api";
import "./Indexstyle.scss";
import moment from "moment";
import { AiOutlineSync } from "react-icons/ai";
import "./Indexstyle.scss";

const TeacherCourses = () => {
  const [course, setCourse] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [ModalText, setModalText] = useState(
    "Вы уверены, что хотите изменить статус с активного на неактивный или наоборот?"
  );
  const [idModal, setIdModal] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 15,
    total: 15,
  });
  const columns = [
    {
      title: "№",
      dataIndex: "id",
      key: "id",
      width: "2%",
    },
    {
      title: "Название курса",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Категория",
      dataIndex: "category",
      key: "category",
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
      title: "Действия",
      dataIndex: "action",
      key: "action",
      align: "center",
      width: "5%",
      render: (text, record) => (
        <div className="d-flex justify-center  align-center gap-x-3">
          <Tooltip title="Изменить">
            <Link to={`/teacher/course/${record.key}/edit`}>
              <BiPencil style={{ color: "#1677ff", fontSize: "16px" }} />
            </Link>
          </Tooltip>
          <Tooltip title="Изменить cтатус">
            <Link>
              <AiOutlineSync
                style={{ color: "#1677ff", fontSize: "18px" }}
                onClick={() => {
                  showModal(record);
                }}
              />
            </Link>
          </Tooltip>
          <Tooltip title="Подробнее">
            <Link to={`/teacher/course/${record.key}/view`}>
              <TbEyeTable style={{ color: "#1677ff", fontSize: "16px" }} />
            </Link>
          </Tooltip>
        </div>
      ),
    },
  ];

  // modal-for-delete
  const showModal = (value) => {
    setModalOpen(true);
    setIdModal(value.key);
  };
  const handleOk = () => {
    setConfirmLoading(true);
    setModalText("Загрузка...");
    api
      .get(`api/teacher/course/active/${idModal}`)
      .then((res) => {
        if (res.data.success) {
          setTimeout(() => {
            setModalOpen(false);
            setConfirmLoading(false);
            getCourse();
          }, 1500);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // getCourse
  const getCourse = (current_page, per_page) => {
    setLoadingTable(true);
    const params = {
      current_page,
      per_page,
    };
    api
      .get("api/teacher/course/list", { params })
      .then((res) => {
        setLoadingTable(false);
        if (res.status === 200) {
          setCourse(
            res.data.data.map((item) => {
              return {
                ...item,
                key: item.id,
                name: item.name,
                category: item.category.name,
              };
            })
          );
          setPagination({
            current_page: res.data.current_page,
            per_page: res.data.per_page,
            total: res.data.total,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoadingTable(false));
  };

  useEffect(() => {
    getCourse(pagination.current_page, pagination.per_page);
  }, []);

  return (
    <>
      <div
        style={{ marginBottom: "1.5rem", flexWrap: "wrap" }}
        className="d-flex align-center justify-between gap-y-2"
      >
        <h1>Список курсов</h1>
        <Link to="/teacher/course/create">
          <Button type="primary">Создать курс</Button>
        </Link>
      </div>
      <Card>
        <Table 
        bordered
          loading={loadingTable}
          columns={columns}
          dataSource={course}
          pagination={{
            current: pagination.current_page,
            pageSize: pagination.per_page,
            total: pagination.total,
            onChange: (current, pageSize) => {
              getCourse(current, pageSize);
            },
          }}
        />
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
    </>
  );
};

export default TeacherCourses;
