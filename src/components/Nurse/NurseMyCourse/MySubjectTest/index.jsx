import React, { useState, useRef, useEffect } from "react";
import screenfull from "screenfull";
import "./style.scss";
import { Button, Modal, Pagination, Radio } from "antd";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../../../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import Countdown from "react-countdown";

// Countdown
const CountdownComponent = ({ handleFinish, testTime }) => {
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
    if (Ref.current) {
      clearInterval(Ref.current);
    }
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);

    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();
    deadline.setHours(deadline.getHours() + Number(testTime.hour));
    deadline.setSeconds(deadline.getSeconds() + Number(testTime.seconds));
    deadline.setMinutes(deadline.getMinutes() + Number(testTime.minutes));
    return deadline;
  };

  useEffect(() => {
    clearTimer(getDeadTime());
  }, []);

  return (
    <div className="Codedamn App">
      <p style={{ fontSize: "32px" }}>
        {timer === "00:00:00" ? console.log("bingo") : timer}
      </p>
    </div>
  );
};
export { CountdownComponent };

const MySubjectTest = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);
  const [testInfo, setTestInfo] = useState();
  const [answer, setAnswer] = useState();
  const [testTime, setTestTime] = useState();
  const [startTest, setStartTest] = useState(false);
  const [endModal, setEndModal] = useState(false);
  const [pagination, setPagination] = useState({
    ordering: 1,
    total: 15,
  });
  const [test, setTest] = useState({
    id: "",
    title: "",
    variant: [],
  });

  // getTest
  const getTest = async () => {
    try {
      const res = await api.get(`api/nurse/test/data/${id}`);
      setTestInfo(res.data);
      if (res.data.test_start && res.data.status == 1) {
        handleStartTest();
      } else {
        setOpenModal(true);
      }
    } catch (err) {
      console.log(err, "err");
    }
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
    api
      .post(`api/nurse/test/start/${id}`, {
        body: {
          ordering: pagination?.ordering,
        },
      })
      .then((res) => {
        if (
          new Date(res.data.test_start).getDate() ===
          new Date(res.data.test_end).getDate()
        ) {
          setTestTime(new Date(res.data.test_end) - new Date().getTime());
        }
        setTest({
          id: res.data.id,
          title: res.data.question,
          variant: res.data.answer,
        });
        setPagination({
          ...pagination,
          total: res.data.total_count,
        });
        res?.data?.choose !== null
          ? setAnswer(Number(res.data.choose))
          : setAnswer(null);
      })
      .catch((err) => {
        console.log(err, "err");
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      });
    const element = document.querySelector(".test");
    if (screenfull.isEnabled) {
      screenfull.request(element);
    }
    setStartTest(true);
    setOpenModal(false);
  };

  // handleChangePagination
  const handleChangePagination = (current) => {
    setPagination({ ...pagination, ordering: current });
    const body = {
      ordering: current,
    };
    api
      .post(`api/nurse/test/start/${id}`, body)
      .then((res) => {
        setTest({
          id: res.data.id,
          title: res.data.question,
          variant: res.data.answer,
        });
        res?.data?.choose !== null
          ? setAnswer(Number(res.data.choose))
          : setAnswer(null);
      })
      .catch((err) => console.log(err, "err"));
  };

  // handleSendAnswer
  const handleSendAnswer = (e) => {
    setAnswer(e.target.value);
    const body = {
      choose: String(e.target.value),
      ordering: pagination.ordering,
    };
    api
      .post(`api/nurse/test/choose/${id}`, body)
      .then((res) => console.log(res, "sendAnswer"));
  };

  // handleBackFromTest
  const handleBackFromTest = () => {
    navigate(`/nurse/mycourse`);
  };

  // handleFinish
  const handleFinish = () => {
    api
      .get(`api/nurse/test/finish/${id}`)
      .then((res) => {
        setEndModal(false);
        setStartTest(false);
        if (res.status === 200) {
          toast.success("Javoblar qa'bul qilindi", {
            position: "bottom-right",
          });
          setTimeout(() => {
            navigate("/nurse/answers", { state: { message: id } });
          }, 1500);
        }
      })
      .catch((err) => console.log(err, "err"));
  };

  useEffect(() => {
    getTest();
  }, []);

  return (
    <div className="test">
      <div className="timer_wrapper d-flex align-end justify-between">
        <div className="timer">
          {testTime && (
            <Countdown
              onComplete={handleFinish}
              date={Date.now() + Number(testTime)}
            />
          )}
        </div>
        <Button
          onClick={() => {
            setEndModal(true);
            screenfull.exit();
          }}
          className="test__finish"
        >
          Yakunlash
        </Button>
      </div>
      <div className="test__part">
        <h1>
          {pagination.ordering}. {test.title}
        </h1>
        {test.variant?.map((item, index) => {
          return (
            <Radio.Group
              buttonStyle="solid"
              optionType="button"
              key={index}
              style={{ display: "flex" }}
              onChange={handleSendAnswer}
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
          defaultCurrent={pagination.ordering}
          total={pagination?.total}
          itemRender={itemRender}
          onChange={handleChangePagination}
          showSizeChanger={false}
          pageSize={3}
          responsive
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
              Время для теста: <strong>{testInfo?.time}</strong> мин
            </p>
            <p>
              Кол-во теста: <strong>{testInfo?.count_test}</strong> шт
            </p>
            <p>
              Мин.кол-во правилный ответов:
              <strong> {testInfo?.right_test}</strong> шт
            </p>
            <p>
              Пересдача:
              <strong> {testInfo?.resubmit}</strong> мин
            </p>
          </div>
          <div className="test__modal__desctiption">
            <p>
              Test will continue {testInfo?.time} minutes, you should not to
              leave this page untill done all of tests, if you leave this page
              without solving all test then the timer is not stoping and you
              would not pass the test, test will start when you click ok button
            </p>
          </div>
        </div>
      </Modal>
      <Modal
        onOk={handleFinish}
        title="Yakunlash"
        okText={"Ha"}
        cancelText={"Yo'q"}
        open={endModal}
        onCancel={() => {
          setEndModal(false);
          const element = document.querySelector(".test");
          if (screenfull.isEnabled) {
            screenfull.request(element);
          }
        }}
      >
        <div>
          <p>
            Siz haqiqatdan ham ushbu testni yakunlamoqchimisiz, test
            yakunlangandan so'ng barcha javoblaringiz qa'bul qilinadi va
            o'zgartira olmaysiz.
          </p>
          <br />
          <p>
            Qayta topshirish {testInfo?.resubmit} daqiqadan so'ng mumkin
            bo'ladi.
          </p>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default MySubjectTest;
