import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DefaultErrorMessage from "DefaultErrorMessage";
import { getOnServer } from "server";
import Loader from "features/navigation/Loader";
import L5RAEGRoll from "features/d10/D10IdentifiedRoll";
import DnDRoll from "features/dnd/IdentifiedRoll";
import CyberpunkRoll from "features/cyberpunk/Roll";
import FFGSWRoll from "features/sw/Roll";
import L5RFFGHeritageRoll from "features/heritage/RollLoader";

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

  const params = {
    ...data,
    player: data.user,
  };

  switch (data.type) {
    case "AEG-L5R":
      return <L5RAEGRoll {...params} />;
    case "DnD":
      return <DnDRoll {...params} />;
    case "Cyberpunk-RED":
      return <CyberpunkRoll {...params} />;
    case "FFG-SW":
      return <FFGSWRoll {...params} />;
    case "FFG-L5R-Heritage":
      return <L5RFFGHeritageRoll {...params} />;
    default:
      return null;
  }
};

export default Show;
