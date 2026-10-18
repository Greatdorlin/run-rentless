import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RegistrationForm } from "@/components/webinar/registration-form";
import "./webinar.css";

const description = "Making AI Make Business Sense was a free online webinar hosted by Navrademy and Run Rentless on 10 October 2026. Explore ways to improve work, review software costs and build what your business needs.";
const image = "https://www.runrentless.com/webinar/making-ai-make-business-sense-share-2026.jpg";

const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Making AI Make Business Sense",
  description,
  url: "https://www.runrentless.com/webinar",
  image: [image],
  startDate: "2026-10-10T18:00:00+01:00",
  endDate: "2026-10-10T20:00:00+01:00",
  eventStatus: "https://schema.org/EventCompleted",
  eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
  isAccessibleForFree: true,
  location: { "@type": "VirtualLocation", url: "https://www.runrentless.com/webinar" },
  organizer: [
    { "@type": "Organization", name: "Run Rentless", url: "https://www.runrentless.com" },
    { "@type": "Organization", name: "Navrademy" },
  ],
};

export const metadata: Metadata = {
  title: "Making AI Make Business Sense | October 2026 Webinar",
  description,
  alternates: { canonical: "/webinar" },
  openGraph: {
    title: "Making AI Make Business Sense | October 2026 Webinar",
    description,
    url: "https://www.runrentless.com/webinar",
    type: "website",
    images: [{ url: image, width: 1200, height: 630, type: "image/jpeg", alt: "Making AI Make Business Sense, presented by Navrademy and Run Rentless" }],
  },
  twitter: { card: "summary_large_image", title: "Making AI Make Business Sense | October 2026 Webinar", description, images: [image] },
};

const lessons = [
  { title: "Know what you pay for", copy: "Start with the tools you use and your actual bills, including costs that rise with your team." },
  { title: "Find the work you repeat", copy: "Look for customer enquiries, approvals or updates that your team copies, chases or forgets." },
  { title: "Keep, improve or connect", copy: "A useful tool can be worth keeping. Sometimes changing one step solves the problem." },
  { title: "Build only when it makes sense", copy: "Compare the cost of building, hosting and maintaining something new before deciding to replace a subscription." },
];
const examples = [
  ["Customer enquiries across several inboxes", "One clear owner and next step for every enquiry"],
  ["Client details copied by hand", "Details captured once and available where needed"],
  ["Managers chasing updates in chats", "A simple view of outstanding work"],
  ["Software bills rising with headcount", "A cost review before buying more seats"],
];

