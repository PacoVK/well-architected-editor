import { Button, Input } from "@cloudscape-design/components";

import { Box, Grid, Textarea } from "@cloudscape-design/components";

import { FormField } from "@cloudscape-design/components";
import { Choice } from "../types";

type ChoiceFormProps = {
  idx: number;
  choices: Choice[];
  setChoices: (choices: Choice[]) => void;
};

export default function ChoiceForm({
  idx,
  choices,
  setChoices,
}: ChoiceFormProps) {
  return (
    <>
      <Grid
        gridDefinition={[
          { colspan: { default: 12, xxs: 6 } },
          { colspan: { default: 12, xxs: 6 } },
        ]}
      >
        <FormField
          description='The ID is generated automatically. The IDs used in a choice must be unique and can be from 3 to 128 characters and contain only alphanumeric and underscore ("_") characters.'
          label="ID"
        >
          <Input value={choices[idx].id} disabled={true} />
        </FormField>
        <Box
          textAlign="center"
          float="left"
          margin={{ top: "xxxl", bottom: "n" }}
          display="block"
        >
          <Button
            formAction="none"
            onClick={() => {
              const tmpItems = [...choices];
              tmpItems.splice(idx, 1);
              setChoices(tmpItems);
            }}
          >
            Remove
          </Button>
        </Box>
      </Grid>

      <FormField
        description="Title of the choice. The title can be up to 128 characters."
        label="Title"
      >
        <Textarea
          value={choices[idx].title || ""}
          placeholder="Enter Title"
          onChange={(event) => {
            const newChoices = [...choices];
            newChoices[idx] = {
              ...newChoices[idx],
              title: event.detail.value,
            };
            setChoices(newChoices);
          }}
        />
      </FormField>
      <FormField
        description="Text that provides helpful information about a choice. The text can be up to 2048 characters. Must be included if helpfulResource url is specified."
        label="Helpful resource display text"
      >
        <Textarea
          value={choices[idx].helpfulResource?.displayText || ""}
          placeholder="Enter helpful resource display text"
          onChange={(event) => {
            const newChoices = [...choices];
            newChoices[idx] = {
              ...newChoices[idx],
              helpfulResource: {
                ...newChoices[idx].helpfulResource,
                displayText: event.detail.value,
              },
            };
            setChoices(newChoices);
          }}
        />
      </FormField>
      <FormField
        description="A URL resource that explains the choice in more detail. The URL must start with http:// or https://"
        label={
          <span>
            Helpful resource URL <i>- optional</i>{" "}
          </span>
        }
      >
        <Input
          value={choices[idx].helpfulResource?.url || ""}
          onChange={(event) => {
            const newChoices = [...choices];
            newChoices[idx] = {
              ...newChoices[idx],
              helpfulResource: {
                ...newChoices[idx].helpfulResource,
                url: event.detail.value,
              },
            };
            setChoices(newChoices);
          }}
        />
      </FormField>

      <FormField
        description="Text that describes how a choice can be improved upon. The text can be up to 2048 characters. An improvementPlan is required for each choice, except for a None of these choice."
        label="Improvement plan display text"
      >
        <Textarea
          value={choices[idx].improvementPlan?.displayText || ""}
          placeholder="Enter improvement plan display text"
          onChange={(event) => {
            const newChoices = [...choices];
            newChoices[idx] = {
              ...newChoices[idx],
              improvementPlan: {
                ...newChoices[idx].improvementPlan,
                displayText: event.detail.value,
              },
            };
            setChoices(newChoices);
          }}
        />
      </FormField>
      <FormField>
        <hr />
      </FormField>
    </>
  );
}
