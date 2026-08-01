import Image from "next/image";
import dashboardImage from "../../../public/product/leads-desk-dashboard-redacted.png";

type LeadsDeskPreviewProps = {
  compact?: boolean;
};

export function LeadsDeskPreview({ compact = false }: LeadsDeskPreviewProps) {
  return (
    <figure className={`leads-desk-preview${compact ? " leads-desk-preview--compact" : ""}`}>
      <Image className="leads-desk-preview__image" src={dashboardImage} alt="The real Leads Desk dashboard with workspace-specific details redacted" sizes={compact ? "(max-width: 820px) calc(100vw - 40px), 60vw" : "(max-width: 820px) calc(100vw - 40px), 520px"} priority={!compact} />
      <figcaption>Actual Leads Desk dashboard · workspace-specific details redacted</figcaption>
    </figure>
  );
}
