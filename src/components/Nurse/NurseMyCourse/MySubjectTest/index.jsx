import React, { useState, useEffect } from "react";
import screenfull from "screenfull";
import "./style.scss";
import { Button, Modal, Pagination, Radio } from "antd";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import Countdown from "react-countdown";

const MySubjectTest = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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

  const controller = new AbortController();

  // getTest
  const getTest = async () => {
    try {
      const res = await api.get(`api/nurse/test/data/${id}`, {
        signal: controller.signal,
      });
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

    return () => {
      controller.abort();
    };
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
        okText={"Testni boshlash"}
        cancelText={"Bekor qilish va ortga qaytish"}
        open={openModal}
      >
        <div className="d-flex gap-y-3" style={{ flexDirection: "column" }}>
          <div>
            <p>
              Test vaqti: <strong>{testInfo?.course_subject.time}</strong> min
            </p>
            <p>
              Test soni: <strong>{testInfo?.course_subject.count_test}</strong>{" "}
              ta
            </p>
            <p>
              To'g'ri javoblarning minimal soni:
              <strong> {testInfo?.course_subject.right_test}</strong> ta
            </p>
            <p>
              Qayta topshirish oraliq vaqti:
              <strong> {testInfo?.course_subject.resubmit}</strong> min
            </p>
          </div>
          <div className="test__modal__desctiption">
            <p>
              Test vaqti {testInfo?.course_subject.time} minut bo'lib, ushbu
              testni yakunlamasdan sahifani tark etish mumkin emas, Agarda
              testni yakunlamasdan sahifani tark etadigan bo'lsangiz testga
              ajratilgan vaqt davom etadi va vaqt yakunlangandan so'ng test ham
              yakunlanadi va testni javoblari qa'bul qilinadi, test "Testni
              boshlash" tugmasini bosilgandan so'ng boshlanadi.
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
