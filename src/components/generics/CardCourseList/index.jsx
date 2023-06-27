import { Button, Card, Progress } from "antd";
import "./style.scss";
import { MdStarRate } from "react-icons/md";
import { BiFolder, BiPlus, BiUserVoice } from "react-icons/bi";
import { BsFiles } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AltImg from '../../../assets/bgImg/4.jpg'

const CardCourseList = ({ course, handleAddCourse, mycourse }) => {
  const navigate = useNavigate();
  const [matchMedia, setMatchMedia] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setMatchMedia((prev) => (prev = window.innerWidth));
    });

    return () => {
      window.removeEventListener("resize", () => {});
    };
  });

  return (
    <Card style={{ margin: "1rem 0" }}>
      <div className="card">
        <div className="card__img__wrapper">
          {mycourse ? (
            <img
            style={{objectFit:'cover'}}
              src={
                course?.name.image ?
                `https://api.edu.imedic.uz${course?.name.image?.file_url}`
                :AltImg
              }
              alt="img"
            />
          ) : (
            <img
            style={{objectFit:'cover'}}
              src={
                course?.image ?
                `https://api.edu.imedic.uz${course?.image?.file_url}`:
                AltImg
              }
              alt="img"
            />
          )}
        </div>
        <div
          className="card__content__wrapper"
          style={mycourse ? { width: "60%" } : null}
        >
          <div className="content__header d-flex align-center gap-x-1">
            <p className="header__title">O'qituvchi</p>
            <span className="header__teacher">
              {!mycourse
                ? course?.teacher
                : course?.user.last_name + " " + course?.user.first_name}
            </span>
          </div>
          <div className="content__title">
            {mycourse ? <p>{course?.name?.name}</p> : <p>{course?.name}</p>}
          </div>
          <ul className="content__details d-flex align-center gap-x-3">
            <li className="d-flex align-center gap-1">
              <MdStarRate className="icon" />
              <p>{course?.rate.average_rate ?? "0"} O'rtacha baho</p>
            </li>
            <li className="d-flex align-center gap-1">
              <BiUserVoice className="icon" />
              <p>{course?.rate.rate_count ?? "0"} Baholaganlar soni</p>
            </li>
            <li className="d-flex align-center gap-1">
              <BsFiles className="icon" />
              <p>{course?.count_tema} Mavzular</p>
            </li>
          </ul>

          <div className="content__btn d-flex align-center justify-between">
            {!mycourse && (
              <Button
                onClick={() => handleAddCourse(course?.id)}
                icon={<BiPlus />}
                className="content__btn__item d-flex align-center gap-1"
              >
                Kursni qo'shish
              </Button>
            )}
            <Button
              onClick={() =>
                !mycourse
                  ? navigate(`/nurse/course/${course?.id}`)
                  : navigate(`/nurse/mycourse/${course?.id}`)
              }
              icon={<BiFolder />}
              className="content__btn__item d-flex align-center gap-1"
            >
              Batafsil
            </Button>
          </div>
        </div>
        {mycourse && (
          <Progress
            type={matchMedia > 957 ? "circle" : "line"}
            percent={Number(course?.percent)}
            size={matchMedia > 957 ? 100 : null}
          />
        )}
      </div>
    </Card>
  );
};

export default CardCourseList;
