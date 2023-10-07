import React from "react";
import queryString from "query-string";
import { useLocation, Link, useHistory } from "react-router-dom";
import { Pagination } from "antd";
import styles from "./Pagination.module.less";

const CustomPagination = ({ pageSize, current, total }) => {
  const location = useLocation();
  const history = useHistory();

  const pageLink = (pageNumber) => {
    return `${location.pathname}?${queryString.stringify({
      ...queryString.parse(location.search),
      page: pageNumber,
    })}`;
  };

  return (
    <div className={styles.layout}>
      <Pagination
        className={styles.pagination}
        simple
        pageSize={pageSize}
        current={current}
        total={total}
        itemRender={(_, type, originalElement) => {
          if (type === "prev") {
            return <Link to={pageLink(current - 1)}>{"<"}</Link>;
          }
          if (type === "next") {
            return <Link to={pageLink(current + 1)}>{">"}</Link>;
          }
          return originalElement;
        }}
        onChange={(pageNumber) => {
          history.push(pageLink(pageNumber));
        }}
      />
    </div>
  );
};

export default CustomPagination;
