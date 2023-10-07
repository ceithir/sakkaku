import React, { useState } from "react";
import styles from "./DeckSelect.module.less";
import { Form, Radio, Checkbox } from "antd";
import Card from "./Card";
import { l } from "./utils";

const CardsSelect = ({ initialValues }) => {
  const [deckType, setDeckType] = useState(initialValues.deck);

  return (
    <>
      <Form.Item
        label={`Configure deck`}
        name="deck"
        rules={[{ required: true, message: "Required." }]}
      >
        <Radio.Group
          options={[
            { value: 52, label: `Standard 52 cards` },
            { value: 54, label: `Standard 52 cards + 2 jokers` },
            {
              value: "custom",
              label: `Pick from a specific subset of cards`,
            },
          ]}
          onChange={(event) => setDeckType(event.target.value)}
          value={deckType}
        />
      </Form.Item>
      {deckType === "custom" && (
        <Form.Item
          name="custom"
          label={`Unselect the cards you wish to exclude from the deck`}
          className={styles["deck-builder"]}
        >
          <Checkbox.Group>
            {l(54).map((number) => (
              <Checkbox value={number} key={number.toString()}>
                <Card number={number} />
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      )}
    </>
  );
};

export default CardsSelect;
