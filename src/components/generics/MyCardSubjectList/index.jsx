import { Button, Card, Tooltip } from "antd";
import "./style.scss";
import Meta from "antd/es/card/Meta";
import { BiBook, BiPencil, BiShow, BiSync } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";

const MyCardSubjectList = ({
  title,
  teaser,
  subject,
  click,
  disabled,
  item,
}) => {
  const navigate = useNavigate();
  const param = useParams();

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
    <Card
      className="cardSubject"
      cover={<img className="card__img" src="" alt="img" />}
      actions={[
        item.subject.subject_type == "test" && item.status === 2 ? (
          <div className="test_btn d-flex flex-column align-center gap-1">
            {(item.is_passed === "0" && (
              <>
                <Button
                  title={disabled ? "not allowed" : "Qayta topshirish"}
                  disabled={disabled}
                  onClick={() => linkToSubject(item.id)}
                  className={"card__resubmit d-flex align-center"}
                >
                  Qayta topshirish
                </Button>
                <Button
                  title={disabled ? "not allowed" : " Natijani ko'rish"}
                  disabled={disabled}
                  onClick={() => showResult(item.id)}
                  className={"card_result"}
                >
                  Natijani ko'rish
                </Button>
              </>
            )) ||
              (item.is_passed === "1" && (
                <>
                  <Button
                    title={disabled ? "not allowed" : " Natijani ko'rish"}
                    disabled={disabled}
                    onClick={() => showResult(item.id)}
                    className={"card_result"}
                  >
                    Natijani ko'rish
                  </Button>
                </>
              ))}
          </div>
        ) : (
          <Button
            title={disabled ? "not allowed" : "Ko'rish"}
            disabled={disabled}
            onClick={() => linkToSubject(item.id)}
            className={"card__btn"}
          >
            {item.subject.subject_type === "test" ? "Topshirish" : "Ba'tafsil"}
          </Button>
        ),
      ]}
    >
      <div className="card__type">
        {" "}
        {item.subject.subject_type === "topic"
          ? (item.status === 0 && <p>Mumkin emas</p>) ||
            (item.status === 1 && <p>O'qilayotgan</p>) ||
            (item.status === 2 && <p>O'qib bo'lingan</p>)
          : (item.status === 1 && <p>Topshirilayotgan test</p>) ||
            (item.status === 2 && item.is_passed === "1" && (
              <p>Topshirilgan test</p>
            )) ||
            (item.status === 2 && item.is_passed === "0" && (
              <p>O'ta olinmagan test</p>
            )) ||
            (item.status === 0 && <p>Mumkin emas</p>)}
      </div>
      <Meta
        avatar={
          subject === "topic" ? (
            <BiBook className="card__icon" style={{ fill: "brown" }} />
          ) : (
            <BiPencil className="card__icon" style={{ fill: "green" }} />
          )
        }
        title={
          <Tooltip title={title} placement="bottomLeft">
            {title}
          </Tooltip>
        }
        description={
          <Tooltip title={teaser} placement="bottomLeft">
            {teaser}
          </Tooltip>
        }
      />
    </Card>
  );
};

export default MyCardSubjectList;
