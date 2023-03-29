import { Row, Select, Col, Table } from "antd";
import React, { useEffect, useState } from "react";
import { BiPencil } from "react-icons/bi";
import { Link } from "react-router-dom";
import "./style.scss";
import { api } from "../../../utils/api";

const NurseCourse = () => {
  const [category, setCategory] = useState([]);
  const [course, setCourse] = useState([]);
  const [loadingCard, setLoadingCard] = useState(true);
  const [ran, setRan] = useState([
    {
      id: 101,
      count: 10,
      is_active: 1,
      teacher: "Kim Cha Xon",
      text: "Test text number 1",
    },
    {
      id: 2,
      count: 8,
      is_active: 0,
      teacher: "Kim Mo Xon",
      text: "Test text number 2",
    },
    {
      id: 2,
      count: 8,
      is_active: 0,
      teacher: "Kim Mo Xon",
      text: "Test text number 2",
    },
  ]);

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
  // getCoursesByCategory
  const getCoursesByCategory =async()=>{
    
  }

  const handleChange = (value) => {
    getCourse(value);
  };

  function getCourse(id) {
    setCourse(
      ran.map((item, key) => {
        return {
          id: item.id,
          key: key,
          text: item.text,
          teacher: item.teacher,
          count_tema: item.count,
          is_active: item.is_active,
        };
      }),
      setLoadingCard(false)
    );
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Text",
      dataIndex: "text",
      key: "text",
    },
    {
      title: "Teacher",
      dataIndex: "teacher",
      key: "teacher",
    },
    {
      title: "Count tema",
      dataIndex: "count_tema",
      key: "count_tema",
    },
    {
      title: "Is active",
      dataIndex: "is_active",
      key: "is_active",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Link to={`/nurse/course/${record.id}`}>
          <BiPencil />
        </Link>
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
          <Table
            scroll={{ x: 400 }}
            style={{ height: "100%" }}
            loading={loadingCard}
            columns={columns}
            dataSource={course}
          />
        </Col>
      </Row>
    </>
  );
};

export default NurseCourse;
