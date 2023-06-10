import {
  Breadcrumb,
  Card,
  Tooltip,
  Modal,
  Progress,
  Skeleton,
  Table,
  Button,
  Spin,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../../../utils/api";
import "./styles/viewSubjectStyle.scss";
import {
  BiCheckCircle,
  BiHome,
  BiNoEntry,
  BiPencil,
  BiSync,
} from "react-icons/bi";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import { SiMicrosoftexcel } from "react-icons/si";
import CommentCard from "../../generics/CommentCard";
import { AiFillEye } from "react-icons/ai";

const ViewSubject = () => {
  const param = useParams();
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [idModal, setIdModal] = useState(null);
  const [subject, setSubject] = useState([]);
  const [data, setData] = useState([]);
  const [progress, setProgress] = useState();
  const location = useLocation();
  const [commentEmptyText, setCommentEmptyText] = useState(false);
  const [comment, setComment] = useState();
  const [paginateComment, setPaginateComment] = useState(12);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      title: "№",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: "5%",
    },
    {
      title: "Savol",
      dataIndex: "question",
      key: "question",
    },
    {
      title: "Yaratilgan",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Yangilangan",
      dataIndex: "updated_at",
      key: "updated_at",
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
      title: "O'zgartirish",
      dataIndex: "edit",
      key: "edit",
      align: "center",
      width: "2%",
      render: (t, record) => {
        return (
          <div className="d-flex align-center justify-around">
            <Tooltip title="Statusni o'zgartirish">
              <BiSync
                onClick={() => {
                  setModal(true);
                  setIdModal(record.id);
                }}
                style={{
                  fontSize: "17px",
                  color: "#1677ff",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
            <Tooltip title="O'zgartirish">
              <BiPencil
                onClick={() =>
                  navigate(`/teacher/subject/edit/test/${record.id}`, {
                    state: { message: param.id },
                  })
                }
                style={{
                  fontSize: "17px",
                  color: "#1677ff",
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          </div>
        );
      },
    },
  ];

  //   getSubject
  const getSubject = async (id) => {
    setLoading(true);
    try {
      const res1 = await api.get(`api/teacher/course-subject/show/${id}`);
      const res2 = await api.get(`api/teacher/test/list/${id}`);
      setSubject(res1.data.data);
      setData(
        res2.data.data.map((item) => {
          return {
            ...item,
            key: item.id,
            id: item.id,
            created_at: moment(item.created_at).format("DD.MM.YYYY HH:mm"),
            updated_at: moment(item.updated_at).format("DD.MM.YYYY HH:mm"),
          };
        })
      );
      getComments(param.id, paginateComment);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  // getComments
  const getComments = (id, newPerPage) => {
    const body = {
      per_page: newPerPage,
      course_subjects_id: param.id ?? id,
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
    getComments(param.id, newPerPage);
    setLoadingBtn(false);
  };

  //   modal
  const handleOk = () => {
    setConfirmLoading(true);
    api
      .get(`api/teacher/test/active/${idModal}`)
      .then((res) => {
        if (res.data.success) {
          setConfirmLoading(false);
          setModal(false);
          toast.success("Изменено");
          setTimeout(() => {
            getSubject(param.id);
          }, 1500);
        }
      })
      .catch((err) => {
        console.log(err);
        setConfirmLoading(false);
      });
  };

  // handleExcel
  const handleExcel = (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);

    api.post(``, formData, {
      onUploadProgress: (data) => {
        setProgress(Math.round((100 * data.loaded) / data.total));
      },
    });
  };

  useEffect(() => {
    getSubject(param.id);
  }, []);

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: "1rem" }}
        items={[
          {
            title: (
              <Link to={`/teacher/course`}>
                <BiHome />
              </Link>
            ),
          },
          {
            title: (
              <Link to={`/teacher/course/${location?.state?.message}/view`}>
                Ortga
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
      {loading ? (
        <Skeleton style={{ margin: "4rem 0" }} />
      ) : location.state.subject_type !== "test" ? (
        <div>
          <Card>
            <Card title="Mavzu" centered="true">
              <p>{subject?.name}</p>
            </Card>
            <Card centered="true">
              {(subject?.type === "pdf" && (
                <>
                  <div
                    style={{
                      margin: "1rem 0",
                      height: "100vh",
                    }}
                  >
                  
                      <Button
                        className="d-flex align-center gap-1"
                        style={{ margin: "1rem auto" }}
                      >
                        <AiFillEye style={{ fontSize: "18px" }} />
                        <a
                          href={`https://api.edu.imedic.uz${subject?.content}`}
                          target="_blank"
                        >
                          PDF -ni ko'rish
                        </a>
                      </Button>
                  
                    <object
                      data={`https://api.edu.imedic.uz${subject?.content}`}
                      width="100%"
                      type="application/pdf"
                      style={{ height: "100%", aspectRatio:"1" }}
                    />
                  </div>
                </>
              )) ||
                (subject?.type === "video" && (
                  <video controls width={"100%"}>
                    <source
                      src={`https://api.edu.imedic.uz${subject?.content}`}
                      type="video/mp4"
                    />
                  </video>
                )) || (
                  <div
                    className="teacher__subject__content"
                    dangerouslySetInnerHTML={{ __html: subject?.content }}
                  />
                )}
            </Card>
          </Card>
        </div>
      ) : (
        <div>
          <Card>
            <Card
              style={{ marginTop: "0" }}
              title={subject?.teaser}
              centered="true"
            >
              <h3>{subject?.name}</h3>
              <div style={{ marginBottom: "2rem" }}>
                <ol>
                  <li>Test soni : {subject?.count_test} ta</li>
                  <li>
                    Minimal o'tish to'gri javob soni : {subject?.right_test} ta
                  </li>
                  <li>Test vaqti : {subject?.time} min</li>
                  <li>
                    Qayta topshirish oraliq vaqti : {subject?.resubmit} min
                  </li>
                </ol>
              </div>
            </Card>
            <Card centered="true" className="cardTable">
              <div
                className="d-flex align-center gap-1"
                style={{ margin: "0.5rem 0" }}
              >
                <label htmlFor="uploadFile" className="uploadLabel">
                  <p className="d-flex align-center gap-1">
                    Excel
                    <SiMicrosoftexcel style={{ fontSize: "18px" }} />
                  </p>
                  <input
                    id="uploadFile"
                    type="file"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={handleExcel}
                  />
                </label>
                {progress && (
                  <Progress size={40} type="circle" percent={progress} />
                )}
              </div>
              <Table
                loading={loading}
                bordered
                columns={columns}
                dataSource={data}
              />
            </Card>
          </Card>

          <Modal
            title={"Status o'zgartirish"}
            open={modal}
            onCancel={() => setModal(false)}
            onOk={handleOk}
            okText="Saqlash"
            cancelText="Bekor qilish"
            confirmLoading={confirmLoading}
          >
            <p>Siz haqiqatdan ham statusni o'zgartirmoqchimisz?</p>
          </Modal>
          <ToastContainer />
        </div>
      )}
      <Card title="Izohlar" className="izohCard">
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
    </>
  );
};
export default ViewSubject;
