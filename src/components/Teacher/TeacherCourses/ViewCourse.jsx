import {
  Card,
  Space,
  Table,
  Modal,
  Button,
  Breadcrumb,
  Tooltip,
  Spin,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  BiCheckCircle,
  BiHome,
  BiNoEntry,
  BiPencil,
  BiPlus,
  BiPlusCircle,
  BiUser,
  BiWindowOpen,
} from "react-icons/bi";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "../../../utils/api";
import { Notification } from "../../Notification/Notification";
import "./styles/viewStyle.scss";
import { AiOutlineSync } from "react-icons/ai";
import moment from "moment";
import CommentCard from "../../generics/CommentCard";
import { MdStarRate } from "react-icons/md";
import { ToastContainer } from "react-toastify";

const ViewCourse = () => {
  const params = useParams();
  const [course, setCourse] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [ModalText, setModalText] = useState(
    "Siz haqiqatdan ham ushbu kursni statusini o'zgartirmoqchimisiz?"
  );
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idModal, setIdModal] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [comment, setComment] = useState();
  const [commentEmptyText, setCommentEmptyText] = useState(false);
  const [paginateComment, setPaginateComment] = useState(12);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: sessionStorage.getItem("current_page") ?? "1",
    per_page: 10,
    total: 15,
  });
  const columns = [
    {
      title: "№",
      dataIndex: "id",
      key: "id",
      width: "5%",
    },
    {
      title: "Mavzular nomi",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tavsif",
      dataIndex: "teaser",
      key: "teaser",
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
      title: "Tur",
      dataIndex: "subject_type",
      key: "subject_type",
      align: "center",
    },
    {
      title: "Ba'tafsil",
      dataIndex: "action",
      key: "action",
      align: "end",
      width: "5%",
      render: (text, record) =>
        record.subject_type == "topic" ? (
          <Space size="middle">
            <Tooltip title="O'zgartirish">
              <BiPencil className="iconView" onClick={() => edit(record)} />
            </Tooltip>
            <Tooltip title="Statusni o'zgartirish">
              <AiOutlineSync
                className="iconView"
                onClick={() => showModal(record)}
              />
            </Tooltip>
            <Tooltip title="Ko'rish">
              <BiWindowOpen className="iconView" onClick={() => view(record)} />
            </Tooltip>
          </Space>
        ) : (
          <Space size="middle">
            <Tooltip title="Test qo'shish">
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
            <Tooltip title="O'zgartirish">
              <BiPencil className="iconView" onClick={() => edit(record)} />
            </Tooltip>
            <Tooltip title="Statusni o'zgartirish">
              <AiOutlineSync
                className="iconView"
                onClick={() => showModal(record)}
              />
            </Tooltip>
            <Tooltip title="Ko'rish">
              <BiWindowOpen className="iconView" onClick={() => view(record)} />
            </Tooltip>
          </Space>
        ),
    },
  ];

  // getComments
  const getComments = (id, newPerPage) => {
    const body = {
      per_page: newPerPage,
      course_id: params.id ?? id,
    };
    api
      .post("api/receive-comment", body)
      .then((res) => {
        if (res.data.data.length > 0) {
          setComment(res.data.data);
        } else {
          setCommentEmptyText("Ushbu kurs bo'yicha izohlar mavjud emas...");
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  // handleMoreComment
  const handleMoreComment = () => {
    setLoadingBtn(true);
    const newPerPage = paginateComment + 12;
    setPaginateComment(newPerPage);
    getComments(params.id, newPerPage);
    setLoadingBtn(false);
  };

  //   getCourse
  const getCourse = (id) => {
    api
      .get(`api/teacher/course/show/${id}`)
      .then((res) => {
        setCourse(res.data);
        getComments(params.id, paginateComment);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //   getSubjects
  const getSubjects = (id, page, per_page) => {
    setLoading(true);
    api
      .get(`api/teacher/course-subject/list/${id}`, {
        params: { page, per_page },
      })
      .then((res) => {
        setSubjects(
          res.data.data.map((item) => {
            return {
              ...item,
              key: item.id,
              name: item.name,
              teaser: item.teaser,
              subject_type: item.subject_type,
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
    api
      .get(`/api/teacher/course-subject/active/${idModal}`)
      .then((res) => {
        if (res.data.success) {
          setTimeout(() => {
            setModalOpen(false);
            setConfirmLoading(false);
            Notification();
            getSubjects(
              params.id,
              pagination.current_page,
              pagination.per_page
            );
          }, 1500);
        }
        setConfirmLoading(false);
      })
      .catch((err) => {
        setConfirmLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    getCourse(params.id);
    getSubjects(params.id, pagination.current_page, pagination.per_page);

    return () => {
      sessionStorage.removeItem("current_page");
    };
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
          title={
            <div
              style={{ flexWrap: "wrap", padding: "0.5rem 0" }}
              className="d-flex align-center justify-between gap-1"
            >
              Ro'yxat
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
                Yaratish
              </Button>
            </div>
          }
        >
          <Table
            size="small"
            loading={loading}
            bordered
            columns={columns}
            dataSource={subjects}
            pagination={{
              current_page: pagination.current_page,
              per_page: pagination.per_page,
              total: pagination.total,
              onChange: (current_page, per_page) => {
                getSubjects(params.id, current_page, per_page);
                sessionStorage.setItem("current_page", current_page);
              },
            }}
          />
        </Card>
      </Card>
      <Card title="Kursga oid izohlar" className="izohCard">
        {loading && <Spin />}
        {commentEmptyText && (
          <em
            style={{
              display: "block",
              margin: "2rem 0",
              textAlign: "center",
              color: "grey",
            }}
          >
            {commentEmptyText}
          </em>
        )}
        {comment?.map((item) => {
          return <CommentCard key={item.id} data={item} />;
        })}
        <Button
          disabled={commentEmptyText ? true : false}
          onClick={handleMoreComment}
          loading={loadingBtn}
        >
          Ko'proq ko'rsatish
        </Button>
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
      <ToastContainer />
    </div>
  );
};
export default ViewCourse;
