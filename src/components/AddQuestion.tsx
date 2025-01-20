import { Choice, Pillar, Question, RiskRule, Risks } from "../types";
import {
  Box,
  Button,
  Container,
  Form,
  FormField,
  Header,
  Input,
  Select,
  SpaceBetween,
  Textarea,
} from "@cloudscape-design/components";
import { FormEventHandler, useEffect, useState } from "react";
import { useLens } from "../state/LensHook";
import ChoiceEditor from "./ChoiceEditor";

type AddQuestionProps = {
  onCancel: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  pillar: Pillar;
  question?: Question;
};

const defaultRiskRules: RiskRule[] = [
  { risk: Risks.HIGH_RISK, condition: "default" },
  { risk: Risks.MEDIUM_RISK, condition: "" },
  { risk: Risks.NO_RISK, condition: "" },
];

export default function AddQuestion({
  onSubmit,
  onCancel,
  pillar,
  question,
}: AddQuestionProps) {
  const {
    actions: { addQuestion },
  } = useLens();

  const [choices, setChoices] = useState([] as Choice[]);
  const [riskRules, setRiskRules] = useState<RiskRule[]>(defaultRiskRules);
  const [addNoneOfThese, setAddNoneOfThese] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const [selectedDefault, setSelectedDefault] = useState({
    label: "High Risk",
    value: Risks.HIGH_RISK,
  });

  useEffect(() => {
    if (question) {
      const riskRule = question.riskRules.find(
        (r) => r.condition === "default",
      );
      setSelectedDefault({
        label: riskRule?.risk || "High Risk",
        value: riskRule?.risk || Risks.HIGH_RISK,
      });
      const unsetRiskRules = defaultRiskRules.filter(
        (defaultRule) =>
          !question.riskRules.find((r) => r.risk === defaultRule.risk),
      );
      setRiskRules([
        ...unsetRiskRules,
        ...JSON.parse(JSON.stringify(question.riskRules)),
      ]);
      setChoices(
        question?.choices ? JSON.parse(JSON.stringify(question.choices)) : [],
      );
      setQuestionTitle(question.title);
      setQuestionDescription(question.description || "");
    }
  }, [question]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const newQuestion = {
      id: question?.id || "",
      title: questionTitle,
      description: questionDescription,
      ...{ choices },
      ...{ riskRules },
    };
    addQuestion(pillar.name, newQuestion);
    setChoices([]);
  };

  return (
    <Container header={<Header>{pillar.name}</Header>}>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
          onSubmit(e);
        }}
      >
        <Form
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <Button
                formAction="none"
                variant="link"
                onClick={() => {
                  setAddNoneOfThese(false);
                  setQuestionDescription(question?.description || "");
                  setQuestionTitle(question?.title || "");
                  setChoices(
                    question?.choices
                      ? JSON.parse(JSON.stringify(question.choices))
                      : [],
                  );
                  setRiskRules(
                    question?.riskRules
                      ? JSON.parse(JSON.stringify(question.riskRules))
                      : defaultRiskRules,
                  );
                  const riskRule = question?.riskRules.find(
                    (r) => r.condition === "default",
                  );
                  setSelectedDefault({
                    label: riskRule?.risk || "High Risk",
                    value: riskRule?.risk || Risks.HIGH_RISK,
                  });
                  onCancel();
                }}
              >
                Cancel
              </Button>
              <Button variant="primary">Save</Button>
            </SpaceBetween>
          }
          header={
            <Header variant="h3">
              {question?.title ? "Edit question" : "Add new question"}
            </Header>
          }
        >
          <FormField
            description='The question ID is generated automatically. The IDs used in a question must be unique and can be from 3 to 128 characters and contain only alphanumeric and underscore ("_") characters.'
            label={<span>Question ID</span>}
          >
            <Input
              value={question?.id || "will-be-generated"}
              disabled={true}
            />
          </FormField>
          <FormField
            description="Title of the question. The title can be up to 128 characters."
            label={<span>Title</span>}
          >
            <Textarea
              value={questionTitle || ""}
              onChange={(event) => setQuestionTitle(event.detail.value)}
            />
          </FormField>
          <FormField>
            <Box padding={{ top: "m", bottom: "m" }}>
              <hr />
            </Box>
          </FormField>
          <FormField
            description="Describes the question in more detail. The description can be up to 2048 characters."
            label={
              <span>
                Description <i>- optional</i>{" "}
              </span>
            }
          >
            <Textarea
              value={questionDescription || ""}
              onChange={(event) => setQuestionDescription(event.detail.value)}
            />
          </FormField>
          <ChoiceEditor
            choices={choices}
            setChoices={setChoices}
            addNoneOfTheseChoice={addNoneOfThese}
            setAddNoneOfTheseChoice={setAddNoneOfThese}
            questionId={question?.id}
          />
          <FormField>
            <Box padding={{ top: "l", bottom: "n" }}>
              <hr />
            </Box>
          </FormField>
          <FormField
            description="A Boolean expression of the choices that maps to a risk level for the question, or default. There must be a default risk rule for each question."
            label={<h3>Risk rules</h3>}
          >
            <Select
              selectedOption={selectedDefault}
              onChange={({ detail }) => {
                const selectedRisk = detail.selectedOption as {
                  label: string;
                  value: Risks;
                };
                setSelectedDefault(selectedRisk);
                const filteredRisks = riskRules.map((r) => {
                  if (r.risk === selectedRisk.value) {
                    return { ...r, condition: "default" };
                  } else if (r.condition === "default") {
                    const priorDefault = question?.riskRules.find(
                      (qr) => qr.risk === r.risk,
                    );
                    return {
                      ...r,
                      condition:
                        priorDefault?.condition === "default"
                          ? ""
                          : priorDefault?.condition || "",
                    };
                  }
                  return r;
                });
                setRiskRules(filteredRisks);
              }}
              options={[
                { label: "High Risk", value: Risks.HIGH_RISK },
                { label: "Medium Risk", value: Risks.MEDIUM_RISK },
                { label: "No Risk", value: Risks.NO_RISK },
              ]}
            />
          </FormField>
          <FormField
            description="High risk issues (HRIs) are architectural and operational choices that AWS has found might result in significant negative impact to a business. These HRIs might affect organizational operations, assets, and individuals."
            label={<span>{Risks.HIGH_RISK}</span>}
          >
            <Input
              value={
                selectedDefault.value === Risks.HIGH_RISK
                  ? "default"
                  : riskRules.find((r) => r.risk === Risks.HIGH_RISK)
                      ?.condition || ""
              }
              disabled={selectedDefault.value === Risks.HIGH_RISK}
              placeholder={
                selectedDefault.value === Risks.HIGH_RISK
                  ? "Set as default"
                  : ""
              }
              onChange={(event) => {
                const tmpRiskRules = riskRules.map((r) => {
                  if (r.risk === Risks.HIGH_RISK) {
                    return { ...r, condition: event.detail.value };
                  }
                  return r;
                });
                setRiskRules(tmpRiskRules);
              }}
            />
          </FormField>
          <FormField
            description="Medium risk issues (MRIs) are architectural and operational choices that AWS has found might negatively impact business, but to a lesser extent than High risk issues."
            label={<span>{Risks.MEDIUM_RISK}</span>}
          >
            <Input
              value={
                selectedDefault.value === Risks.MEDIUM_RISK
                  ? "default"
                  : riskRules.find((r) => r.risk === Risks.MEDIUM_RISK)
                      ?.condition || ""
              }
              disabled={selectedDefault.value === Risks.MEDIUM_RISK}
              placeholder={
                selectedDefault.value === Risks.MEDIUM_RISK
                  ? "Set as default"
                  : ""
              }
              onChange={(event) => {
                const tmpRiskRules = riskRules.map((r) => {
                  if (r.risk === Risks.MEDIUM_RISK) {
                    return { ...r, condition: event.detail.value };
                  }
                  return r;
                });
                setRiskRules(tmpRiskRules);
              }}
            />
          </FormField>
          <FormField
            description="If you meet the criteria for this risk level, you are not at risk."
            label={<span>{Risks.NO_RISK}</span>}
          >
            <Input
              value={
                selectedDefault.value === Risks.NO_RISK
                  ? "default"
                  : riskRules.find((r) => r.risk === Risks.NO_RISK)
                      ?.condition || ""
              }
              disabled={selectedDefault.value === Risks.NO_RISK}
              placeholder={
                selectedDefault.value === Risks.NO_RISK ? "Set as default" : ""
              }
              onChange={(event) => {
                const tmpRiskRules = riskRules.map((r) => {
                  if (r.risk === Risks.NO_RISK) {
                    return { ...r, condition: event.detail.value };
                  }
                  return r;
                });
                setRiskRules(tmpRiskRules);
              }}
            />
          </FormField>
        </Form>
      </form>
    </Container>
  );
}
