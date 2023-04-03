import React from "react";
import "./style.scss";
import { BiBook } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { BsPencilSquare } from "react-icons/bs";

const MyCardItem = ({ disabled, item }) => {
  const param = useParams();
  const navigate = useNavigate();

  // linkToSubject
  const linkToSubject = (id) => {
    if (item.subject_type === "topic") {
      return navigate(`subject/${id}`, { state: { message: param.id } });
    }
    return navigate(`subject/test/${id}`, { state: { message: param.id } });
  };

  return (
    <div className="card__container">
      <div className="card__wrapper">
        <p>{item.percent} %</p>
      </div>
      <div className="card__content">
        {item.subject_type === "topic" ? (
          <BiBook style={{ fill: "brown" }} className="card__icon" />
        ) : (
          <BsPencilSquare style={{ fill: "green" }} className="card__icon" />
        )}
        <div className="content__text">
          <h1>{item.name ?? "Card"}</h1>
          <p>{item.teaser ?? "teaser"}</p>
         
        </div>

        <button
          title={disabled ? "not allowed" : "Посмотреть"}
          disabled={disabled}
          onClick={() => linkToSubject(item.course_id)}
          className={disabled ? "disabled__card" : "card__btn"}
        >
          Подробнее
        </button>
      </div>
    </div>
  );
};

export default MyCardItem;
