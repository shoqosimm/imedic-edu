import {
  Breadcrumb,
  Card,
  Input,
  Modal,
  Progress,
  Skeleton,
  Table,
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
      title: "Вопрос",
      dataIndex: "question",
      key: "question",
    },
    {
      title: "Создано",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Обновлено",
      dataIndex: "updated_at",
      key: "updated_at",
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
      title: "Изменить",
      dataIndex: "edit",
      key: "edit",
      align: "center",
      width: "2%",
      render: (t, record) => {
        return (
          <div className="d-flex align-center justify-around">
            <BiSync
              onClick={() => {
                setModal(true);
                setIdModal(record.id);
              }}
              style={{ fontSize: "17px", color: "#1677ff", cursor: "pointer" }}
            />
            <BiPencil
              onClick={() =>
                navigate(`/teacher/subject/edit/test/${record.id}`, {
                  state: { message: param.id },
                })
              }
              style={{ fontSize: "17px", color: "#1677ff", cursor: "pointer" }}
            />
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
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
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
                Назад
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
          <Card >
            <Card title="Тема" centered="true">
              <p>{subject?.name}</p>
            </Card>
            <Card centered="true">
              <div dangerouslySetInnerHTML={{ __html: subject?.content }} />
            </Card>
          </Card>
        </div>
      ) : (
        <div>
          <Card >
            <Card style={{marginTop:'0'}} title={subject?.teaser} centered="true">
              <h3>{subject?.name}</h3>
              <div style={{ marginBottom: "2rem" }}>
                <ol>
                  <li>Количество теста : {subject?.count_test} шт</li>
                  <li>Количество мин.прохождение : {subject?.right_test} шт</li>
                  <li>Время теста : {subject?.time} мин</li>
                  <li>Время для перездачи теста : {subject?.resubmit} мин</li>
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
            title={"Изменить статус"}
            open={modal}
            onCancel={() => setModal(false)}
            onOk={handleOk}
            okText="Изменить"
            cancelText="Отменить"
            confirmLoading={confirmLoading}
          >
            <p>
              Вы уверены, что хотите изменить статус с активного на неактивный
              или наоборот?
            </p>
          </Modal>
          <ToastContainer />
        </div>
      )}
    </>
  );
};
export default ViewSubject;
