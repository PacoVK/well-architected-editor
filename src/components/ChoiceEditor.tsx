import {
  Button,
  Checkbox,
  FormField,
  Grid,
} from "@cloudscape-design/components";
import { Choice } from "../types";
import ChoiceForm from "./ChoiceForm";

type ChoiceEditorProps = {
  choices: Choice[];
  setChoices: (choices: Choice[]) => void;
  addNoneOfTheseChoice: boolean;
  setAddNoneOfTheseChoice: (add: boolean) => void;
  questionId?: string;
};

export default function ChoiceEditor({
  choices,
  setChoices,
  addNoneOfTheseChoice,
  setAddNoneOfTheseChoice,
  questionId,
}: ChoiceEditorProps) {
  return (
    <>
      <FormField
        description="This section defines the choices that are associated with a question. You must have at least one choice, and can define up to 15 choices for a question in a custom lens."
        label="Choices"
      ></FormField>
      {choices.map((_, index) => (
        <ChoiceForm
          key={index}
          idx={index}
          choices={choices}
          setChoices={setChoices}
        />
      ))}
      <Grid
        gridDefinition={[
          { colspan: { default: 12, xxs: 6 } },
          { colspan: { default: 12, xxs: 6 } },
        ]}
      >
        <FormField>
          <Checkbox
            checked={addNoneOfTheseChoice}
            onChange={({ detail }) => {
              if (detail.checked) {
                setChoices([
                  ...choices,
                  {
                    id: "option_no",
                    title: "None of these",
                    helpfulResource: {
                      displayText:
                        "Choose this if your workload does not follow these best practices.",
                    },
                  } as Choice,
                ]);
              } else {
                setChoices(choices.filter((c) => c.id !== "option_no"));
              }
              setAddNoneOfTheseChoice(detail.checked);
            }}
          >
            Add a "None of these"-choice
          </Checkbox>
        </FormField>
        <Button
          formAction="none"
          onClick={() =>
            setChoices([
              ...choices,
              {
                id: `${questionId}_${choices.length + 1}`,
              } as Choice,
            ])
          }
        >
          Add choice
        </Button>
      </Grid>
    </>
  );
}
