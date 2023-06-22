import { Button, Card, Tooltip } from "antd";
import "./style.scss";
import Meta from "antd/es/card/Meta";
import { BiBook, BiPencil } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";

const CardSubjectList = ({ title, teaser, subject, click, disabled }) => {
  const navigate = useNavigate();
  const param = useParams();

  // linkToSubject
  const linkToSubject = (id) => {
    navigate(`/nurse/course/subject/${id}`, { state: { message: param.id } });
  };

  return (
    <Card
      className="cardSubject"
      cover={<img className="card__img" src="" alt="img" />}
      actions={[
        <Button
          disabled={disabled}
          className={"card__btn"}
          key="more"
          onClick={() => linkToSubject(click)}
        >
          Batafsil
        </Button>,
      ]}
    >
      <div className="card__type">{subject}</div>
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
        description={ <Tooltip title={teaser} placement="bottomLeft">
        {teaser}
      </Tooltip>}
      />
    </Card>
  );
};

export default CardSubjectList;
