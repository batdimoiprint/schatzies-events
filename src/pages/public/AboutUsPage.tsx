import LoadingScreen from '@/components/ui/LoadingScreen';
import ScrollReveal from '@/components/ui/ScrollReveal';

const heroImage = '/Pictures/about-hero.jpg';
const aboutImage = '/Pictures/about-section.jpg';

/* ── Why-choose feature icons ── */
function YearsIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-11 w-11 text-brand" fill="none">
      <path d="M16 32v28l16-8 16 8V32" fill="currentColor" />
      <circle cx="32" cy="24" r="24" fill="currentColor" />
      <path d="M32 10l3.5 10.5h11l-9 6.5 3.5 10.5-9-6.5-9 6.5 3.5-10.5-9-6.5h11z" fill="#fff" />
    </svg>
  );
}
function LocalIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-11 w-11 text-brand" fill="none">
      <circle cx="32" cy="32" r="30" fill="currentColor" />
      <ellipse cx="32" cy="32" rx="14" ry="30" stroke="#fff" strokeWidth="3" />
      <path d="M2 32h60M8 18h48M8 46h48" stroke="#fff" strokeWidth="3" />
    </svg>
  );
}
function InclusiveIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-11 w-11 text-brand" fill="none">
      <circle cx="16" cy="20" r="10" fill="currentColor" />
      <path d="M4 56c0-12 5-18 12-18h8v18H4z" fill="currentColor" />
      <circle cx="48" cy="20" r="10" fill="currentColor" />
      <path d="M40 38h8c7 0 12 6 12 18H40V38z" fill="currentColor" />
      <circle cx="32" cy="24" r="12" fill="currentColor" stroke="#fff" strokeWidth="2" />
      <path d="M16 56c0-14 6-20 16-20s16 6 16 20H16z" fill="currentColor" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}
