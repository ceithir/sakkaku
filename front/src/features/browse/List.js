import React, { useEffect, useState } from "react";
import { Table, Typography, Button, Popconfirm } from "antd";
import { getOnServer, authentifiedRequestOnServer } from "../../server";
import CheckResult from "./CheckResult";
import queryString from "query-string";
import styles from "./List.module.css";
import DefaultErrorMessage from "../../DefaultErrorMessage";
import { Link, useLocation } from "react-router-dom";
import Loader from "../navigation/Loader";
import Pagination from "../../Pagination";
import HeritageResult from "./HeritageResult";
import heritageTables from "../heritage/data/heritage";
import { CharacterLink, CampaignLink, PlayerLink } from "../navigation/Links";
import Description from "features/trinket/Description";
import { stringify as aegStringify } from "features/d10/formula";
import FFGSWResult from "./FFGSWResult";
import { isAForceRoll, netSuccesses } from "features/sw/Result";
import { stringify as dndStringify } from "features/dnd/formula";
import { selectUser } from "features/user/reducer";
import { useSelector } from "react-redux";

const { Text } = Typography;

const defaultColumns = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (date) => {
      return (
        <Text>
          <span>{new Date(date).toLocaleDateString()}</span>
          <span className={styles.time}>
            {" "}
            {new Date(date).toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              timeZoneName: "short",
            })}
          </span>
        </Text>
      );
    },
  },
  {
    title: "Campaign",
    dataIndex: "campaign",
    key: "campaign",
    render: (campaign) => {
      return <CampaignLink campaign={campaign} />;
    },
  },
  {
    title: "Character",
    dataIndex: "character",
    key: "character",
    render: ({ character, campaign }) => {
      return <CharacterLink campaign={campaign} character={character} />;
    },
  },
  {
    title: "Player",
    dataIndex: "player",
    key: "player",
    render: (player) => {
      return <PlayerLink player={player} />;
    },
    responsive: ["md"],
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    responsive: ["lg"],
    render: ({ description, type, metadata }) => {
      if (!description && type === "FFG-L5R-Heritage") {
        return (
          <Text type="secondary">{heritageTables[metadata?.table]?.name}</Text>
        );
      }

      return <Description>{description}</Description>;
    },
  },
  {
    title: `Dice pool`,
    dataIndex: "input",
    key: "input",
    render: ({ metadata, roll, type }) => {
      if (type === "AEG-L5R") {
        return <>{aegStringify(roll.parameters)}</>;
      }

      if (["FFG-L5R-Heritage"].includes(type)) {
        return `—`;
      }

      if (type === "DnD") {
        return <>{dndStringify(roll.parameters)}</>;
      }

      if (type === "Cyberpunk-RED") {
        const modifier = roll.parameters.modifier;
        if (!modifier) {
          return <>{`"1d10"`}</>;
        }
        if (modifier < 0) {
          return <>{`"1d10"${modifier}`}</>;
        }
        return <>{`"1d10"+${modifier}`}</>;
      }

      return <Text type="secondary">{`See page`}</Text>;
    },
    responsive: ["md"],
    align: "center",
  },
  {
    title: "Result",
    dataIndex: "result",
    key: "result",
    render: ({ result, type, metadata, parameters }) => {
      if (!result) {
        return <Text type="secondary">{`Ongoing…`}</Text>;
      }

      if (type === "FFG-L5R") {
        return <CheckResult {...result} />;
      }

      if (type === "FFG-L5R-Heritage") {
        return <HeritageResult result={result} metadata={metadata} />;
      }

      if (type === "AEG-L5R" || type === "DnD" || type === "Cyberpunk-RED") {
        return <strong>{result["total"]}</strong>;
      }

      if (type === "FFG-SW") {
        return <FFGSWResult parameters={parameters} result={result} />;
      }

      return null;
    },
    responsive: ["md"],
    align: "center",
  },
  {
    title: "Success?",
    dataIndex: "success",
    key: "success",
    align: "center",
    render: ({ type, roll, result }) => {
      const { parameters } = roll;

      if (["FFG-L5R", "AEG-L5R", "DnD", "Cyberpunk-RED"].includes(type)) {
        const tn = parameters.tn;

        if (!result) {
          return <Text type="secondary">{"TBD"}</Text>;
        }

        if (!tn) {
          return <Text>{"?"}</Text>;
        }

        const total = result.total || result.success;

        return total >= tn ? (
          <Text type="success">{"Yes"}</Text>
        ) : (
          <Text type="danger">{"No"}</Text>
        );
      }

      if (type === "FFG-SW" && !isAForceRoll(parameters)) {
        return netSuccesses(result) > 0 ? (
          <Text type="success">{"Yes"}</Text>
        ) : (
          <Text type="danger">{"No"}</Text>
        );
      }

      return "—";
    },
    responsive: ["md"],
  },
  {
    title: `Link`,
    dataIndex: "see_more",
    key: "see_more",
    render: ({ id, uuid, type }) => {
      const url = (() => {
        if (type === "FFG-L5R") {
          return `/rolls/${id}`;
        }

        if (type === "FFG-L5R-Heritage") {
          return `/heritage/${uuid}`;
        }

        if (["AEG-L5R", "DnD", "Cyberpunk-RED"].includes(type)) {
          return `/r/${id}`;
        }

        if (type === "FFG-SW") {
          return `/ffg-sw-rolls/${id}`;
        }

        return null;
      })();

      if (!url) {
        return null;
      }

      return (
        <Link title="See more" to={url} className={styles["see-more"]}>
          {"➥"}
        </Link>
      );
    },
  },
];

