import { Breadcrumb, Button, Card,  Spin } from "antd";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { BiHome } from "react-icons/bi";
import "./style.scss";
import { useParams, Link } from "react-router-dom";
import { api } from "../../../../utils/api";
import CommentCard from "../../../generics/CommentCard";
import CardSubjectList from "../../../generics/CardSubjectList";
import EmptyBox from '../../../../assets/illustration/emptyBox.webp'
import { t } from "i18next";

const SubjectPage = () => {
  const param = useParams();
  const [subjects, setSubjects] = useState([]);
  const [emptyText, setEmptyText] = useState();
  const [commentEmptyText, setCommentEmptyText] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState();
  const [paginateComment, setPaginateComment] = useState(12);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const controller = new AbortController();
  // getSubjects
  const getSubjects = (id) => {
    setLoading(true);
    api
      .get(`api/nurse/course/list/${id}`, { signal: controller.signal })
      .then((res) => {
        setLoading(false);
        if (res.data.data.length <= 0) {
          setEmptyText(" Ushbu kurs bo'yicha mavzular yo'q!...");
          getComments(param.id, paginateComment);
        } else {
          setSubjects(
            res.data.data.map((item) => {
              return {
                ...item,
                id: item.id,
                name: item.name,
                teaser: item.teaser,
                subject_type: item.subject_type,
              };
            })
          );
          getComments(param.id, paginateComment);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  // getComments
  const getComments = (id, newPerPage) => {
    const body = {
      per_page: newPerPage,
      course_id: param.id ?? id,
    };
    api
      .post("api/receive-comment", body)
      .then((res) => {
        if (res.data.data.length > 0) {
          setComment(res.data.data);
        } else {
          setCommentEmptyText(t('notComent'));
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  // handleMoreComment
  const handleMoreComment = () => {
    setLoadingBtn(true);
    const newPerPage = paginateComment + 12;
    setPaginateComment(newPerPage);
    getComments(param.id, newPerPage);
    setLoadingBtn(false);
  };

  const breadcrumbsItems = [
    {
      title: (
        <Link to="/">
          <BiHome />
        </Link>
      ),
    },
  ];

  useEffect(() => {
    getSubjects(param.id);

    return () => {
      controller.abort();
    };
  }, [param]);

  return (
    <>
      <Breadcrumb style={{ marginBottom: "2rem" }} items={breadcrumbsItems} />

      {loading && (
        <Spin
          className="d-flex align-center justify-center"
          style={{ height: "100%" }}
        />
      )}

      <div>
        {emptyText && (
          <div
            className="d-flex flex-column align-center justify-center"
            style={{ background: "#fff", width: "100%", height: "500px" }}
          >
            <img src={EmptyBox} alt="empty" width={"200px"} />
            <em style={{ fontSize: "18px" }}>{emptyText}</em>
          </div>
        )}
        <div className="w-100 d-flex align-center justify-center gap-3 flex-wrap">
          {!loading &&
            subjects &&
            subjects?.map((item, index) => {
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "just", duration: 1.4, bounce: 0.1 }}
                >
                  <CardSubjectList
                    item={item}
                    title={item.name}
                    teaser={item.teaser}
                    subject={item.subject_type}
                    click={item.id}
                    disabled={index === 0 ? false : true}
                  />
                </motion.div>
              );
            })}
        </div>
      </div>

      <Card title={t('coments')} className="izohCard">
        {loading && <Spin />}
        {commentEmptyText && (
          <em
            style={{
              display: "block",
              margin: "2rem 0",
              textAlign: "center",
              color: "grey",
            }}
          >
            {commentEmptyText}
          </em>
        )}
        {comment?.map((item) => {
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ type: "just", duration: 1.7 }}
              viewport={{ once: true }}
            >
              <CommentCard data={item} />
            </motion.div>
          );
        })}
        {!loading && (
          <Button
            disabled={commentEmptyText ? true : false}
            onClick={handleMoreComment}
            loading={loadingBtn}
          >
            {t('leanMore')}
          </Button>
        )}
      </Card>
    </>
  );
};
export default SubjectPage;
