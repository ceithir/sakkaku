import { chances } from "l5r-ffg-probabilities";

export const asyncChances = (params) => {
  postMessage({ type: "custom", params, result: chances(params) });
};
