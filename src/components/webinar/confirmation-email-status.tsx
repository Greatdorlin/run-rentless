type ConfirmationEmailStatusProps = {
  email: string;
  pending: boolean;
  duplicate: boolean;
};

/** Provider acceptance is not proof of inbox delivery. No resend is triggered here. */
export function ConfirmationEmailStatus({ email, pending, duplicate }: ConfirmationEmailStatusProps) {
  const message = duplicate
    ? "You are already registered. No new confirmation email was sent."
    : pending
      ? "Your registration is saved, but your confirmation email is still pending."
      : "Your confirmation has been submitted for delivery. We have not confirmed that it reached your inbox.";
  const supportUrl = `mailto:info@runrentless.com?${new URLSearchParams({
    subject: "Webinar confirmation not received",
    body: `Hello Run Rentless,\n\nI registered for Making AI Make Business Sense using ${email}. My confirmation has not arrived in my inbox, spam or promotions. Please check its delivery status.\n`,
  }).toString()}`;

  return <div>
    <span>Then &middot; Check your email</span>
    <p>{message}</p>
    <p>Registration email: <strong>{email}</strong></p>
    <p>Nothing in your inbox, Spam or Promotions? Use the watch link above; you do not need to register again.</p>
    <a href={supportUrl}>Report a missing confirmation <span aria-hidden="true">&#8599;</span></a>
  </div>;
}
