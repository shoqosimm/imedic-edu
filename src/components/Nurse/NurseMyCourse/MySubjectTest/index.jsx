import React, { useState, useRef, useEffect } from "react";
import screenfull from "screenfull";
import "./style.scss";
import { Button, Modal, Pagination, Radio } from "antd";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../../utils/api";
import { ToastContainer } from "react-toastify";

// Countdown
const CountdownComponent = () => {
  const Ref = useRef(null);
  const [timer, setTimer] = useState("00:00:00");

  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor(((total / 1000) * 60 * 60) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };

  const startTimer = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(
        (hours > 9 ? hours : "0" + hours) +
          ":" +
          (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      );
    }
  };

  const clearTimer = (e) => {
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 600);
    return deadline;
  };

  useEffect(() => {
    clearTimer(getDeadTime());
  }, []);

  return (
    <div className="Codedamn App">
      <p style={{ fontSize: "32px" }}>{timer}</p>
    </div>
  );
};
export { CountdownComponent };

const MySubjectTest = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [time, setTime] = useState({ time: 60, countTest: 10 });
  const [startTest, setStartTest] = useState(false);
  const [answer, setAnswer] = useState();
  const courses = {
    id: 1,
    title: "Bu mavzuning 1chi savoli",
    variant: ["bu A varianti", "bu B varianti", "bu C varianti"],
  };

  // getTest
  const getTest = async () => {
    const res = await api.get(`api/nurse/test/start/${id}`);

    console.log(res.data, "res");
  };

  // pagination
  const itemRender = (_, type, originalElement) => {
    if (type === "prev") {
      return (
        <Button
          className="btn d-flex align-center gap-x-1"
          icon={<BsArrowLeft />}
        >
          {window.innerWidth >= 565 ? "Oldingisi" : null}
        </Button>
      );
    }
    if (type === "next") {
      return (
        <Button className="btn d-flex align-center gap-1">
          {window.innerWidth >= 565 ? "Keyingisi" : null}
          <BsArrowRight />
        </Button>
      );
    }
    return originalElement;
  };

  // handleStartTest
  const handleStartTest = () => {
    const element = document.querySelector(".test");
    if (screenfull.isEnabled) {
      screenfull.request(element);
    }
    setStartTest(true);
    setOpenModal(false);
  };

  // handleBackFromTest
  const handleBackFromTest = () => {
    navigate(`/nurse/mycourse`);
  };

  // handleFinish
  const handleFinish = () => {
    screenfull.exit();
  };

  useEffect(() => {
    getTest();
    setOpenModal(true);
  }, []);

  return (
    <div className="test">
      <div className="timer_wrapper d-flex align-end justify-between">
        <div className="timer">{startTest && <CountdownComponent />}</div>
        <Button onClick={handleFinish} className="test__finish">
          Yakunlash
        </Button>
      </div>
      <div className="test__part">
        <h1>
          {courses.id}. {courses.title}
        </h1>
        {courses.variant.map((item, index) => {
          return (
            <Radio.Group
              buttonStyle="solid"
              optionType="button"
              key={index}
              style={{ display: "flex" }}
              onChange={(e) => setAnswer(e.target.value)}
              value={answer}
            >
              <Radio value={index} className="test__questions">
                {item}
              </Radio>
            </Radio.Group>
          );
        })}
      </div>
      <div>
        <Pagination
          className="control__btns d-flex align-center justify-center"
          defaultCurrent={1}
          total={15}
          itemRender={itemRender}
        />
      </div>
      <Modal
        onOk={handleStartTest}
        onCancel={handleBackFromTest}
        okText={"Начать тест"}
        cancelText={"Отменить"}
        open={openModal}
      >
        <div className="d-flex gap-y-3" style={{ flexDirection: "column" }}>
          <div>
            <p>
              Время для теста: <strong>{time.time ?? "60"}</strong> мин
            </p>
            <p>
              Кол-во теста: <strong>{time.countTest ?? "60"}</strong> шт
            </p>
          </div>
          <div className="test__modal__desctiption">
            <p>
              Test will continue {time.time} minutes, you should not to leave
              this page untill done all of tests, if you leave this page without
              solving all test then the timer is not stoping and you would not
              pass the test, test will start when you click ok button
            </p>
          </div>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default MySubjectTest;
