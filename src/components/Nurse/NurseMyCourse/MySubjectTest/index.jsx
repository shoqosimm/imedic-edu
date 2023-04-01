import React, { useState } from "react";
import Countdown from "react-countdown";
import "./style.scss";
import { Button, Pagination, Radio } from "antd";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

const CountdownWrapper = () => <Countdown date={Date.now() + 100000} />;
const MemoCountdown = React.memo(CountdownWrapper);

const MySubjectTest = () => {
  const [answer, setAnswer] = useState();
  const courses = {
    id: 1,
    title: "Bu mavzuning 1chi savoli",
    variant: ["bu A varianti", "bu B varianti", "bu C varianti"],
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

  return (
    <div className="test">
      <div className="timer_wrapper d-flex align-end justify-between">
        <div className="timer">
          <MemoCountdown />
        </div>
        <Button className="test__finish">Yakunlash</Button>
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
    </div>
  );
};

export default MySubjectTest;
