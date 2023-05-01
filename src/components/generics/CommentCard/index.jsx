import React from "react";
import "./style.scss";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import moment from "moment/moment";

const CommentCard = ({ data }) => {
  return (
    <div className="wrapperCommentdw d-flex align-center gap-1">
      <div className="badge d-flex align-center gap-1">
        <Avatar icon={<UserOutlined />} />
        <h2>
          {data?.user?.first_name}, {data?.user?.last_name}
        </h2>
      </div>
      <div className="content d-flex align-center justify-between">
        <div className="comment__userInfo">
          <em>- {data?.comment}</em>
        </div>
        <p>{moment(data?.created_at).format("DD.MM.YYYY - HH:mm")}</p>
      </div>
    </div>
  );
};

export default CommentCard;
