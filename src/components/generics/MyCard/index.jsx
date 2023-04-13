import React from "react";
import "./style.scss";
import { BiBook, BiShow, BiSync } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { BsPencilSquare } from "react-icons/bs";
import { ToastContainer } from "react-toastify";

const MyCardItem = ({ disabled, item }) => {
  const param = useParams();
  const navigate = useNavigate();

  // linkToSubject
  const linkToSubject = (id) => {
    if (item.subject.subject_type === "topic") {
      return navigate(`subject/${id}`, { state: { message: param.id } });
    }
    return navigate(`subject/test/${id}`, { state: { message: param.id } });
  };

  // showResult
  const showResult = (id) => {
    navigate("/nurse/answers", { state: { message: id } });
  };

  return (
    <div className="card__container">
      <div className="card__wrapper">
        {item.subject.subject_type === "topic"
          ? (item.status === 0 && (
              <p style={{ background: "orangered" }}>Mumkin emas</p>
            )) ||
            (item.status === 1 && (
              <p style={{ background: "yellowgreen" }}>O'qilayotgan</p>
            )) ||
            (item.status === 2 && (
              <p style={{ background: "green" }}>O'qib bo'lingan</p>
            ))
          : (item.status === 1 && (
              <p style={{ background: "yellowgreen" }}>Topshirilayotgan test</p>
            )) ||
            (item.status === 2 && item.is_passed === '1' && (
              <p style={{ background: "green" }}>Topshirilgan test</p>
            )) ||
            (item.status === 2 && item.is_passed === '0' && (
              <p style={{ background: "red" }}>O'ta olinmagan test</p>
            )) ||
            (item.status === 0 && (
              <p style={{ background: "orangered" }}>Mumkin emas</p>
            ))}
      </div>
      <div className="card__content">
        {item.subject.subject_type === "topic" ? (
          <BiBook style={{ fill: "brown" }} className="card__icon" />
        ) : (
          <BsPencilSquare style={{ fill: "green" }} className="card__icon" />
        )}
        <div className="content__text">
          <h1>{item.subject.name ?? "Card"}</h1>
          <p>{item.subject.teaser ?? "teaser"}</p>
        </div>

        {item.subject.subject_type == "test" && item.status === 2 ? (
          <div className="test_btn d-flex align-center justify-center gap-x-2">
            {(item.is_passed === '0' && (
              <>
                <button
                  title={disabled ? "not allowed" : "Qayta topshirish"}
                  disabled={disabled}
                  onClick={() => linkToSubject(item.id)}
                  className={disabled ? "disabled__card" : "card_resubmit"}
                >
                  <BiSync style={{ fontSize: "30px" }} />
                  Qayta topshirish
                </button>
                <button
                  title={disabled ? "not allowed" : " Natijani ko'rish"}
                  disabled={disabled}
                  onClick={() => showResult(item.id)}
                  className={disabled ? "disabled__card" : "card_result"}
                >
                  <BiShow style={{ fontSize: "24px" }} />
                  Natijani ko'rish
                </button>
              </>
            )) ||
              (item.is_passed === '1' && (
                <>
                  <button
                    title={disabled ? "not allowed" : " Natijani ko'rish"}
                    disabled={disabled}
                    onClick={() => showResult(item.id)}
                    className={disabled ? "disabled__card" : "card_result"}
                  >
                    <BiShow style={{ fontSize: "24px",margin:'0 5px' }} />
                    Natijani ko'rish
                  </button>
                </>
              ))}
          
          </div>
        ) : (
          <button
            title={disabled ? "not allowed" : "Посмотреть"}
            disabled={disabled}
            onClick={() => linkToSubject(item.id)}
            className={disabled ? "disabled__card" : "card__btn"}
          >
            {item.subject.subject_type === "test" ? "Topshirish" : "Ba'tafsil"}
          </button>
        )}
      </div>
      <ToastContainer/>
    </div>
    
  );
};

export default MyCardItem;
