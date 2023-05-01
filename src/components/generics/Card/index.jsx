import React from "react";
import "./style.scss";
import { BiBook } from "react-icons/bi";
import { BsPencilSquare } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";

const CardItem = ({ title, teaser, subject, click, disabled }) => {
  const param = useParams();
  const navigate = useNavigate();

  // linkToSubject
  const linkToSubject = (id) => {
    navigate(`/nurse/course/subject/${id}`, { state: { message: param.id } });
  };

  return (
    <div className="card__container">
      <div className="card__wrapper" />
      <div className="card__content">
        {subject === "topic" ? (
          <BiBook style={{fill:'brown'}} className="card__icon" />
        ) : (
          <BsPencilSquare style={{fill:'green'}} className="card__icon" />
        )}
        <div className="content__text">
          <h1>{title ?? "Card"}</h1>
          <p>{teaser ?? "teaser"}</p>
          <p>{subject ?? "subject"}</p>
        </div>

        <button
          title={disabled ? "not allowed" : "Ko'rish"}
          disabled={disabled}
          onClick={() => linkToSubject(click)}
          className={disabled ? "disabled__card" : "card__btn"}
        >
          Batafsil
        </button>
      </div>
    </div>
  );
};

export default CardItem;
