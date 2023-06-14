import { Card, Col, Row, Slider, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../utils/api";
import "./style.scss";
import { BiBookBookmark, BiUser, BiWindowOpen } from "react-icons/bi";
import { MdStarRate } from "react-icons/md";
import { FaUserMd } from "react-icons/fa";
import { BsBookmarks } from "react-icons/bs";
import TitleText from "../../generics/TitleText";

const NurseMyCourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const controller = new AbortController();
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 15,
    total: 10,
  });
  const columns = [
    {
      title: "№",
      dataIndex: "id",
      key: "id",
      width: "2%",
      align: "center",
    },
    {
      title: "Kurs nomi",
      dataIndex: "name",
      key: "name",
      render: (t) => {
        return (
          <div className="d-flex align-center gap-1">
            <BsBookmarks
              style={{ fontSize: "16px", fill: "teal", flex: "0.1" }}
            />
            <p style={{ flex: "1" }}>{t.name}</p>
          </div>
        );
      },
    },
    {
      title: "Turkum",
      dataIndex: "category",
      key: "category",
      render: (t) => {
        return (
          <div className="d-flex align-center gap-1">
            <BiBookBookmark
              style={{ fontSize: "16px", fill: "#353595", flex: "0.1" }}
            />
            <p style={{ flex: "1" }}>{t.name}</p>
          </div>
        );
      },
    },
    {
      title: "O'qituvchi",
      dataIndex: "user",
      key: "user",
      render: (t) => {
        return (
          <div className="d-flex align-center gap-1">
            <FaUserMd style={{ fontSize: "16px", fill: "#254545" }} />
            <p>
              {t.first_name}, {t.last_name}
            </p>
          </div>
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
      title: "Bajarilgan",
      dataIndex: "percent",
      key: "percent",
      align: "center",
      width: "2%",
      render: (t) => {
        return (
          <>
            {t === 100 ? (
              <>
                <p>{t} %</p>
                <Slider
                  style={{ margin: "0" }}
                  trackStyle={{ background: "green", height: "6px" }}
                  value={t}
                  handleStyle={{ display: "none" }}
                />
              </>
            ) : (
              <>
                <p>{t} %</p>
                <Slider
                  style={{ margin: "0" }}
                  trackStyle={{ background: "#ffc107", height: "6px" }}
                  value={t}
                  handleStyle={{ display: "none" }}
                />
              </>
            )}
          </>
        );
      },
    },
    {
      title: "Ba'tafsil",
      dataIndex: "view",
      key: "view",
      align: "center",
      width: "5%",
      render: (t, record) => {
        return (
          <Link to={`/nurse/mycourse/${record.id}`}>
            <BiWindowOpen
              style={{ fontSize: "18px", fill: "rgb(14 14 171)" }}
            />
          </Link>
        );
      },
    },
  ];
  // getCourseList
  const getCourseList = (page, per_page) => {
    setLoading(true);
    const params = {
      page,
      per_page,
    };
    api
      .get("api/nurse/course/list", { params }, { signal: controller.signal })
      .then((res) => {
        setCourses(
          res.data.data.map((item) => {
            return {
              ...item,
              key: item.id,
              name: item.course,
              category: item.category,
              user: item.course.user,
              rate: item.course,
            };
          })
        );
        setLoading(false);
        setPagination({
          current_page: res.data.current_page,
          per_page: res.data.per_page,
          total: res.data.total,
        });
      })
      .catch((err) => {
        console.log(err, "err");
        setLoading(false);
      });
  };

  useEffect(() => {
    getCourseList(1, 15);

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <Row className="mycourse__wrapper">
      <Col span={24}>
        <TitleText title={"Mening kurslarim"} />
        <Table
          size="small"
          pagination={{
            current: pagination.current_page,
            pageSize: pagination.per_page,
            total: pagination.total,
            onChange: (current, pageSize) => {
              getCourseList(categoryId, current, pageSize);
            },
          }}
          loading={loading}
          bordered
          columns={columns}
          dataSource={courses}
        />
      </Col>
    </Row>
  );
};

export default NurseMyCourseList;
