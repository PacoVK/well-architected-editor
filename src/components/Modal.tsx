import { Dispatch, ReactNode, SetStateAction } from "react";
import {
  Box,
  Button,
  Modal as BaseModal,
  SpaceBetween,
} from "@cloudscape-design/components";

interface ModalProps {
  header: string;
  children: ReactNode;
  onOk: () => void;
  onCancel?: () => void;
  state: [boolean, Dispatch<SetStateAction<boolean>>];
}

export default function Modal({
  children,
  header,
  state,
  onOk,
  onCancel,
}: ModalProps) {
  const [modalOpen, setModalOpen] = state;

  return (
    <BaseModal
      onDismiss={() => setModalOpen(false)}
      visible={modalOpen}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button
              variant="link"
              onClick={() => {
                if (onCancel) {
                  onCancel();
                }
                setModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onOk();
                setModalOpen(false);
              }}
            >
              Ok
            </Button>
          </SpaceBetween>
        </Box>
      }
      header={header}
    >
      {children}
    </BaseModal>
  );
}
