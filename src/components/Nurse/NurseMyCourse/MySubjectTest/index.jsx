import React, { useState, useEffect, useCallback, memo } from "react";
import "./style.scss";
import { Button, Menu, Modal, Pagination, Radio } from "antd";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import Countdown from "react-countdown";
import Swal from "sweetalert2";
import moment from "moment/moment";

const MySubjectTest = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [testInfo, setTestInfo] = useState();
  const [answer, setAnswer] = useState();
  const [testTime, setTestTime] = useState();
  const [startTest, setStartTest] = useState(false);
  const [testAmount, setTestAmount] = useState([]);
  const [pagination, setPagination] = useState({
    ordering: localStorage.getItem("testPagination") ?? 1,
    total: 10,
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
          icon={<MdKeyboardDoubleArrowLeft />}
        >
          {window.innerWidth >= 565 ? "Oldingisi" : null}
        </Button>
      );
    }
    if (type === "next") {
      return (
        <Button className="btn d-flex align-center gap-1">
          {window.innerWidth >= 565 ? "Keyingisi" : null}
          <MdKeyboardDoubleArrowRight />
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
          const countdown = new Date(res.data.test_end) - new Date().getTime();
          setTestTime(new Date(res.data.test_end) - new Date().getTime());
          localStorage.setItem("countTime", countdown);
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

    setStartTest(true);
    setOpenModal(false);
  };

  // handleChangePagination
  const handleChangePagination = (current) => {
    localStorage.setItem("testPagination", current);
    setPagination({ ...pagination, ordering: current });
    const body = {
      ordering: current,
    };
    api
      .post(`api/nurse/test/start/${id}`, body)
      .then((res) => {
        window.location.reload();
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
    setOpenModal(false);
    // navigate(-1);
  };

  // handleFinish
  const handleFinish = () => {
    api
      .get(`api/nurse/test/finish/${id}`)
      .then((res) => {
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
    !startTest && getTest();
    if (testAmount.length === 0) {
      for (let i = 1; i <= pagination?.total; i++) {
        setTestAmount((prev) => [...prev, i]);
      }
    }

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="container__test d-flex gap-x-2">
      <div className="drawer">
        <Menu
          defaultSelectedKeys={[localStorage.getItem("testPagination") ?? "1"]}
          mode="inline"
          inlineCollapsed
          multiple={false}
          onSelect={(e) => handleChangePagination(e.key)}
          items={testAmount?.map((item) => {
            return {
              label: item,
              key: item,
            };
          })}
        />
      </div>

      <div className="test">
        <div className="d-flex flex-column gap-3">
          <div className="timer_wrapper d-flex align-end justify-between">
            <div className="timer">
              {testTime && (
                <Countdown
                  onComplete={handleFinish}
                  date={Date.now() + Number(localStorage.getItem("countTime"))}
                />
              )}
            </div>
            <Button
              onClick={() => {
                Swal.fire({
                  title: "Yakunlash",
                  text: "Siz haqiqatdan ham ushbu testni yakunlamoqchimisz?",
                  confirmButtonText: "Ha, yakunlash",
                  cancelButtonText: "Yo'q, davom etish",
                  showCancelButton: true,
                }).then((res) => {
                  if (res.isConfirmed) {
                    handleFinish();
                  }
                });
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
                Test soni:{" "}
                <strong>{testInfo?.course_subject.count_test}</strong> ta
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
                ajratilgan vaqt davom etadi va vaqt yakunlangandan so'ng test
                ham yakunlanadi va testni javoblari qa'bul qilinadi, test
                "Testni boshlash" tugmasini bosilgandan so'ng boshlanadi.
              </p>
            </div>
          </div>
        </Modal>

        <ToastContainer />
      </div>
    </div>
  );
};

export default MySubjectTest;
