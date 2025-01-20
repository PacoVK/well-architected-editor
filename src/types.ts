export type WellArchitectedLens = {
  schemaVersion: string;
  name: string;
  description: string;
  pillars: Pillar[];
};

export type Pillar = {
  id: string;
  name: string;
  questions: Question[];
};

export type Choice = {
  id: string;
  title: string;
  helpfulResource: {
    displayText: string;
    url: string;
  };
  improvementPlan: {
    displayText: string;
  };
};

export type RiskRule = {
  condition: string;
  risk: (typeof Risks)[keyof typeof Risks];
};

export type Question = {
  id: string;
  title: string;
  description?: string;
  choices: Choice[];
  riskRules: RiskRule[];
};

export enum Risks {
  HIGH_RISK = "HIGH_RISK",
  MEDIUM_RISK = "MEDIUM_RISK",
  NO_RISK = "NO_RISK",
}
