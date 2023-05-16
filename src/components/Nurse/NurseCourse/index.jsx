import { Row, Select, Col, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { BiPin, BiUser, BiWindowOpen } from "react-icons/bi";
import { Link } from "react-router-dom";
import "./style.scss";
import { api } from "../../../utils/api";
import { BsBookmarks, BsFillPinAngleFill, BsPin } from "react-icons/bs";
import { FaUserMd } from "react-icons/fa";
import { MdStarRate } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";

const NurseCourse = () => {
  const [category, setCategory] = useState([]);
  const [course, setCourse] = useState(false);
  const [categoryId, setCategoryId] = useState(
    sessionStorage.getItem("catId") ?? ""
  );
  const [loadingCard, setLoadingCard] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: sessionStorage.getItem("current_page") ?? 1,
    per_page: sessionStorage.getItem("per_page") ?? 15,
    total: 15,
  });

  // getCategoryforSelect
  const getCategoryforSelect = async () => {
    const res = await api.get("api/select/category");
    try {
      setCategory(
        res.data.map((item) => {
          return {
            key: item.id,
            label: item.name,
            value: String(item.id),
          };
        })
      );
    } catch (err) {
      console.log(err, "err");
    }
  };

  const handleChange = (value) => {
    setCategoryId(value);
    sessionStorage.setItem("catId", value);
    getCourse(value, 1, 15);
  };

  function getCourse(id, page, per_page) {
    setLoadingCard(true);
    const params = {
      page,
      per_page,
    };
    api.get(`api/nurse/course/list/category/${id}`, { params }).then((res) => {
      setCourse(
        res.data.data.map((item, key) => {
          let num = key + 1;
          let user_name = item.user.first_name + " " + item.user.last_name;
          return {
            num: num,
            id: item.id,
            key: key,
            name: item.name,
            teacher: user_name,
            count_tema: item.subject_count,
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
      sessionStorage.setItem("current_page", res.data.current_page);
      sessionStorage.setItem("per_page", res.data.per_page);
      setLoadingCard(false);
    });
  }

  // handleAddCourse
  const handleAddCourse = async (id) => {
    console.log(id, "id");
    try {
      const body = {
        course_id: id,
      };
      const res = await api.post("api/nurse/course/add", body);
      res.status===200 && toast.success('Добавлено!')
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    {
      title: "№",
      dataIndex: "num",
      key: "num",
      align: "center",
      width: "2%",
    },
    {
      title: "Kurs nomi",
      dataIndex: "name",
      key: "text",
      render: (t) => {
        return (
          <p className="d-flex align-center gap-1">
            <BsBookmarks style={{ fontSize: "16px", fill: "#1389f8" }} /> {t}
          </p>
        );
      },
    },
    {
      title: "O'qituvchi",
      dataIndex: "teacher",
      key: "teacher",
      width: "20%",
      align: "center",
      render: (t) => {
        return (
          <p className="d-flex align-center gap-1">
            <FaUserMd style={{ fontSize: "16px", fill: "grey" }} /> {t}
          </p>
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
      title: "Mavzular soni",
      dataIndex: "count_tema",
      key: "count_tema",
      width: "10%",
      align: "center",
    },

    {
      title: "Ba'tafsil",
      dataIndex: "action",
      key: "action",
      align: "center",
      width: "10%",
      render: (text, record) => (
        <div className="d-flex align-center justify-evenly ">
          <Tooltip title="Biriktirish">
            <BsFillPinAngleFill
              onClick={() => handleAddCourse(record.id)}
              style={{ fill: "red", fontSize: "18px", cursor: "pointer" }}
            />
          </Tooltip>
          <Tooltip title="Batafsil">
            <Link to={`/nurse/course/${record.id}`}>
              <BiWindowOpen style={{ fontSize: "18px" }} />
            </Link>
          </Tooltip>
        </div>
      ),
    },
  ];

  useEffect(() => {
    categoryId &&
      getCourse(
        categoryId,
        pagination.current_page,
        pagination.per_page,
        pagination.total
      );
    getCategoryforSelect();
  }, []);

  return (
    <>
      <Row gutter={24}>
        <Col span={24} style={{ position: "sticky", top: "0" }}>
          <Select
            className="subject_select"
            placeholder="Yo`nalishni tanlang"
            onChange={handleChange}
            options={category}
            value={String(categoryId)}
          />
        </Col>
        <Col span={24}>
          {course ? (
            <Table
              bordered
              style={{ height: "100%" }}
              loading={loadingCard}
              columns={columns}
              dataSource={course}
              pagination={{
                current: pagination.current_page,
                pageSize: pagination.per_page,
                total: pagination.total,
                onChange: (current, pageSize) => {
                  getCourse(categoryId, current, pageSize);
                },
              }}
            />
          ) : (
            <div
              style={{ height: "400px" }}
              className="d-flex align-center justify-center"
            >
              <h1>Yo'nalishni tanglang</h1>
            </div>
          )}
        </Col>
      </Row>
      <ToastContainer/>
    </>
  );
};

export default NurseCourse;
