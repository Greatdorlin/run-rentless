type LeadsDeskPreviewProps = {
  compact?: boolean;
};

/** A public, product-faithful surface preview. It deliberately contains no customer data or invented metrics. */
export function LeadsDeskPreview({ compact = false }: LeadsDeskPreviewProps) {
  return (
    <figure className={`leads-desk-preview${compact ? " leads-desk-preview--compact" : ""}`}>
      <div className="leads-desk-preview__chrome">
        <span className="leads-desk-preview__brand">Leads Desk</span>
        <span className="leads-desk-preview__environment">Private workspace</span>
      </div>
      <div className="leads-desk-preview__frame">
        <aside aria-label="Leads Desk areas">
          <span className="leads-desk-preview__nav-active">Overview</span>
          <span>Leads</span>
          <span>Tasks</span>
          <span>Reports</span>
        </aside>
        <div className="leads-desk-preview__workspace">
          <div className="leads-desk-preview__heading">
            <div><span>SALES COMMAND</span><strong>Work ready for your team.</strong></div>
            <span className="leads-desk-preview__action">+ New lead</span>
          </div>
          <div className="leads-desk-preview__panels">
            <section><span>Lead pipeline</span><strong>Configured stages appear here</strong></section>
            <section><span>Next actions</span><strong>Tasks and reminders, in context</strong></section>
            <section className="leads-desk-preview__empty"><span>No customer data is shown in this public preview.</span></section>
          </div>
        </div>
      </div>
      <figcaption>Product-faithful Leads Desk interface preview · no customer data shown</figcaption>
    </figure>
  );
}
