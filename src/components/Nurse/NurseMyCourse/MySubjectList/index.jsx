import { Breadcrumb, Card, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./style.scss";
import MyCardItem from "../../../generics/MyCard";
import { api } from "../../../../utils/api";
import { BiHome } from "react-icons/bi";
import { ToastContainer } from "react-toastify";

const NurseMyCourse = () => {
  const params = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emptyText, setEmptyText] = useState();

  // getCourseList
  const getCourseList = () => {
    setLoading(true);
    api
      .get(`api/nurse/subject/mycourse/${params.id}`)
      .then((res) => {
        if (res.data.length <= 0) {
          setEmptyText("Bu kurs bo'yicha mavzular mavjud emas!");
        }
        setCourses(
          res.data.map((item) => {
            return {
              key: item.id,
              ...item,
            };
          })
        );
        setLoading(false);
      })
      .catch((err) => {
        console.log(err, "err");
        setLoading(false);
      });
  };

  useEffect(() => {
    getCourseList();
  }, []);

  return (
    <div className="mycourse__wrapper">
      <Breadcrumb
        style={{ marginBottom: "0.5rem" }}
        items={[
          {
            title: (
              <Link to="/nurse/mycourse">
                <BiHome />
              </Link>
            ),
          },
        ]}
      />
      <div>
        <Card title="Мои курсы">
          <div
            style={{
              flexWrap: "wrap",
              justifyContent: "center",
              padding: "1.5rem 0",
            }}
            className="d-flex align-center gap-3"
          >
            {loading && <Spin />}
            {emptyText ? (
              <h2>{emptyText}</h2>
            ) : (
              courses?.map((item) => {
                return (
                  <MyCardItem
                    disabled={item.status === 0 ? true : false}
                    key={item.id}
                    item={item}
                  />
                );
              })
            )}
          </div>
        </Card>
      </div>
      <ToastContainer />
    </div>
  );
};

export default NurseMyCourse;
