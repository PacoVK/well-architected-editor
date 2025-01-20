import { Risks } from "../types.ts";
import { Badge } from "@cloudscape-design/components";

type RiskBadgeProps = {
  risk: (typeof Risks)[keyof typeof Risks];
};
export default function RiskBadge({ risk }: RiskBadgeProps) {
  const getBadgeColor = () => {
    if (risk === Risks.HIGH_RISK) {
      return "severity-critical";
    } else if (risk === Risks.MEDIUM_RISK) {
      return "severity-medium";
    } else {
      return "severity-neutral";
    }
  };
  return <Badge color={getBadgeColor()}>{risk}</Badge>;
}
