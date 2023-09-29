import { Col, Pagination, Row, Spin } from "antd";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { api } from "../../../utils/api";
import "./style.scss";
import CardCourseList from "../../generics/CardCourseList";
import EmptyBox from "../../../assets/illustration/emptyBox.webp";
import { t } from "i18next";
const NurseMyCourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const controller = new AbortController();
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 15,
    total: 10,
  });

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
        {courses &&
          courses.map((item) => {
            return (
              <motion.div
                style={{ margin: "2rem 0" }}
                initial={{ x: "100%", opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", duration: 2, bounce: 0.1 }}
                viewport={{ once: true }}
                key={item.id}
              >
                <CardCourseList course={item} mycourse={true} />
              </motion.div>
            );
          })}
        {courses.length > 0 && (
          <Pagination
            current={pagination?.current_page}
            total={pagination?.total}
            showSizeChanger={false}
            onChange={(current, per_page) => {
              getCourseList(current, per_page);
            }}
          />
        )}
        {loading && (
          <div
            className="d-flex flex-column align-center justify-center"
            style={{ background: "#fff", width: "100%", height: "500px" }}
          >
            <Spin />
          </div>
        )}
        {courses.length < 0 && (
          <div
            className="d-flex flex-column align-center justify-center"
            style={{ background: "#fff", width: "100%", height: "500px" }}
          >
            <img src={EmptyBox} alt="empty" width={"200px"} />
            <em style={{ fontSize: "18px" }}>{t('noCourse')}</em>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default NurseMyCourseList;
