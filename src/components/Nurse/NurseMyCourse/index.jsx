import { Card, Col, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../../utils/api";
import "./style.scss";
import { BiWindowOpen } from "react-icons/bi";

const NurseMyCourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
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
      title: "Курс",
      dataIndex: "name",
      key: "name",
      render: (t) => {
        return <p>{t.name}</p>;
      },
    },
    {
      title: "Категория",
      dataIndex: "category",
      key: "category",
      render: (t) => {
        return <p>{t.name}</p>;
      },
    },
    {
      title: "Учитель",
      dataIndex: "user",
      key: "user",
      render: (t) => {
        return (
          <p>
            {t.first_name}, {t.last_name}
          </p>
        );
      },
    },

    {
      title: "Процент",
      dataIndex: "percent",
      key: "percent",
      align: "center",
      width: "2%",
      render: (t) => {
        return <p>{t} %</p>;
      },
    },
    {
      title: "Процент",
      dataIndex: "view",
      key: "view",
      align: "center",
      width: "5%",
      render: (t, record) => {
        return (
          <Link to={`/nurse/mycourse/${record.id}`}>
            <BiWindowOpen style={{ fontSize: "18px" }} />
          </Link>
        );
      },
    },
  ];
  // getCourseList
  const getCourseList = (current_page, per_page) => {
    setLoading(true);
    const params = {
      current_page,
      per_page,
    };
    api
      .get("api/nurse/course/list", { params })
      .then((res) => {
        setCourses(
          res.data.data.map((item) => {
            return {
              ...item,
              key: item.id,
              name: item.course,
              category: item.category,
              user: item.user,
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
  }, []);

  return (
    <Row className="mycourse__wrapper">
      <Col span={24}>
        <Card title="Мои курсы">
          <Table
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
        </Card>
      </Col>
    </Row>
  );
};

export default NurseMyCourseList;
