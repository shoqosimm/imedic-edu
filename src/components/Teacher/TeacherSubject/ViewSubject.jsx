import { Breadcrumb, Card, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { api } from "../../../utils/api";
import "./styles/viewSubjectStyle.scss";
import { BiHome } from "react-icons/bi";

const ViewSubject = () => {
  const param = useParams();
  const [subject, setSubject] = useState([]);
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  //   getSubject
  const getSubject = (id) => {
    setLoading(true);
    api
      .get(`api/teacher/course-subject/show/${id}`)
      .then((res) => {
        setSubject(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
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
              <Link to={`/teacher/course/${location.state.message}/view`}>
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
          <Card title="Просмотреть тему">
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
          <Card title="Просмотреть Тесты">
            <Card title={subject?.teaser} centered="true">
              <p>{subject?.name}</p>
            </Card>
            <Card centered="true">
              <div>
                <ol>
                  <li>Количество теста : {subject?.count_test} шт</li>
                  <li>Количество мин.прохождение : {subject?.right_test} шт</li>
                  <li>Время теста : {subject?.time} мин</li>
                  <li>Время для перездачи теста : {subject?.resubmit} мин</li>
                </ol>
              </div>
            </Card>
          </Card>
        </div>
      )}
    </>
  );
};
export default ViewSubject;
