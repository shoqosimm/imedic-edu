import { Button, Card, Tooltip } from "antd";
import "./style.scss";
import Meta from "antd/es/card/Meta";
import { BiBook, BiPencil } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../utils/api";
import AltImg from "../../../assets/bgImg/3.jpeg";
import { t } from "i18next";

const MyCardSubjectList = ({
  title,
  teaser,
  subject,

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
      cover={
        <img
          style={{ objectFit: "cover" }}
          className="card__img"
          src={
            item?.image
              ? `${api.defaults.baseURL}${item?.image?.file_url} `
              : AltImg
          }
          alt="img"
        />
      }
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
                {t('again')}
                </Button>
                <Button
                  title={disabled ? "not allowed" : " Natijani ko'rish"}
                  disabled={disabled}
                  onClick={() => showResult(item.id)}
                  className={"card_result"}
                >
                  {t('result')}
                </Button>
              </>
            )) ||
              (item.is_passed === "1" && (
                <>
                  <Button
                    title={disabled ? "not allowed" : t('result')}
                    disabled={disabled}
                    onClick={() => showResult(item.id)}
                    className={"card_result"}
                    style={{width:180}}
                  >
                    {t('result')} 
                  </Button>
                </>
              ))}
          </div>
        ) : (
          <Button
            title={disabled ? "not allowed" : t('toSee')}
            disabled={disabled}
            onClick={() => linkToSubject(item.id)}
            className={"card__btn"}
          >
          {item.subject.subject_type === "test" ? t('submission') :t('more')}
          </Button>
        ),
      ]}
    >
      <div className="card__type">
        {" "}
        {item.subject.subject_type === "topic"
          ? (item.status === 0 && <p>{t('notAllow')}</p>) ||
            (item.status === 1 && <p>{t('reading')}</p>) ||
            (item.status === 2 && <p>{t('hasBeenRead')}</p>)
          : (item.status === 1 && <p>{t('testProgress')}</p>) ||
            (item.status === 2 && item.is_passed === "1" && (
              <p>{t('submitTest')}</p>
            )) ||
            (item.status === 2 && item.is_passed === "0" && (
              <p>{t("failedTest")}</p>
            )) ||
            (item.status === 0 && <p>{t('')}</p>)}
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