function BudgetIcon() {
  return (
    <svg viewBox="0 0 64 64" className="h-11 w-11 text-brand" fill="none">
      <circle cx="32" cy="32" r="30" fill="currentColor" />
      <path
        d="M32 14v36M24 24c0-4 6-4 8-4s8 4 8 8c0 6-16 6-16 12s2 8 8 8c6 0 8-4 8-4"
        stroke="#fff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const reasons = [
  {
    Icon: YearsIcon,
    title: '17+ Years of Expertise',
    body: 'A decade and a half of helping many clients turn special occasions into perfectly managed, memorable events.',
  },
  {
    Icon: LocalIcon,
    title: "The Local's Choice",
    body: 'Your trusted partner right here in the Philippines. We handle every detail of your local celebration so you can focus on enjoying your special day with loved ones.',
  },
  {
    Icon: InclusiveIcon,
    title: 'All-Inclusive Ease',
    body: 'Complete event packages that handle everything—from elegant venue styling and buffet catering to professional photo and video coverage.',
  },
  {
    Icon: BudgetIcon,
    title: 'Budget-Friendly Luxury',
    body: 'Expertly managing the details so you can focus on the moment. We specialize in all-inclusive event solutions that are both affordable and adaptable.',
  },
];

const team = [
  { name: 'Juana Dela Cruz', role: 'President', img: '/Pictures/team2.png' },
  { name: 'Juan Dela Cruz', role: 'Vice-President', img: '/Pictures/team1.png' },
];

export default function AboutUsPage() {
  return (
    <>
      <LoadingScreen />

      {/* ── Hero ── */}
      <section
        className="relative -mt-20 flex min-h-[72vh] items-end overflow-hidden bg-ink bg-cover bg-center lg:min-h-[88vh]"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/25" />
        <div className="page-gutter relative z-10 mx-auto w-full max-w-[1400px] pb-20 pt-40">
          <ScrollReveal variant="up">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-gold" />
              <span className="eyebrow text-ivory/90">Our Story — Est. 2011</span>
            </div>
            <h1 className="mt-6 max-w-4xl font-heading text-[clamp(2.5rem,6.5vw,5.25rem)] leading-[0.96] font-semibold text-ivory">
              Years of turning dreams into{' '}
              <span className="italic text-gold">milestones.</span>
            </h1>
            <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-ivory/75 lg:text-lg">
              At Schatzies Events PH, we believe you should be a guest at your own celebration. Since
              2011, we&rsquo;ve been the trusted partner for families and couples across the
              Philippines and beyond.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── About split ── */}
      <section className="bg-ivory py-24 lg:py-32">
        <div className="page-gutter mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <ScrollReveal variant="left">
            <p className="eyebrow text-brand">Who We Are</p>
            <h2 className="mt-6 font-heading text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.04] text-ink">
              About <span className="italic text-brand">us</span>.
            </h2>
            <div className="rule-gold mt-7 w-32" />
            <p className="mt-8 font-sans text-base leading-relaxed text-ink/70 lg:text-lg">
              Known for our complete and affordable packages, our goal is simple: simplicity. From
              venue styling to full program coordination, we work closely with you to ensure your
              event runs flawlessly.
            </p>
          </ScrollReveal>

          <ScrollReveal variant="right" delay={150} className="relative">
            <div className="absolute -inset-3 -z-10 rounded-sm bg-gradient-brand-soft blur-2xl" />
            <div className="overflow-hidden rounded-sm border border-gold/30 shadow-[0_30px_70px_-30px_rgba(31,10,43,0.4)]">
              <img src={aboutImage} alt="Schatzies Events venue setup" className="h-full w-full object-cover" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Why choose — deep section ── */}
      <section className="grain relative overflow-hidden bg-ink py-24 text-ivory lg:py-32">
        <div className="page-gutter relative z-10 mx-auto max-w-[1400px]">
          <ScrollReveal variant="up" className="mb-16 max-w-3xl">
            <p className="eyebrow text-gold">The Difference</p>
            <h2 className="mt-6 font-heading text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.05] text-ivory">
              Why choose <span className="italic text-gold">Schatzies?</span>
            </h2>
            <div className="rule-gold mt-7 w-40" />
            <p className="mt-7 font-sans text-base leading-relaxed text-ivory/70 lg:text-lg">
              With over 17 years of expertise, we turn complex logistics into seamless celebrations.
              As your reliable on-the-ground partner, we handle the details so you can simply stay in
              the moment.
            </p>
          </ScrollReveal>

          <div className="grid gap-px overflow-hidden rounded-sm border border-ivory/10 bg-ivory/10 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map(({ Icon, title, body }, i) => (
              <ScrollReveal
                key={title}
                variant="up"
                delay={(i % 4) * 80}
                className="flex h-full flex-col bg-ink p-8"
              >
                <div className="flex items-start justify-between">
                  <Icon />
                  <span className="font-heading text-2xl italic text-gold/40">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-7 font-heading text-xl leading-tight text-ivory">{title}</h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-ivory/65">{body}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="bg-ivory py-24 lg:py-32">
        <div className="page-gutter mx-auto max-w-[1100px]">
          <ScrollReveal variant="up" className="mb-14 text-center">
            <p className="eyebrow text-brand">The Atelier</p>
            <h2 className="mt-6 font-heading text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.05] text-ink">
              Meet our <span className="italic text-brand">team</span>.
            </h2>
            <p className="mt-5 font-sans text-base text-ink/60 lg:text-lg">
              The experts behind your seamless events.
            </p>
          </ScrollReveal>

          <div className="grid gap-8 sm:grid-cols-2">
            {team.map((member, i) => (
              <ScrollReveal key={member.name} variant="up" delay={i * 120}>
                <figure className="group overflow-hidden rounded-sm border border-border bg-card">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="bg-ink px-6 py-6 text-center">
                    <h3 className="font-heading text-2xl text-ivory">{member.name}</h3>
                    <p className="eyebrow mt-2 text-gold">{member.role}</p>
                  </figcaption>
                </figure>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
