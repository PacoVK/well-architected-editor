import {
  Box,
  Button,
  ButtonDropdown,
  ColumnLayout,
  Container,
  ExpandableSection,
  Header,
  SpaceBetween,
  Table,
} from "@cloudscape-design/components";
import { useEffect, useState } from "react";
import { Pillar, Question } from "../types";
import { useLens } from "../state/LensHook";
import AddQuestion from "./AddQuestion";
import RiskBadge from "./RiskBadge";

const skeleton: Question = {
  id: "",
  title: "",
  choices: [],
  riskRules: [],
};

export default function QuestionsOverview({ pillar }: { pillar: Pillar }) {
  const {
    lens,
    actions: { deleteQuestions },
  } = useLens();
  const [selectedItems, setSelectedItems] = useState<Question[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [question, setQuestion] = useState<Question>(skeleton);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    setQuestions(lens.pillars.find((p) => p.id === pillar.id)?.questions || []);
    setQuestion(skeleton);
    setFormOpen(false);
    setSelectedItems([]);
  }, [pillar, lens]);

  const handleSubmit = () => {
    setQuestions([...questions, question]);
    setFormOpen(false);
    setQuestion(skeleton);
  };

  return (
    <>
      <SpaceBetween size={formOpen ? "m" : "xxxs"}>
        <div hidden={!formOpen}>
          <AddQuestion
            pillar={pillar}
            question={question}
            onSubmit={handleSubmit}
            onCancel={() => {
              setFormOpen(false);
            }}
          />
        </div>
        <Container>
          <Table
            onSelectionChange={({ detail }) =>
              setSelectedItems(detail.selectedItems)
            }
            selectedItems={selectedItems}
            variant={"full-page"}
            header={
              <Header
                actions={
                  <SpaceBetween direction="horizontal" size="xs">
                    <ButtonDropdown
                      onItemClick={({ detail }) => {
                        if (detail.id === "rm") {
                          const selectedItemIds = selectedItems.map(
                            (item) => item.id,
                          );
                          deleteQuestions(pillar.name, selectedItemIds);
                          setSelectedItems([]);
                        }
                        if (detail.id === "edit") {
                          setQuestion(selectedItems[0]);
                          setFormOpen(true);
                        }
                      }}
                      items={[
                        {
                          text: "Delete",
                          id: "rm",
                          disabled: selectedItems.length < 1,
                        },
                        {
                          text: "Edit",
                          id: "edit",
                          disabled: selectedItems.length !== 1,
                        },
                      ]}
                    >
                      Actions
                    </ButtonDropdown>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setQuestion({
                          ...skeleton,
                          ...{
                            id: `${pillar.name.toLowerCase()}_q${questions.length + 1}`,
                          },
                        });
                        setFormOpen(true);
                      }}
                    >
                      Add new question
                    </Button>
                  </SpaceBetween>
                }
              >
                {pillar.name} questions
              </Header>
            }
            renderAriaLive={({ firstIndex, lastIndex, totalItemsCount }) =>
              `Displaying items ${firstIndex} to ${lastIndex} of ${totalItemsCount}`
            }
            columnDefinitions={[
              {
                id: "title",
                header: "Title",
                cell: (item) => (
                  <ExpandableSection headerText={item.title || "-"}>
                    <ColumnLayout columns={2}>
                      <div>
                        <h3>Choices:</h3>
                        {item.choices.map((choice, index) => (
                          <Box key={index}>
                            <b>
                              <small>{choice.id}</small>
                              <br />
                              {choice.title}
                            </b>
                            <p>{choice.improvementPlan?.displayText || ""}</p>
                          </Box>
                        ))}
                      </div>
                      <div>
                        <h3>Risk Rules:</h3>
                        {item.riskRules.map((rule, index) => (
                          <Box key={index}>
                            <p>
                              <RiskBadge risk={rule.risk} />
                            </p>
                            <p>{rule.condition || "no condition set"}</p>
                          </Box>
                        ))}
                      </div>
                    </ColumnLayout>
                  </ExpandableSection>
                ),
                sortingField: "title",
                isRowHeader: true,
              },
              {
                id: "description",
                header: "Description",
                cell: (item) => item.description || "-",
              },
            ]}
            enableKeyboardNavigation
            items={questions}
            loadingText="Loading resources"
            sortingDisabled
            stripedRows
            wrapLines
            selectionType={"multi"}
            empty={
              <Box
                margin={{ vertical: "xs" }}
                textAlign="center"
                color="inherit"
              >
                <SpaceBetween size="m">
                  <b>No resources</b>
                </SpaceBetween>
              </Box>
            }
          />
        </Container>
      </SpaceBetween>
    </>
  );
}
