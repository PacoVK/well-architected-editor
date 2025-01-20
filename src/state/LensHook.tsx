import { useContext } from "react";
import { LensContext } from "./LensContext";

export const useLens = () => {
  return useContext(LensContext);
};
