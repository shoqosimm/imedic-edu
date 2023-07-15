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
import React, { useEffect, useRef, useState } from "react";
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
import * as XLSX from "xlsx";

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
  const [paginationTest, setPaginationTest] = useState({
    current: 1,
    perPage: 10,
    total: 15,
  });
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState();
  const [videoUrl, setVideoUrl] = useState();
  const downloadRef = useRef();
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
  const getSubject = async (id, page, per_page) => {
    setLoading(true);
    const params = {
      page,
      per_page,
    };
    try {
      const res1 = await api.get(`api/teacher/course-subject/show/${id}`);
      const res2 = await api.get(`api/teacher/test/list/${id}`, { params });
      if (res1.data.data.type === "media") {
        res1.data.data?.media
          ?.filter((value) => value.type === "pdf")
          .map((item) => {
            setPdfUrl({ url: `https://api.edu.imedic.uz${item.file_url}` });
          });
        res1.data.data?.media
          ?.filter((value) => value.type === "video")
          .map((item) => {
            setVideoUrl({
              url: `https://api.edu.imedic.uz${item.file_url}`,
            });
          });
      }

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
      setPaginationTest({
        current: res2.data.current_page,
        perPage: res2.data.per_page,
        total: res2.data.total,
      });
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
            getSubject(
              param.id,
              paginationTest.current,
              paginationTest.perPage
            );
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
    const [file] = e.target.files;
    const reader = new FileReader();

    reader.onload = async (evt) => {
      evt.preventDefault();
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "array" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, {
        defval: "",
        raw: false,
        header: 1,
      });
      const excel = data;
      const body = {
        course_subject_id: Number(param.id),
        exel: excel.slice(1).map((item) => {
          return {
            question: item[1],
            from_subject_id: item[0],
            answer: item.slice(2),
          };
        }),
      };
      setLoading(true);
      try {
        const res = await api.post(`api/teacher/test/exel`, body);
        res.status === 200 &&
          toast.success("Загружено", { position: "bottom-right" });
        getSubject(param.id, paginationTest.current, paginationTest.perPage);
      } catch (err) {
        console.log(err, "err");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    getSubject(param.id, paginationTest.current, paginationTest.perPage);
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
            title: <p style={{ color: "grey" }}>{subject?.name}</p>,
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
              {pdfUrl && (
                <>
                  <Button
                    className="d-flex align-center gap-1"
                    style={{ margin: "1rem auto" }}
                  >
                    <AiFillEye style={{ fontSize: "18px" }} />
                    <a href={`${pdfUrl?.url}`} target="_blank">
                      PDF -ni ko'rish
                    </a>
                  </Button>
                  <object
                    data={pdfUrl?.url}
                    width="100%"
                    type="application/pdf"
                    style={{
                      height: "100%",
                      aspectRatio: "1",
                      marginBottom: "1rem",
                    }}
                  ></object>
                </>
              )}
              {videoUrl && (
                <video controls width="100%">
                  <source src={videoUrl?.url} type="video/mp4" />
                </video>
              )}

              {pdfUrl || videoUrl ? null : (
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

                <a
                  className="uploadLabel"
                  href="https://api.edu.imedic.uz/example.xls"
                  target="_blank"
                >
                  <p className="d-flex align-center gap-1">
                    <SiMicrosoftexcel style={{ fontSize: "18px" }} />
                    Образец
                  </p>
                </a>

                {progress && (
                  <Progress size={40} type="circle" percent={progress} />
                )}
              </div>
              <Table
                size="small"
                loading={loading}
                bordered
                columns={columns}
                dataSource={data}
                pagination={{
                  current: paginationTest.current,
                  per_page: paginationTest.perPage,
                  total: paginationTest.total,
                  showSizeChanger:false,
                  onChange: (current, per_page) => {
                    getSubject(param.id, current, per_page);
                  },
                }}
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
      <Card title="Izohlar" className="izohCard" style={{ marginTop: "2rem" }}>
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
