import React, { useEffect, useState } from "react";
import { api } from "../../../../utils/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Breadcrumb, Card, Collapse, Divider, Spin } from "antd";
import moment from "moment";
import { BiHome } from "react-icons/bi";
import { BsCheckCircle, BsClock, BsFileCode } from "react-icons/bs";
import { t } from "i18next";
import "./viewStyle.scss";

const ViewAnswers = () => {
  const [info, setInfo] = useState();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const getInfo = () => {
    setLoading(true);
    api
      .post(`api/nurse/test/result/${location.state.message}`)
      .then((res) => {
        setInfo(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err, "err");
        setLoading(false);
      });
  };

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <div>
      <Breadcrumb
        items={[
          {
            title: (
              <Link to="/nurse/mycourse">
                <BiHome />
              </Link>
            ),
          },
          {
            title: (
              <p
                style={{ color: "grey", cursor: "pointer" }}
                onClick={() => navigate('/nurse/mycourse')}
              >
               {t('back')}
              </p>
            ),
          },
        ]}
      />

      {loading && <Spin className="spinner" />}

      {!loading && (
        <Card className="answers__card" title={info?.course.name}>
          {info?.is_passed === "0" ? (
            <>
              <div className="badge__answers" style={{ color: "red" }}>
                <em>{"O'ta olinmadi"}</em>
              </div>
              <Divider />
            </>
          ) : (
            <>
              <div className="badge__answers" style={{ color: "green" }}>
                <em>{t('submitted')}</em>
              </div>
              <Divider />
            </>
          )}
          <ol className="content__wrapper">
            <li>
              <p className="d-flex align-center gap-x-1">
                <BsFileCode className="icon" />
              {t('allTest')}
              </p>
              <div className="d-flex align-center gap-x-1">
                {info?.subject_result.count_test} {t('ta')}
              </div>
            </li>
            <li>
              <p className="d-flex align-center gap-x-1">
                <BsClock className="icon" />
                {t('testForTime')}
              </p>
              <div className="d-flex align-center gap-x-1">
                {info?.subject_result.time} min
              </div>
            </li>
            <li className="d-flex align-center gap-x-1">
              <p className="d-flex align-center gap-x-1">
                <BsClock className="icon" /> 
                {t('theTime')}
              </p>
              <div className="d-flex align-center gap-x-1">
                {moment(info?.test_start).format("DD.MM.YYYY HH:mm")}
              </div>
            </li>
            <li className="d-flex align-center gap-x-1">
              <p className="d-flex align-center gap-x-1">
                <BsClock className="icon" />{t('finishTest')}
              </p>
              <div className="d-flex align-center gap-x-1">
                {moment(info?.test_end).format("DD.MM.YYYY HH:mm")}
              </div>
            </li>
            <li>
              <p className="d-flex align-center gap-x-1">
                <BsCheckCircle className="icon" />
                {t('correctTest')}
              </p>
              <div className="d-flex align-center gap-x-1">
                {info?.result} {t('ta')}
              </div>
            </li>
          </ol>
          <Collapse style={{ margin: "1.5rem 0" }}>
            <Collapse.Panel
              header={t('thisSubjectName')}
              key="1"
            >
              <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
                {t('titleCouts')}
              </h2>
              <ol style={{ padding: "0.5rem 2rem" }}>
                {info?.incorrect.map((item) => {
                  return (
                    <li style={{ fontSize: "18px" }} key={item.id}>
                      {item?.test?.from_subject?.name}
                    </li>
                  );
                })}
              </ol>
            </Collapse.Panel>
          </Collapse>
        </Card>
      )}
    </div>
  );
};

export default ViewAnswers;
