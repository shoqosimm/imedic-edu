import React, { useState, useEffect } from "react";
import "./style.scss";
import { Button, Divider, Menu, Modal, Radio, Skeleton } from "antd";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import CountDown from "./CountDown";
import moment from "moment";
import { useCallback } from "react";
import { t } from "i18next";

const MySubjectTest = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [testInfo, setTestInfo] = useState();
  const [answer, setAnswer] = useState();
  const [testTime, setTestTime] = useState();
  const [startTest, setStartTest] = useState(false);
  const [testAmount, setTestAmount] = useState([]);
  const [testTrueList, setTestTrueList] = useState([]);
  const [coverNav, setCoverNav] = useState(false);
  const [fixPage, setFixPage] = useState(false);
  const [pagination, setPagination] = useState({
    ordering: localStorage.getItem("testPagination") ?? 1,
    total: 0,
  });
  const [test, setTest] = useState({
    id: "",
    title: "",
    variant: [],
  });
  const [loading, setLoading] = useState(true);

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
  // disableBackButton
  const disableBackButton = () => {
    history.pushState(null, document.title, location.href);
    window.addEventListener("popstate", function (event) {
      history.pushState(null, document.title, location.href);
    });
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
          const endTest = new Date(res.data.test_end).getTime();
          const now = new Date().getTime();
          const difference = endTest - now;
          const resultTime = Math.round(difference / 60000);
          setTestTime(resultTime);
        }
        setCoverNav(true);
        disableBackButton();
        setTest({
          id: res.data.id,
          title: res.data.question,
          variant: res.data.answer,
        });
        setFixPage(true);
        setLoading(false);
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
    setLoading(true);
    localStorage.setItem("testPagination", current);
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
        setLoading(false);
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
    setTestTrueList((prev) => [...prev, parseInt(pagination.ordering)]);
    api
      .post(`api/nurse/test/choose/${id}`, body)
      .then((res) => console.log(res, "sendAnswer"));
  };
  console.log(testTrueList, "testTrueList");
  // handleBackFromTest
  const handleBackFromTest = () => {
    navigate(-1);
  };

  // hadlePaginateBtns
  const hadlePaginateBtns = (type) => {
    setLoading(true);
    if (type === "prev") {
      handleChangePagination(--pagination.ordering);
    } else if (type === "next") {
      handleChangePagination(++pagination.ordering);
    } else {
      console.log("unkown");
    }
  };

  // handleFinish
  const handleFinish = useCallback(() => {
    api
      .get(`api/nurse/test/finish/${id}`)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Javoblar qa'bul qilindi", {
            position: "bottom-right",
          });
          localStorage.removeItem('testPagination')
          setCoverNav(false);
          setTimeout(() => {
            navigate("/nurse/answers", { state: { message: id } });
          }, 1500);
        }
      })
      .catch((err) => console.log(err, "err"));
  }, []);

  useEffect(() => {
    if (!startTest) {
      getTest();
    } else {
      disableBackButton();
    }
    return () => {
      controller.abort();
    };
  }, []);
  useEffect(() => {
    if (testAmount.length === 0) {
      for (let i = 1; i <= pagination?.total; i++) {
        setTestAmount((prev) => [...prev, i]);
      }
    }
  }, [fixPage]);
  console.log(testAmount, "testAmount",pagination?.total);

  return (
    <div className="container__test d-flex gap-x-2">
      {coverNav && (
        <div className="coverNav">
         {t('testStart')}
        </div>
      )}
      <div className="drawer">
        <Menu
          selectedKeys={[localStorage.getItem("testPagination") ?? "1"]}
          mode="inline"
          inlineCollapsed
          multiple={false}
          className={testAmount?.map((item) => {
              testTrueList?.map((item2) => {
                if (item === item2) {
                  return "belgilangan";
                }
              });
          })}
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
                <CountDown
                  minutes={Number(testTime)}
                  onCountdownEnd={handleFinish}
                />
              )}
            </div>
            <Button
              onClick={() => {
                Swal.fire({
                  title:t('finish'),
                  text:t('finishText'),
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
              {t('finish')}
            </Button>
          </div>
          <Skeleton loading={loading} >
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
          </Skeleton>
          
        </div>
        <Divider />
        <div className="d-flex justify-between align-center">
          <Button
            
            className="paginate__btns d-flex align-center gap-1"
            disabled= {loading ? true :false && pagination?.ordering === 1}
            onClick={() => hadlePaginateBtns("prev")}
          >
            <MdKeyboardDoubleArrowLeft />
            Prev
          </Button>
          <Button
            className="paginate__btns d-flex align-center gap-1"
            disabled={
              loading ? true : false &&
              pagination?.ordering === testInfo?.course_subject.count_test
            }
            onClick={() => hadlePaginateBtns("next")}
          >
            Next
            <MdKeyboardDoubleArrowRight />
          </Button>
        </div>
        <Modal
          onOk={handleStartTest}
          onCancel={handleBackFromTest}
          okText={"Testni boshlash"}
          cancelText={'notSaveBack'}
          open={openModal}
        >
          <div className="d-flex gap-y-3" style={{ flexDirection: "column" }}>
            <div>
              <p>
                {t('testTime')}: <strong>{testInfo?.course_subject.time}</strong> min
              </p>
              <p>
                {t('testNumber')}:{" "}
                <strong>{testInfo?.course_subject.count_test}</strong> ta
              </p>
              <p>
                {t('miniCorrectAnsewer')}
                <strong> {testInfo?.course_subject.right_test}</strong> ta
              </p>
              <p>
              {t('resubmit')}
                <strong> {testInfo?.course_subject.resubmit}</strong> {t('time')}
              </p>
            </div>
            <div className="test__modal__desctiption">
              <p>
                {t('testTime')} {testInfo?.course_subject.time} {t('testInfo')}
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