export default function WebinarPage() {
  return <div className="webinar-page webinar-archive">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema).replace(/</g, "\\u003c") }} />
    <section className="webinar-hero" aria-labelledby="webinar-title">
      <div className="shell webinar-hero__grid">
        <div className="webinar-hero__copy">
          <p className="webinar-kicker"><span /> Navrademy × Run Rentless <em>Past webinar</em></p>
          <h1 id="webinar-title">Making AI make <span>business sense.</span></h1>
          <p className="webinar-hero__lead">The October session has ended. The problems behind it have not: costly tools, repeated work and customer enquiries that fall through the cracks.</p>
          <div className="webinar-hero__event"><strong>Held Saturday, 10 October 2026</strong><span>6PM GMT+1 · Online</span></div>
          <div className="webinar-hero__actions">
            <Link className="webinar-cta" href="#webinar-form">Watch the free replay <span aria-hidden="true">↗</span></Link>
            <Link className="webinar-hero__secondary" href="/#audit">Start the free software audit <span aria-hidden="true">↗</span></Link>
          </div>
          <p className="webinar-hero__takeaway">Register below for instant access to the October webinar replay. We will email you the recording link too.</p>
        </div>
        <div className="webinar-hero__visual">
          <div className="webinar-hero__visual-top"><span>OCTOBER 2026</span><span>EVENT COMPLETED</span></div>
          <div className="webinar-hero__visual-main"><p>Business<br /><span>first.</span></p><div className="webinar-archive__visual-note">Keep what works.<br />Fix what slows you down.<br />Build what is missing.</div></div>
          <div className="webinar-hero__visual-bottom"><span>RUN RENTLESS</span><span>× NAVRADEMY</span></div>
        </div>
      </div>
    </section>
    <section className="webinar-share-band" aria-label="Continue after the webinar">
      <div className="shell webinar-archive__band">
        <p><strong>The live event is over. Watch the replay now.</strong> Start with one costly tool or a job your team does by hand.</p>
        <Link href="/contact">Talk to Run Rentless <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
    <section className="webinar-problem" aria-labelledby="webinar-problem-title">
      <div className="shell">
        <div className="webinar-problem__opening">
          <div><p className="webinar-section-label">The idea behind the session</p><h2 id="webinar-problem-title"><span>Another list of AI tools is not a business plan.</span><span>Start with the work you need to improve.</span></h2></div>
          <div className="webinar-problem__intro"><p>Business owners already have enough subscriptions, dashboards and apps competing for attention.</p><p className="webinar-problem__turn">What actually needs to change?</p></div>
        </div>
        <div className="webinar-problem__questions">
          <p className="webinar-problem__questions-lead">Four questions to bring back to <strong>your business today.</strong></p>
          <ul><li>What are you paying for, and what does each tool really do?</li><li>Where do customer enquiries or approvals get delayed?</li><li>What does your team still copy, repeat or chase manually?</li><li>Would fixing a tool, connecting it or building something focused actually cost less?</li></ul>
        </div>
        <div className="webinar-problem__closing">
          <p className="webinar-problem__answer">Better decisions start with a real problem.</p>
          <p>Keep what works. Fix what wastes time. Build only what your team needs.</p>
          <div className="webinar-problem__final"><p>The goal is not to use more AI. <strong>It is to make better business decisions with it.</strong></p><Link className="webinar-cta" href="/#audit">Review my tools <span aria-hidden="true">↗</span></Link></div>
        </div>
      </div>
    </section>
    <figure className="webinar-featured"><div className="shell"><Image src="/webinar/making-ai-make-business-sense.png" width={1731} height={909} sizes="(max-width: 700px) 100vw, 1200px" alt="Making AI Make Business Sense October 2026 event artwork with Navrademy and Run Rentless" /></div></figure>
    <section className="webinar-learning" id="what-you-will-learn" aria-labelledby="webinar-learning-title">
      <div className="shell"><div className="webinar-learning__heading"><p className="webinar-section-label">Questions worth taking forward</p><h2 id="webinar-learning-title">Make your next decision with the numbers in front of you.</h2><p>Useful starting points whether you joined the webinar or found this page afterwards.</p></div>
        <div className="webinar-learning__list">{lessons.map((item) => <article key={item.title}><span className="webinar-learning__marker" aria-hidden="true" /><div><h3>{item.title}</h3><p>{item.copy}</p></div><span aria-hidden="true">↗</span></article>)}</div>
      </div>
    </section>
    <section className="webinar-examples" aria-labelledby="webinar-examples-title">
      <div className="shell webinar-examples__grid"><div><p className="webinar-section-label">What this could look like</p><h2 id="webinar-examples-title">Small problems. Useful changes.</h2><p>You may not need a whole new system. Sometimes one better step changes the day.</p></div><div className="webinar-examples__list">{examples.map(([before,after]) => <div key={before}><span>{before}</span><strong aria-hidden="true">→</strong><span>{after}</span></div>)}</div></div>
    </section>
    <section className="webinar-register" id="register" aria-labelledby="webinar-register-title">
      <div className="shell webinar-register__grid">
        <div className="webinar-register__copy"><p className="webinar-section-label">What comes after the webinar</p><h2 id="webinar-register-title">Bring the problem.<br /><span>Make the next move.</span></h2><p>Register for the free recording. Watch it immediately after registration and get the replay link in your email.</p><div className="webinar-register__date"><strong>Making AI Make Business Sense</strong><span>Past event · 10 October 2026</span><span>Presented by Navrademy × Run Rentless</span></div></div>
        <div id="webinar-form"><RegistrationForm /></div>
      </div>
    </section>
  </div>;
}
