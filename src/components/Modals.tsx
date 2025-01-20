import { FormField, Input } from "@cloudscape-design/components";
import Modal from "./Modal";
import { Pillar, WellArchitectedLens } from "../types";
import { Dispatch, SetStateAction, useState } from "react";
import { useLens } from "../state/LensHook";

type ModalsProps = {
  lensModalOpen: boolean;
  setLensModalOpen: Dispatch<SetStateAction<boolean>>;
  resetModalOpen: boolean;
  setResetModalOpen: Dispatch<SetStateAction<boolean>>;
  pillarModalOpen: boolean;
  setPillarModalOpen: Dispatch<SetStateAction<boolean>>;
  selectedPillar: Pillar | undefined;
  setSelectedPillar: Dispatch<SetStateAction<Pillar | undefined>>;
  editPillarModalOpen: boolean;
  setEditPillarModalOpen: Dispatch<SetStateAction<boolean>>;
  deletePillarModalOpen: boolean;
  setDeletePillarModalOpen: Dispatch<SetStateAction<boolean>>;
};

const emptyLens: WellArchitectedLens = {
  schemaVersion: "2021-11-01",
  name: "",
  description: "",
  pillars: [],
};

const emptyPillar: Pillar = {
  id: "",
  name: "",
  questions: [],
};

export default function Modals({
  lensModalOpen,
  setLensModalOpen,
  resetModalOpen,
  setResetModalOpen,
  pillarModalOpen,
  setPillarModalOpen,
  selectedPillar,
  setSelectedPillar,
  editPillarModalOpen,
  setEditPillarModalOpen,
  deletePillarModalOpen,
  setDeletePillarModalOpen,
}: ModalsProps) {
  const {
    lens,
    actions: { setLens, persistLens, resetLens },
  } = useLens();
  const [pillar, setPillar] = useState<Pillar>(emptyPillar);

  return (
    <>
      <Modal
        state={[lensModalOpen, setLensModalOpen]}
        onOk={() => {
          persistLens(lens);
        }}
        header="Edit lens"
      >
        <FormField
          label="Name"
          description="Name of the lens. The name can be up to 128 characters."
        >
          <Input
            value={lens?.name || ""}
            onChange={(event) =>
              setLens({
                ...(lens || emptyLens),
                name: event.detail.value,
              } as WellArchitectedLens)
            }
          />
        </FormField>
        <FormField
          label="Description"
          description="Text description of the lens. This text is displayed when selecting lenses to add during workload creation, or when selecting a lens to apply to an existing workload later. The description can be up to 2048 characters."
        >
          <Input
            value={lens?.description || ""}
            onChange={(event) =>
              setLens({
                ...(lens || emptyLens),
                description: event.detail.value,
              } as WellArchitectedLens)
            }
          />
        </FormField>
      </Modal>

      <Modal
        header={"Really reset all?"}
        onOk={() => {
          resetLens();
        }}
        state={[resetModalOpen, setResetModalOpen]}
      >
        <p>Are you sure you want to reset all?</p>
      </Modal>

      <Modal
        state={[pillarModalOpen, setPillarModalOpen]}
        onCancel={() => setPillar(emptyPillar)}
        onOk={() => {
          const updatedLens = {
            ...lens,
            pillars: [...lens.pillars, pillar],
          };
          persistLens(updatedLens);
          setPillar(emptyPillar);
          setPillarModalOpen(false);
        }}
        header="Add new pillar"
      >
        <FormField
          label="Name"
          description="Name of the pillar. The name can be up to 128 characters."
        >
          <Input
            value={pillar.name}
            onChange={(event) => {
              const recentPillar = {
                ...pillar,
                id: event.detail.value.toLowerCase(),
                name: event.detail.value,
              };
              setPillar(recentPillar);
              setSelectedPillar(recentPillar);
            }}
          />
        </FormField>
      </Modal>

      <Modal
        state={[editPillarModalOpen, setEditPillarModalOpen]}
        onCancel={() => {
          setSelectedPillar(
            lens.pillars.find((p) => p.id === selectedPillar?.id),
          );
          setPillar(emptyPillar);
        }}
        onOk={() => {
          if (!selectedPillar) {
            return;
          }
          const filterdPillars = lens.pillars.filter(
            (p) => p.id !== selectedPillar.id,
          );
          const updatedLens = {
            ...lens,
            pillars: [...filterdPillars, selectedPillar],
          };
          persistLens(updatedLens);
          setPillar(emptyPillar);
          setEditPillarModalOpen(false);
        }}
        header={`Edit pillar`}
      >
        <FormField
          label="Name"
          description="Name of the pillar. The name can be up to 128 characters."
        >
          <Input
            value={selectedPillar?.name || ""}
            onChange={(event) => {
              if (!selectedPillar) {
                return;
              }
              const recentPillar = {
                ...selectedPillar,
                name: event.detail.value,
              };
              setSelectedPillar(recentPillar);
            }}
          />
        </FormField>
      </Modal>

      <Modal
        header={`Delete ${selectedPillar?.name} pillar?`}
        onOk={() => {
          if (!selectedPillar) {
            return;
          }
          const filterdPillars = lens.pillars.filter(
            (p) => p.id !== selectedPillar.id,
          );
          const updatedLens = {
            ...lens,
            pillars: filterdPillars,
          };
          persistLens(updatedLens);
          setDeletePillarModalOpen(false);
          setSelectedPillar(undefined);
        }}
        state={[deletePillarModalOpen, setDeletePillarModalOpen]}
      >
        <p>
          Are you sure you want to delete this pillar and all related questions?
        </p>
      </Modal>
    </>
  );
}
