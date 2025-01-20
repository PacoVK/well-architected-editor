import React, { createContext } from "react";
import { Question, WellArchitectedLens } from "../types";

type actions = {
  setLens: React.Dispatch<React.SetStateAction<WellArchitectedLens>>;
  persistLens: (lens: WellArchitectedLens) => void;
  fetchLensIfAny: () => void;
  addQuestion: (pillarName: string, question: Question) => void;
  deleteQuestions: (pillarName: string, questionIds: string[]) => void;
  resetLens: () => void;
};

export const LensContext = createContext({
  lens: {} as WellArchitectedLens,
  actions: {} as actions,
});
