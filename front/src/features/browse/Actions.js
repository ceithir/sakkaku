import queryString from "query-string";
import { useLocation } from "react-router-dom";
import styles from "./Actions.module.less";
import { Button } from "antd";
import { useState, useEffect } from "react";
import { getOnServer } from "server";
import { dicePoolAsText } from "./List";
import { mkConfig, generateCsv, download } from "export-to-csv";
import sanitizeFilename from "sanitize-filename";
import { Input, Form, AutoComplete } from "antd";
import { useNavigate } from "react-router-dom";

const cleanEntryForCsv = (input) => {
  if (input === null || input === undefined) {
    return "";
  }

  return input;
};

const processData = (rawData) => {
  return rawData
    .map(
      ({
        type,
        roll,
        updated_at,
        campaign,
        character,
        description,
        id,
        result,
        user,
      }) => {
        return {
          date: new Date(updated_at).toUTCString(),
          dicePool: dicePoolAsText({ type, roll }),
          campaign,
          character,
          player: user?.name,
          description,
          tn: roll.parameters?.tn,
          result: result?.total,
          link: `${window.location.origin}/r/${id}`,
        };
      }
    )
    .map((data) => {
      const csvCompliantData = {};
      for (const key in data) {
        csvCompliantData[key] = cleanEntryForCsv(data[key]);
      }
      return csvCompliantData;
    });
};

const csvColumns = [
  {
    key: "date",
    displayLabel: `Date`,
  },
  {
    key: "player",
    displayLabel: `Player`,
  },
  {
    key: "campaign",
    displayLabel: `Campaign`,
  },
  {
    key: "character",
    displayLabel: `Character`,
  },
  {
    key: "description",
    displayLabel: `Description`,
  },
  {
    key: "dicePool",
    displayLabel: `Dice pool`,
  },
  {
    key: "tn",
    displayLabel: `TN`,
  },
  {
    key: "result",
    displayLabel: `Result`,
  },
  {
    key: "link",
    displayLabel: `Link`,
  },
];

const ExportAsCsv = () => {
  const location = useLocation();
  const query = queryString.parse(location.search);
  const { campaign, tag } = query;
  const [loading, setLoading] = useState(false);

  if (!campaign) {
    return;
  }

  const onClick = () => {
    setLoading(true);
    getOnServer({
      uri: `/rolls?${queryString.stringify({ campaign, tag, raw: true })}`,
      success: (data) => {
        const csvConfig = mkConfig({
          columnHeaders: csvColumns,
          filename: sanitizeFilename(`${campaign}${tag ? `-${tag}` : ""}`),
          quoteStrings: true,
        });
        const csv = generateCsv(csvConfig)(processData(data.items));
        download(csvConfig)(csv);

        setLoading(false);
      },
    });
  };

  return (
    <Button
      loading={loading}
      onClick={onClick}
    >{`Export selection as CSV`}</Button>
  );
};

const SearchForm = ({ campaigns, tags, ...formParams }) => {
  return (
    <Form layout="inline" {...formParams}>
      <Form.Item
        label={`Campaign`}
        name="campaign"
        rules={[{ required: true, message: `Please specify a campaign.` }]}
        className={styles.autocomplete}
      >
        <AutoComplete
          options={campaigns.map((campaign) => {
            return { value: campaign };
          })}
          filterOption={true}
        />
      </Form.Item>
      <Form.Item label={`Tag`} name="tag" className={styles.autocomplete}>
        <AutoComplete
          options={tags.map(({ label, campaign }) => {
            return { value: label, campaign };
          })}
          filterOption={true}
        />
      </Form.Item>
      <Form.Item
        label={`Description`}
        name="text"
        tooltip={`Will search for all rolls whose description contains the given word(s).`}
      >
        <Input />
      </Form.Item>
      <div className={styles.buttons}>
        <Button type="primary" htmlType="submit">{`Search`}</Button>
        <ExportAsCsv />
      </div>
    </Form>
  );
};

const Actions = ({ campaigns, tags }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentCampaign, setCurrentCampaign] = useState();

  useEffect(() => {
    const query = queryString.parse(location.search);
    form.setFieldsValue(query);
    setCurrentCampaign(query.campaign);
  }, [location, form]);

  const onFinish = (data) => {
    navigate(`/rolls?${queryString.stringify(data)}`);
  };

  const relevantTags = tags.filter(
    ({ campaign }) => campaign === currentCampaign
  );

  return (
    <div className={styles.container}>
      <h4>{`Filter`}</h4>
      <SearchForm
        form={form}
        onFinish={onFinish}
        campaigns={campaigns}
        tags={relevantTags}
        onValuesChange={(changedValues) => {
          if (Object.keys(changedValues).includes("campaign")) {
            setCurrentCampaign(changedValues.campaign);
          }
        }}
      />
    </div>
  );
};

export default Actions;
