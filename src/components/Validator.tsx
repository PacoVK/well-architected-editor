import { Alert, SpaceBetween } from "@cloudscape-design/components";
import { Box } from "@cloudscape-design/components";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import addErrors from "ajv-errors";
import { useLens } from "../state/LensHook";
import { useEffect, useState } from "react";
import schema from "../schemas/custom-lens.schema.json";

type ValidatorProps = {
  doValidate: boolean;
  setDoValidate: (doValidate: boolean) => void;
};

type ValidationStatus = "success" | "error" | "none";

interface ErrorReport {
  path: string;
  message: string;
}

export default function Validator({
  doValidate,
  setDoValidate,
}: ValidatorProps) {
  const { lens } = useLens();
  const [status, setStatus] = useState<ValidationStatus>("none");
  const [errors, setErrors] = useState<ErrorReport[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (doValidate) {
      validateLens();
      setShowSummary(true);
    }
    setDoValidate(false);
  }, [doValidate]);

  const onDismiss = () => {
    setDoValidate(false);
    setShowSummary(false);
  };

  const formatErrorPath = (path: string): string => {
    // Split the path into segments
    const segments = path.split("/").filter(Boolean);
    let formattedPath = "";

    for (let i = 0; i < segments.length; i++) {
      if (segments[i] === "pillars" && segments[i + 1]?.match(/^\d+$/)) {
        // Get pillar index and name
        const pillarIndex = parseInt(segments[i + 1]);
        const pillar = lens.pillars[pillarIndex];
        if (pillar?.name) {
          formattedPath += `Pillar "${pillar.name}" → `;
          i++; // Skip the next segment (index)
          continue;
        }
      }

      // Format other numeric indices
      if (segments[i].match(/^\d+$/)) {
        formattedPath += `#${parseInt(segments[i]) + 1}`;
      } else {
        // Capitalize and format other segments
        formattedPath += segments[i]
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()
          .replace(/^./, (str) => str.toUpperCase());
      }

      if (i < segments.length - 1) {
        formattedPath += " → ";
      }
    }

    return formattedPath || "Root";
  };

  const validateLens = () => {
    const ajv = new Ajv({
      allErrors: true,
      verbose: true,
      $data: true,
    });
    addFormats(ajv);
    addErrors(ajv);

    ajv.addFormat("http-url", {
      type: "string",
      validate: (str) => {
        try {
          const url = new URL(str);
          return url.protocol === "http:" || url.protocol === "https:";
        } catch {
          return false;
        }
      },
    });

    const validate = ajv.compile(schema);
    const result = validate(lens);

    if (!result && validate.errors) {
      const formattedErrors: ErrorReport[] = validate.errors.map((error) => ({
        path: formatErrorPath(error.instancePath),
        message: error.message || "Unknown error",
      }));
      setErrors(formattedErrors);
      setStatus("error");
    } else {
      setErrors([]);
      setStatus("success");
    }
  };

  return (
    <Box display={showSummary ? "block" : "none"}>
      <SpaceBetween size="m">
        {status === "success" && (
          <Alert type="success" dismissible onDismiss={onDismiss}>
            Lens validation successful! Your lens follows the Well-Architected
            format specification.
          </Alert>
        )}

        {status === "error" && (
          <Alert
            type="error"
            header="Validation errors found"
            dismissible
            onDismiss={onDismiss}
          >
            <SpaceBetween size="s">
              {errors.map((error, index) => (
                <div key={index}>
                  <strong>{error.path}</strong>: {error.message}
                </div>
              ))}
            </SpaceBetween>
          </Alert>
        )}
      </SpaceBetween>
    </Box>
  );
}
