import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DefaultErrorMessage from "DefaultErrorMessage";
import { getOnServer } from "server";
import Loader from "features/navigation/Loader";
import L5RAEGRoll from "features/d10/D10IdentifiedRoll";
import DnDRoll from "features/dnd/IdentifiedRoll.js";

const Show = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    setLoading(true);
    getOnServer({
      uri: `/rolls/${id}`,
      success: (data) => {
        setData(data);
        setLoading(false);
      },
      error: () => {
        setError(true);
        setLoading(false);
      },
    });
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <DefaultErrorMessage />;
  }

  if (!data) {
    return null;
  }

  switch (data.type) {
    case "AEG-L5R":
      return <L5RAEGRoll {...data} player={data.user} />;
    case "DnD":
      return <DnDRoll {...data} player={data.user} />;
    default:
      return null;
  }
};

export default Show;
