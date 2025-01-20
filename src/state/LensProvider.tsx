import { ReactNode, useState } from "react";
import { Question, WellArchitectedLens } from "../types";
import { LensContext } from "./LensContext";

type LensProviderProps = {
  children: ReactNode;
  initialLens?: WellArchitectedLens;
};

export const LensProvider = ({ children, initialLens }: LensProviderProps) => {
  const [lens, setLens] = useState<WellArchitectedLens>(
    initialLens || {
      schemaVersion: "2021-11-01",
      name: "",
      description: "",
      pillars: [],
    },
  );

  const fetchLensIfAny = () => {
    const localData = localStorage.getItem("data");
    if (localData) {
      const data = JSON.parse(localData);
      setLens(data);
    }
  };

  const persistLens = (lens: WellArchitectedLens) => {
    setLens(lens);
    localStorage.setItem("data", JSON.stringify(lens));
  };

  const resetLens = () => {
    setLens({
      schemaVersion: "2021-11-01",
      name: "",
      description: "",
      pillars: [],
    });
    localStorage.setItem(
      "data",
      JSON.stringify({
        schemaVersion: "2021-11-01",
        name: "",
        description: "",
        pillars: [],
      }),
    );
  };

  const deleteQuestions = (pillarName: string, questionIds: string[]) => {
    const questions =
      lens.pillars.find((p) => p.name === pillarName)?.questions || [];
    const curatedQuestions = questions.filter(
      (q) => !questionIds.includes(q.id),
    );
    const newLens = {
      ...lens,
      pillars: lens.pillars.map((p) =>
        p.name === pillarName ? { ...p, questions: curatedQuestions } : p,
      ),
    };
    setLens(newLens);
    localStorage.setItem("data", JSON.stringify(newLens));
  };

  const addQuestion = (pillarName: string, question: Question) => {
    const questions =
      lens.pillars.find((p) => p.name === pillarName)?.questions || [];
    let newQuestions: Question[] = [];
    if (question.id) {
      const idx = questions.findIndex((q) => q.id === question.id);
      newQuestions = questions.filter((q) => q.id !== question.id);
      newQuestions.splice(idx, 0, question);
    } else {
      question.id = `${pillarName.toLowerCase()}_q${questions.length + 1}`;
      newQuestions = [...questions, question];
    }
    const newLens = {
      ...lens,
      pillars: lens.pillars.map((p) =>
        p.name === pillarName ? { ...p, questions: newQuestions } : p,
      ),
    };
    setLens(newLens);
    localStorage.setItem("data", JSON.stringify(newLens));
  };

  return (
    <LensContext.Provider
      value={{
        lens,
        actions: {
          setLens,
          persistLens,
          fetchLensIfAny,
          addQuestion,
          deleteQuestions,
          resetLens,
        },
      }}
    >
      {children}
    </LensContext.Provider>
  );
};
