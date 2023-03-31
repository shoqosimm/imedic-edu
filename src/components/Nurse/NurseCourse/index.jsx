import { Row, Select, Col, Table } from "antd";
import React, { useEffect, useState } from "react";
import { BiDoorOpen, BiPencil, BiWindowOpen } from "react-icons/bi";
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
    api

      .get(`api/nurse/course/list/category/${id}`)
      .then((res) => {

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
  })
  }

  const columns = [
    {
      name: "ID",
      dataIndex: "num",
      key: "num",
    },
    {
      title: "Text",
      dataIndex: "name",
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
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <Link to={`/nurse/course/${record.id}`}>
          <BiWindowOpen />
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
