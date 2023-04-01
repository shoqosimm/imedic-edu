import { Row, Select, Col, Table, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { BiDoorOpen, BiPencil, BiWindowOpen } from "react-icons/bi";
import { Link } from "react-router-dom";
import "./style.scss";
import { api } from "../../../utils/api";

const NurseCourse = () => {
  const [category, setCategory] = useState([]);
  const [course, setCourse] = useState(false);
  const [loadingCard, setLoadingCard] = useState(true);

  // getCategoryforSelect
  const getCategoryforSelect = async () => {
    const res = await api.get("api/select/category");
    try {
      setCategory(
        res.data.map((item) => {
          return {
            key: item.id,
            label: item.name,
            value: item.id,
          };
        })
      );
    } catch (err) {
      console.log(err, "err");
    }
  };

  const handleChange = (value) => {
    getCourse(value);
  };

  function getCourse(id) {
    setLoadingCard(true);
    api.get(`api/nurse/course/list/category/${id}`).then((res) => {
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
          };
        }),
        setLoadingCard(false)
      );
    });
  }

  const columns = [
    {
      title: "№",
      dataIndex: "num",
      key: "num",
      align: "center",
      width: "2%",
    },
    {
      title: "Text",
      dataIndex: "name",
      key: "text",
    },
    {
      title: "Учитель",
      dataIndex: "teacher",
      key: "teacher",
      width: "20%",
      align: "center",
    },
    {
      title: "Кол.темь",
      dataIndex: "count_tema",
      key: "count_tema",
      width: "10%",
      align: "center",
    },

    {
      title: "Подробнее",
      dataIndex: "action",
      key: "action",
      align: "center",
      width: "10%",
      render: (text, record) => (
        <Tooltip title="Подробнее">
          <Link to={`/nurse/course/${record.id}`}>
            <BiWindowOpen style={{ fontSize: "18px" }} />
          </Link>
        </Tooltip>
      ),
    },
  ];

  useEffect(() => {
    getCategoryforSelect();
  }, []);

  return (
    <>
      <Row gutter={24}>
        <Col span={24}>
          <Select
            className="subject_select"
            placeholder="Yo`nalishni tanlang"
            onChange={handleChange}
            options={category}
          />
        </Col>
        <Col span={24}>
          {course ? (
            <Table
              bordered
              scroll={{ x: 400 }}
              style={{ height: "100%" }}
              loading={loadingCard}
              columns={columns}
              dataSource={course}
            />
          ):
            (
              <div style={{height:'400px'}} className="d-flex align-center justify-center">
                  <h1>Выберите категорию...</h1>
              </div>
            )
          }
        </Col>
      </Row>
    </>
  );
};

export default NurseCourse;
