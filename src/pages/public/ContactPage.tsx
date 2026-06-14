import { Phone, FacebookLogo, EnvelopeSimple, MapPin } from '@phosphor-icons/react';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ScrollReveal from '@/components/ui/ScrollReveal';

const heroImage = '/Pictures/contact-hero.jpg';

const channels = [
  {
    Icon: Phone,
    label: 'Phone',
    lines: [
      { text: '+63 933 380 7868', href: 'tel:+639333807868' },
      { text: '+63 917 502 3538', href: 'tel:+639175023538' },
    ],
  },
  {
    Icon: FacebookLogo,
    label: 'Facebook',
    lines: [
      {
        text: 'Schatzies Events PH',
        href: 'https://www.facebook.com/debutandweddingpackage',
        external: true,
      },
    ],
  },
  {
    Icon: EnvelopeSimple,
    label: 'Email',
    lines: [{ text: 'schatziesevents@gmail.com', href: 'mailto:schatziesevents@gmail.com' }],
  },
];

const branches = [
  {
    name: 'Quezon City Branch',
    address: '27, Novaliches, Mendoza Village, Project 8, Quezon City, Metro Manila',
    href: 'https://www.google.com/maps/search/27+Novaliches+Mendoza+Village+Project+8+Quezon+City',
  },
  {
    name: 'Tagaytay Branch',
    address:
      'Ministop bldg Marasigan st Tagaytay Nasugbu High way Brgy. Mendez, Tagaytay City, 4120 Cavite',
    href: 'https://www.google.com/maps/search/Ministop+Marasigan+st+Tagaytay+Nasugbu+Highway+Brgy+Mendez+Tagaytay+City+Cavite',
  },
];

export default function ContactPage() {
  return (
    <>
      <LoadingScreen />

      {/* ── Hero ── */}
      <section
        className="relative -mt-20 flex min-h-[62vh] items-end overflow-hidden bg-ink bg-cover bg-center lg:min-h-[78vh]"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/25" />
        <div className="page-gutter relative z-10 mx-auto w-full max-w-[1400px] pb-20 pt-40">
          <ScrollReveal variant="up">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-gold" />
              <span className="eyebrow text-ivory/90">Get in Touch</span>
            </div>
            <h1 className="mt-6 max-w-3xl font-heading text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] font-semibold text-ivory">
              Let&rsquo;s begin your <span className="italic text-gold">story.</span>
            </h1>
            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-ivory/75 lg:text-lg">
              Whether you have an event type in mind or just want to explore the possibilities, our
              team is ready to listen.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Channels ── */}
      <section className="bg-ivory py-24 lg:py-32">
        <div className="page-gutter mx-auto max-w-[1400px]">
          <ScrollReveal variant="up" className="mb-14 max-w-2xl">
            <p className="eyebrow text-brand">Reach Out</p>
            <h2 className="mt-6 font-heading text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] text-ink">
              Start the <span className="italic text-brand">conversation</span>.
            </h2>
            <p className="mt-6 font-sans text-base leading-relaxed text-ink/65 lg:text-lg">
              Reach out to us through any of these channels and let&rsquo;s start planning your dream
              event.
            </p>
          </ScrollReveal>

          <div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-3">
            {channels.map(({ Icon, label, lines }) => (
              <ScrollReveal key={label} variant="up" className="flex flex-col bg-card p-8 lg:p-10">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-brand-soft text-brand">
                  <Icon size={26} weight="duotone" />
                </span>
                <h3 className="mt-7 font-heading text-2xl text-ink">{label}</h3>
                <div className="mt-3 space-y-1.5">
                  {lines.map((l) => (
                    <a
                      key={l.text}
                      href={l.href}
                      {...('external' in l && l.external
                        ? { target: '_blank', rel: 'noreferrer' }
                        : {})}
                      className="block font-sans text-[0.95rem] text-ink/70 transition hover:text-brand"
                    >
                      {l.text}
                    </a>
                  ))}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Visit our office ── */}
      <section className="grain relative overflow-hidden bg-ink py-24 text-ivory lg:py-32">
        <div className="page-gutter relative z-10 mx-auto max-w-[1400px]">
          <ScrollReveal variant="up" className="mb-12 max-w-2xl">
            <p className="eyebrow text-gold">Visit Us</p>
            <h2 className="mt-6 font-heading text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] text-ivory">
              Visit our <span className="italic text-gold">office</span>.
            </h2>
            <p className="mt-6 font-sans text-base leading-relaxed text-ivory/70 lg:text-lg">
              We have dedicated office spaces in both Quezon City and Tagaytay, designed for
              comfortable consultation.
            </p>
          </ScrollReveal>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <ScrollReveal
              variant="left"
              className="relative min-h-[340px] overflow-hidden rounded-sm border border-ivory/15 bg-cover bg-center"
            >
              <div
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: 'url(/map.png)' }}
              />
            </ScrollReveal>

            <div className="flex flex-col gap-6">
              {branches.map((b, i) => (
                <ScrollReveal
                  key={b.name}
                  variant="right"
                  delay={i * 120}
                  className="rounded-sm border border-ivory/12 bg-ivory/[0.04] p-7"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-ivory">
                      <MapPin size={20} weight="fill" />
                    </span>
                    <div>
                      <h3 className="font-heading text-xl text-ivory">{b.name}</h3>
                      <a
                        href={b.href}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 block font-sans text-sm leading-relaxed text-ivory/65 transition hover:text-gold"
                      >
                        {b.address}
                      </a>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
