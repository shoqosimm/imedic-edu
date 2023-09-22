import { Row, Select, Col, Pagination } from "antd";
import React, { useEffect, useState } from "react";
import "./style.scss";
import { api } from "../../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";
import CardCourseList from "../../generics/CardCourseList";
import ChooseIllus from "../../../assets/illustration/choose.webp";
import EmptyBox from '../../../assets/illustration/emptyBox.webp'
import { t } from "i18next";


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
    total: 100,
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
            ...item,
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
    try {
      const body = {
        course_id: id,
      };
      const res = await api.post("api/nurse/course/add", body);
      res.status === 200 && toast.success("Добавлено!");
    } catch (err) {
      console.log(err);
    }
  };

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
    <div className="courseList">
      <Row gutter={24}>
        <Col span={24} className="category__wrapper">
          <div>
            <label htmlFor="catSelect">{t('select')}</label>
            <Select
              id="catSelect"
              className="subject_select"
              onChange={handleChange}
              options={category}
              value={String(categoryId)}
            />
          </div>
        </Col>
        <Col span={24} className="list">
          {course.length === 0 && (
            <div className="emptyBox">
              <img src={EmptyBox} alt="imgEmpty" />
              <h1>{t('notCourse')}</h1>
            </div>
          )}
          {course ? (
            <>
              {course.map((item) => {
                return (
                  <motion.div
                    initial={{ x: "100%", opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", duration: 2, bounce: 0.1 }}
                    viewport={{ once: true }}
                    key={item.id}
                  >
                    <CardCourseList
                      course={item}
                      handleAddCourse={handleAddCourse}
                      mycourse={false}
                    />
                  </motion.div>
                );
              })}
              <Pagination
                current={pagination?.current_page}
                total={pagination?.total}
                showSizeChanger={false}
                onChange={(current, per_page) => {
                  getCourse(categoryId, current, per_page);
                }}
              />
            </>
          ) : (
            <div
              style={{
                marginTop: "2rem",
                color: "#252525",
                letterSpacing: "1px",
              }}
              className="d-flex align-center justify-center flex-column"
            >
              <img src={ChooseIllus} alt="chooseIllustrat" width={"400px"} />
              <em style={{ fontSize: "18px" }}>{t('selectCategory')}</em>
            </div>
          )}
        </Col>
      </Row>
      <ToastContainer />
    </div>
  );
};

export default NurseCourse;
