"use client";
import {
  AppLayout,
  Badge,
  Box,
  Button,
  ButtonDropdown,
  ColumnLayout,
  Container,
  ContentLayout,
  FileInput,
  Flashbar,
  FormField,
  Header,
  SideNavigation,
  SpaceBetween,
  SplitPanel,
} from "@cloudscape-design/components";
import { I18nProvider } from "@cloudscape-design/components/i18n";
import messages from "@cloudscape-design/components/i18n/messages/all.en";
import { useEffect, useState } from "react";
import QuestionsOverview from "./components/QuestionsOverview";
import { Pillar, Risks, WellArchitectedLens } from "./types";
import Modals from "./components/Modals";
import { useLens } from "./state/LensHook";
import About from "./components/About";
import Validator from "./components/Validator";

const LOCALE = "en";

export default function App() {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<Pillar>();
  const [pillarModalOpen, setPillarModalOpen] = useState(false);
  const [lensModalOpen, setLensModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const {
    lens,
    actions: { persistLens, fetchLensIfAny },
  } = useLens();
  const [value, setValue] = useState<File[]>([]);
  const [editPillarModalOpen, setEditPillarModalOpen] = useState(false);
  const [deletePillarModalOpen, setDeletePillarModalOpen] = useState(false);
  const [doValidate, setDoValidate] = useState(false);
  const fileReader = new FileReader();
  fileReader.onload = (e) => {
    const content = e.target?.result;
    const lens = JSON.parse(content as string) as WellArchitectedLens;
    const pillars = lens.pillars.map((pillar) => {
      pillar.questions = pillar.questions.map((question) => {
        question.riskRules = [
          {
            risk: Risks.HIGH_RISK,
            condition:
              question.riskRules.find((r) => r.risk === Risks.HIGH_RISK)
                ?.condition || "",
          },
          {
            risk: Risks.MEDIUM_RISK,
            condition:
              question.riskRules.find((r) => r.risk === Risks.MEDIUM_RISK)
                ?.condition || "",
          },
          {
            risk: Risks.NO_RISK,
            condition:
              question.riskRules.find((r) => r.risk === Risks.NO_RISK)
                ?.condition || "",
          },
        ];
        return question;
      });
      return pillar;
    });
    setSelectedPillar(undefined);
    setDoValidate(false);
    persistLens({
      ...lens,
      pillars,
    });
  };

  useEffect(() => {
    fetchLensIfAny();
  }, []);

  const downloadLens = () => {
    const fileName =
      lens.name.toLowerCase().replace(/ /g, "_") || "custom_lens";
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(lens));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${fileName}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <I18nProvider locale={LOCALE} messages={[messages]}>
      <Modals
        lensModalOpen={lensModalOpen}
        setLensModalOpen={setLensModalOpen}
        resetModalOpen={resetModalOpen}
        setResetModalOpen={setResetModalOpen}
        pillarModalOpen={pillarModalOpen}
        setPillarModalOpen={setPillarModalOpen}
        setSelectedPillar={setSelectedPillar}
        editPillarModalOpen={editPillarModalOpen}
        setEditPillarModalOpen={setEditPillarModalOpen}
        selectedPillar={JSON.parse(JSON.stringify(selectedPillar || {}))}
        deletePillarModalOpen={deletePillarModalOpen}
        setDeletePillarModalOpen={setDeletePillarModalOpen}
      />
      <AppLayout
        navigationOpen={navigationOpen}
        onNavigationChange={() => setNavigationOpen(!navigationOpen)}
        navigation={
          <SideNavigation
            header={{
              href: "#",
              text: "Well-Architected Lens Editor",
            }}
            items={[
              {
                type: "link",
                text: `Using Lenses in AWS Well-Architected Tool`,
                href: `https://docs.aws.amazon.com/wellarchitected/latest/userguide/lenses.html`,
                external: true,
              },
              {
                type: "link",
                text: `Lens Format Specification`,
                href: `https://docs.aws.amazon.com/wellarchitected/latest/userguide/lenses-format-specification.html`,
                external: true,
              },
              { type: "divider" },
              {
                type: "link",
                text: `Editor Source Code`,
                href: `https://github.com/PacoVK/well-architected-editor`,
                external: true,
              },
            ]}
          />
        }
        notifications={
          <Flashbar
            items={[
              {
                type: "warning",
                dismissible: false,
                content:
                  "This is not a service developed, maintained or deployed by AWS.",
                id: "message_1",
              },
            ]}
          />
        }
        toolsHide={true}
        content={
          <ContentLayout
            header={<Header variant="h1">Well-Architected Lens Editor</Header>}
          >
            <SpaceBetween size="m">
              {lens ? (
                <Container
                  header={
                    <Header
                      variant="h2"
                      description={`schemaVersion: ${lens.schemaVersion}`}
                      actions={
                        <SpaceBetween direction="horizontal" size="xs">
                          <ButtonDropdown
                            onItemClick={({ detail }) => {
                              if (detail.id === "addPillar") {
                                setPillarModalOpen(true);
                              }
                              if (detail.id === "editPillar") {
                                setEditPillarModalOpen(true);
                              }
                              if (detail.id === "deletePillar") {
                                setDeletePillarModalOpen(true);
                              }
                              if (detail.id === "createEditLens") {
                                setLensModalOpen(true);
                              }
                              if (detail.id === "resetLens") {
                                setResetModalOpen(true);
                              }
                              if (detail.id === "downloadLens") {
                                downloadLens();
                              }
                              if (detail.id === "validateLens") {
                                setDoValidate(true);
                              }
                            }}
                            items={[
                              {
                                text: "Pillars",
                                items: [
                                  { text: "Add Pillar", id: "addPillar" },
                                  {
                                    text: "Edit Pillar",
                                    id: "editPillar",
                                    disabled: !selectedPillar,
                                  },
                                  {
                                    text: "Delete Pillar",
                                    id: "deletePillar",
                                    disabled: !selectedPillar,
                                  },
                                ],
                              },
                              {
                                text: "Lens",
                                items: [
                                  {
                                    text: `${lens.name ? "Edit" : "Create"} Lens`,
                                    id: "createEditLens",
                                  },
                                  {
                                    text: "Reset Lens",
                                    id: "resetLens",
                                    disabled: !lens.name,
                                  },
                                  {
                                    text: "Validate Lens",
                                    id: "validateLens",
                                    disabled: !lens.name,
                                  },
                                  {
                                    text: "Download Lens",
                                    id: "downloadLens",
                                    disabled: !lens.name,
                                  },
                                ],
                              },
                            ]}
                          >
                            Actions
                          </ButtonDropdown>
                          <FormField constraintText="This will override current lens">
                            <FileInput
                              onChange={({ detail }) => {
                                fileReader.readAsText(detail.value[0]);
                                setValue(detail.value);
                              }}
                              accept=".json"
                              value={value}
                              multiple={false}
                            >
                              Upload Lens
                            </FileInput>
                          </FormField>
                        </SpaceBetween>
                      }
                    >
                      {lens.name}
                    </Header>
                  }
                >
                  <p>{lens.description}</p>
                  <Validator
                    doValidate={doValidate}
                    setDoValidate={setDoValidate}
                  />
                  <h2>Pillars</h2>
                  <ColumnLayout columns={4}>
                    {lens.pillars.map((pillar) => {
                      return (
                        <Box key={pillar.id}>
                          <Button
                            variant={"inline-link"}
                            onClick={() => setSelectedPillar(pillar)}
                          >
                            {pillar.name}{" "}
                            <Badge>{pillar.questions.length}</Badge>
                          </Button>
                        </Box>
                      );
                    })}
                  </ColumnLayout>
                </Container>
              ) : (
                <Button onClick={() => setLensModalOpen(true)}>
                  Create new lens
                </Button>
              )}
              {selectedPillar ? (
                <QuestionsOverview pillar={selectedPillar} />
              ) : null}
            </SpaceBetween>
          </ContentLayout>
        }
        splitPanel={
          <SplitPanel header="About this tool" hidePreferencesButton={true}>
            <About />
          </SplitPanel>
        }
      />
    </I18nProvider>
  );
}
