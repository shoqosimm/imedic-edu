import { Button, Card, Modal, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { BiCheckCircle, BiNoEntry, BiPencil, BiUser } from "react-icons/bi";
import { TbEyeTable } from "react-icons/tb";
import { Link } from "react-router-dom";
import { api } from "../../../utils/api";
import "./Indexstyle.scss";
import moment from "moment";
import { AiOutlineSync } from "react-icons/ai";
import "./Indexstyle.scss";
import { MdStarRate } from "react-icons/md";

const TeacherCourses = () => {
  const [course, setCourse] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [ModalText, setModalText] = useState(
    "Siz haqiqatdan ham ushbu kursni statusini o'zgartirmoqchimisz?"
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
      title: "Kursning nomi",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Turkum",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Status",
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
      title: "Reyting",
      dataIndex: "rate",
      key: "rate",
      align: "center",
      render: (t) => {
        return (
          <div className="d-flex align-center justify-center gap-x-1">
            <Tooltip title="o'rtacha baho">
              <div className="d-flex align-center gap-1">
                {new Intl.NumberFormat("en").format(t?.average_rate ?? "0")}
                <MdStarRate style={{ fill: "orangered", fontSize: "18px" }} />
              </div>
            </Tooltip>
            {"-"}
            <Tooltip title="baho qo'yganlar soni">
              <div className="d-flex align-center gap-1">
                {new Intl.NumberFormat("en").format(t?.rate_count ?? "0")}
                <BiUser />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Yaratilgan",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => {
        return moment(text).format("DD.MM.YYYY HH:mm");
      },
    },
    {
      title: "Ba'tafsil",
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
    setModalText("Yuklanmoqda...");
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
  const getCourse = (page, per_page) => {
    setLoadingTable(true);
    const params = {
      page,
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
                rate: {
                  average_rate: item.average_rate,
                  rate_count: item.rate_count,
                },
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
        <p style={{ fontSize: "20px", fontWeight: "600" }}>Kurslar</p>
        <Link to="/teacher/course/create">
          <Button type="primary">Kurs yaratish</Button>
        </Link>
      </div>
      <Card>
        <Table
          size={"small"}
          bordered
          loading={loadingTable}
          columns={columns}
          dataSource={course}
          pagination={{
            current_page: pagination.current_page,
            per_page: pagination.per_page,
            total: pagination.total,
            onChange: (current_page, per_page) => {
              getCourse(current_page, per_page);
            },
          }}
        />
      </Card>
      <Modal
        title={"Statusni o'zgartirish"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
        okText="Saqlash"
        cancelText="Bekor qilish"
        confirmLoading={confirmLoading}
      >
        <p>{ModalText}</p>
      </Modal>
    </>
  );
};

export default TeacherCourses;
