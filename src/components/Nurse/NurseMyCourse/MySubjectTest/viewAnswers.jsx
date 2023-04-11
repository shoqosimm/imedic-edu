import React, { useEffect, useState } from "react";
import { api } from "../../../../utils/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Breadcrumb, Card, Collapse } from "antd";
import moment from "moment";
import { BiCheckCircle, BiHome } from "react-icons/bi";
import { BsClock } from "react-icons/bs";
import "./viewStyle.scss";

const ViewAnswers = () => {
  const [info, setInfo] = useState();
  const location = useLocation();
  const navigate = useNavigate();

  const getInfo = () => {
    api
      .post(`api/nurse/test/result/${location.state.message}`)
      .then((res) => {
        setInfo(res.data);
      })
      .catch((err) => {
        console.log(err, "err");
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
                onClick={() => navigate(-2)}
              >
                Назад
              </p>
            ),
          },
        ]}
      />

      <Card title={info?.course.name}>
        <div>
          <p>Umumiy testlar soni: {info?.subject_result.count_test} ta</p>
          <p>Testga ajratilgan vaqt: {info?.subject_result.time} min</p>
          <p className="d-flex align-center gap-x-1">
            Test topshirilgan vaqt:{" "}
            {moment(info?.test_start).format("DD.MM.YYYY HH:mm")}{" "}
            <BsClock style={{ fill: "orange", fontSize: "16px" }} />
          </p>
          <p className="d-flex align-center gap-x-1">
            Test tugatilgan vaqt:{" "}
            {moment(info?.test_end).format("DD.MM.YYYY HH:mm")}{" "}
            <BsClock style={{ fill: "red", fontSize: "16px" }} />
          </p>
          <div className="d-flex align-center gap-x-1">
            <p>To'gri topilgan testlar soni: {info?.result} ta</p>
            <BiCheckCircle style={{ fill: "green", fontSize: "18px" }} />
          </div>
        </div>
        <Collapse style={{ margin: "1.5rem 0" }}>
          <Collapse.Panel
            header="Notog'ri javoblarga tegishli mavzular"
            key="1"
          >
            <h2 style={{textAlign:'center',marginBottom:'1rem'}}>Bu yerda mavzulr nomi ko'rsatiladi</h2>
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
    </div>
  );
};

export default ViewAnswers;