const columns = ({ user, softReload }) => {
  return [
    ...defaultColumns,
    ...(user?.superadmin
      ? [
          {
            title: "Admin",
            dataIndex: "admin",
            key: "admin",
            render: ({ id, description }) => {
              return (
                <Popconfirm
                  title={<>{`Delete the roll "${description}"?`}</>}
                  onConfirm={() => {
                    authentifiedRequestOnServer({
                      uri: `/admin/rolls/${id}`,
                      method: "DELETE",
                      success: () => {
                        softReload();
                      },
                      error: (e) => {
                        // Old school but good enough for admin only edge case
                        alert(e);
                      },
                    });
                  }}
                  okText={`Yes`}
                  cancelText={`No`}
                >
                  <Button danger>{`Delete`}</Button>
                </Popconfirm>
              );
            },
          },
        ]
      : []),
  ];
};

const List = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();
  const location = useLocation();

  const query = queryString.parse(location.search);
  const page = parseInt(query["page"]) || 1;
  const uri = `/rolls?${queryString.stringify({
    ...query,
    page,
  })}`;

  const user = useSelector(selectUser);

  const loadList = (uri) => {
    const timeoutID = setTimeout(() => {
      setLoading(true);
    }, 100);
    getOnServer({
      uri,
      success: (data) => {
        clearTimeout(timeoutID);
        setData(data);
        setLoading(false);
      },
      error: (_) => {
        clearTimeout(timeoutID);
        setError(true);
        setLoading(false);
      },
    });
  };
  const softReload = () => loadList(uri);

  useEffect(() => {
    loadList(uri);
  }, [uri]);

  if (loading) {
    return <Loader className={styles.loader} />;
  }

  if (error) {
    return <DefaultErrorMessage />;
  }

  if (!data) {
    return null;
  }

  const dataSource = data.items.map(
    ({
      id,
      uuid,
      type,
      created_at,
      campaign,
      character,
      user,
      description,
      result,
      roll,
    }) => {
      const { parameters, metadata } = roll;

      return {
        key: id,
        date: created_at,
        campaign,
        character: { campaign, character },
        player: user,
        description: { description, type, metadata },
        result: { result, type, metadata, parameters },
        success: { type, roll, result },
        see_more: { id, uuid, type },
        input: { metadata, roll, type },
        admin: { id, description },
      };
    }
  );

  return (
    <>
      <Table
        columns={columns({ user, softReload })}
        dataSource={dataSource}
        pagination={false}
      />
      <div className={styles["blank-filler"]} />
      <Pagination
        pageSize={data["per_page"]}
        current={page}
        total={data["total"]}
      />
    </>
  );
};

export default List;
