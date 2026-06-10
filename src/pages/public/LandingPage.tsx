import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';

// Gallery images
const galleryRow1 = [
  { src: '/Pictures/gallery-1.jpg', alt: 'Event gallery 1' },
  { src: '/Pictures/gallery-2.jpg', alt: 'Event gallery 2' },
  { src: '/Pictures/gallery-3.jpg', alt: 'Event gallery 3' },
];

const galleryRow2 = [
  { src: '/Pictures/gallery-4.jpg', alt: 'Event gallery 4' },
  { src: '/Pictures/gallery-5.jpg', alt: 'Event gallery 5' },
  { src: '/Pictures/gallery-6.jpg', alt: 'Event gallery 6' },
  { src: '/Pictures/gallery-7.jpg', alt: 'Event gallery 7' },
];

// Hero images carousel
const heroImages = [
  '/Pictures/hero-1.jpg',
  '/Pictures/hero-2.jpg',
  '/Pictures/hero-3.jpg',
  '/Pictures/hero-4.jpg',
  '/Pictures/hero-5.jpg',
  '/Pictures/hero-6.jpg',
  '/Pictures/hero-7.jpg',
  '/Pictures/hero-8.jpg',
  '/Pictures/hero-9.jpg',
  '/Pictures/hero-10.jpg',
  '/Pictures/hero-11.jpg',
];

// Testimonials
const testimonials = [
  {
    name: 'Ainna O.',
    text: 'Thank you so much to Schatzies Team for making our dream wedding come true! Glad we visited their booth last year at Wedding Expo event at SM MOA...',
  },
  {
    name: 'Idz AB.',
    text: "A HUGE THANK YOU to Schatzies Events Management led by Ms. Aileen Cabornay for making Heart's 1st birthday party so special. It was an amazing party enjoyed by all - both kids and adults...",
  },
  {
    name: 'JoyAnn R.F',
    text: 'I absolutely recommend Schatzies Event Management to have the best wedding ever and stress free planning! Our wedding day was perfect and I know it...',
  },
  {
    name: 'Mary Dee Macapugas B.',
    text: "Highly recommended! sobrang babait ng staff's ang gaan kasama Thank You so much Schatzies events Management sa napakagandang outcome ng wedding di namin inexpect, sobrang ganda talaga. More power to you guys",
  },
  {
    name: 'Hedda H.',
    text: 'They perfectly executed our all white minimalist draping theme. It was exactly how we envisioned it; clean, elegant, and timeless. If they are the team to trust.',
  },
  {
    name: 'Charlene F.',
    text: 'Hiring SCHATZIES EVENTS PH was the best decision we made for our celebration! They handled all vendor coordination in the weeks leading up to the wedding and made everything smooth.',
  },
];

export function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <SpotlightSection />
        <ServicesSection />
        <TestimonialsSection />
      </main>

      {/* Floating Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#FF0066] text-white shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-200 focus:outline-none">
          {/* Crescent Moon & Star Icon */}
          <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3c.132 0 .263 0 .393.007a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 3z" />
            <path d="M19 6.5l.55 1.1 1.2.1-.85.85.2 1.2-1.1-.6-1.1.6.2-1.2-.85-.85 1.2-.1z" />
          </svg>
        </button>
      </div>
    </>
  );
}

/* Hero Section */
function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Background Image and Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-right lg:bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url('${heroImages[currentImageIndex]}')` }}
      >
        {/* Responsive Gradient Overlay */}
        <div 
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 15%, rgba(255,255,255,0.4) 25%, transparent 40%)' }} 
        />
      </div>

      {/* Content */}
      <div className="relative flex items-center h-full min-h-screen px-6 sm:px-8 lg:px-[8%] w-full z-10">
        <div className="w-full lg:w-[52%] pt-32 pb-24 lg:pt-40 lg:pb-32 space-y-8">
          {/* Main Heading */}
          <div className="space-y-3">
            <p
              className="text-[#1E002C] text-3xl sm:text-4xl lg:text-[44px] font-normal leading-tight"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              Welcome to
            </p>
            <h1
              className="text-5xl sm:text-7xl lg:text-[84px] font-bold leading-[1.05] tracking-tight bg-clip-text text-transparent"
              style={{
                fontFamily: "'Libre Baskerville', serif",
                background: 'linear-gradient(99.67deg, #700F81 16.53%, #FF0066 45.5%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Schatzies Events!
            </h1>
          </div>

          {/* Subtitle */}
          <p
            className="text-xl sm:text-2xl lg:text-[28px] font-semibold text-[#1E002C] leading-normal"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Your{' '}
            <span
              className="font-bold bg-clip-text text-transparent"
              style={{
                background: 'linear-gradient(99.67deg, #700F81 16.53%, #FF0066 45.5%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              MOST TRUSTED
            </span>{' '}
            team!
          </p>

          {/* Description */}
          <p
            className="text-black text-base sm:text-lg lg:text-[18px] leading-relaxed max-w-xl"
            style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
          >
            Premium wedding and debut planning for those who want to be a guest at their own
            celebration. We handle the stress; you handle the memories.
          </p>

          {/* Social Links */}
          <div className="pt-4 space-y-3">
            <p
              className="text-gray-400 text-sm font-medium tracking-wide"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Connect with us:
            </p>
            <div className="flex items-center gap-3">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/debutandweddingpackage"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF0066] text-white hover:scale-110 transition-transform duration-200 shadow-md"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              {/* Email */}
              <a
                href="mailto:schatziesevents@gmail.com"
                className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#FF0066] text-white hover:scale-110 transition-transform duration-200 shadow-md"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              {/* Phone */}
              <a
                href="tel:+639333807868"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF0066] text-white hover:scale-110 transition-transform duration-200 shadow-md"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-2.2 2.2a15.045 15.045 0 0 1-6.59-6.59l2.2-2.21a.96.96 0 0 0 .25-1A11.36 11.36 0 0 1 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.58c0-.56-.45-1-.99-1z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-24 left-6 sm:left-8 lg:left-[8%] z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'w-8 bg-[#FF0066]' 
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[1px] z-10">
        <svg
          className="relative block w-full h-[60px] sm:h-[90px] lg:h-[120px]"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,60 C320,130 720,10 1080,80 C1260,105 1380,95 1440,75 L1440,120 L0,120 Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}

/* Spotlight Section */
function SpotlightSection() {
  const row1Loop = [...galleryRow1, ...galleryRow1, ...galleryRow1, ...galleryRow1, ...galleryRow1, ...galleryRow1, ...galleryRow1, ...galleryRow1];
  const row2Loop = [...galleryRow2, ...galleryRow2, ...galleryRow2, ...galleryRow2, ...galleryRow2, ...galleryRow2, ...galleryRow2, ...galleryRow2];

  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      {/* Heading & Subtitle inside the standard padding container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-[8%] text-center mb-16">
        <h2 
          className="text-4xl sm:text-5xl lg:text-[52px] font-bold leading-tight tracking-tight text-[#1E002C]"
          style={{ fontFamily: "'Libre Baskerville', serif" }}
        >
          Step Into the <span className="text-[#FF0066]">Spotlight</span>,<br />We'll Handle the <span className="text-[#FF0066]">Stage</span>.
        </h2>
        <p 
          className="mt-6 text-base sm:text-lg lg:text-[18px] text-gray-600 max-w-3xl mx-auto leading-relaxed"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Your milestone is a masterpiece in the making. While you focus on making memories and
          greeting your guests, our team ensures every light, sound, and moment is executed to
          perfection.
        </p>
      </div>

      {/* Gallery Carousel - Maxed out to the screen width (outside container) */}
      <div className="w-full space-y-8 mb-16 relative">
        {/* Row 1 - Scroll Right */}
        <div className="group relative flex overflow-hidden">
          {/* Gradient Overlays for screen edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent" />

          {/* Scrolling Container */}
          <div className="flex w-max animate-marquee gap-6 group-hover:[animation-play-state:paused]">
            {row1Loop.map((image, idx) => (
              <div
                key={`row1-${idx}`}
                className="relative h-80 w-[450px] flex-shrink-0 overflow-hidden rounded-2xl shadow-xl border border-gray-100/50"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Scroll Right (Same as Row 1) */}
        <div className="group relative flex overflow-hidden">
          {/* Gradient Overlays for screen edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent" />

          {/* Scrolling Container */}
          <div className="flex w-max animate-marquee gap-6 group-hover:[animation-play-state:paused]">
            {row2Loop.map((image, idx) => (
              <div
                key={`row2-${idx}`}
                className="relative h-80 w-[450px] flex-shrink-0 overflow-hidden rounded-2xl shadow-xl border border-gray-100/50"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Button & Wave Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-[8%] text-center pb-12">
        <Button 
          className="bg-[#FF0066] hover:bg-[#D80054] text-white px-8 py-6 rounded-lg text-lg font-semibold shadow-lg shadow-pink-500/20 transition-all duration-200"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          View Gallery
        </Button>
      </div>

    </section>
  );
}

/* Services Section */
function ServicesSection() {
  return (
    <section 
      id="services"
      className="relative bg-cover bg-center bg-no-repeat pt-0 pb-24 lg:pb-36 overflow-hidden"
      style={{ backgroundImage: "url('/Pictures/texture.jpg')" }}
    >
      {/* Dark overlay for contrast and readability */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      {/* White Wave at the top — smooth transition from white Spotlight section */}
      <div className="relative w-full overflow-hidden leading-[0] z-20">
        <svg
          className="relative block w-full h-[40px] sm:h-[60px] lg:h-[80px]"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0 L1440,0 L1440,60 C1080,110 720,10 320,60 C160,80 60,70 0,50 Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-[8%] w-full z-10 space-y-24 lg:space-y-36">
        
        {/* Service Feature 1: Love Story (Wedding) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text */}
          <div className="space-y-6">
            <h3 
              className="text-3xl sm:text-4xl lg:text-[44px] font-bold leading-tight text-white"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              A <span className="text-[#FF0066]">Love Story</span> Told in Every Detail
            </h3>
            <p 
              className="text-base sm:text-lg lg:text-[18px] text-gray-300 leading-relaxed font-normal"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              We don't just plan weddings; we protect your peace. From intimate vows to grand
              ballrooms, we ensure the only thing you focus on is the person at the end of the
              aisle.
            </p>
          </div>
          {/* Right: Image */}
          <div className="relative overflow-hidden rounded-2xl border-4 border-white shadow-[0_25px_60px_rgba(0,0,0,0.8)] max-w-full lg:max-w-lg justify-self-center lg:justify-self-end">
            <img 
              src="/Pictures/service-wedding.jpg" 
              alt="A Love Story Told in Every Detail" 
              className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* Service Feature 2: 18th Milestone (Debut) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Image (on mobile order-2, on desktop order-1) */}
          <div className="relative overflow-hidden rounded-2xl border-4 border-white shadow-[0_25px_60px_rgba(0,0,0,0.8)] max-w-full lg:max-w-lg justify-self-center lg:justify-self-start order-2 lg:order-1">
            <img 
              src="/Pictures/service-debut.jpg" 
              alt="Your 18th: More Than a Birthday, It's a Milestone" 
              className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          {/* Right: Text (on mobile order-1, on desktop order-2) */}
          <div className="space-y-6 order-1 lg:order-2">
            <h3 
              className="text-3xl sm:text-4xl lg:text-[44px] font-bold leading-tight text-white"
              style={{ fontFamily: "'Libre Baskerville', serif" }}
            >
              <span className="text-[#FF0066]">Your 18th:</span> More Than a Birthday, It's a <span className="text-[#FF0066]">Milestone</span>
            </h3>
            <p 
              className="text-base sm:text-lg lg:text-[18px] text-gray-300 leading-relaxed font-normal"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Eighteen years in the making, designed in a single night. We transform your milestone
              into a cinematic celebration that captures exactly who you are and who you're
              becoming.
            </p>
          </div>
        </div>
      </div>

      {/* White/Pink-50 Wave Divider at the bottom transitioning to Testimonials */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform translate-y-[1px] z-10">
        <svg
          className="relative block w-full h-[40px] sm:h-[60px] lg:h-[80px]"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,80 C360,130 720,20 1080,80 C1260,100 1380,95 1440,75 L1440,120 L0,120 Z"
            fill="#fdf2f8"
          />
        </svg>
      </div>
    </section>
  );
}

/* Testimonials Section */
function TestimonialsSection() {
  return (
    <section className="bg-[#f5f0f0] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-[8%]">
        {/* Section Title */}
        <div className="mb-14 text-center">
          <h2 
            className="text-4xl sm:text-5xl lg:text-[52px] font-bold leading-tight tracking-tight text-[#1E002C]"
            style={{ fontFamily: "'Libre Baskerville', serif" }}
          >
            The Schatzies <span className="text-[#FF0066]">Experience</span>.
          </h2>
          <p 
            className="mt-5 text-base sm:text-lg lg:text-[18px] text-gray-600 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Celebrating 15 years of flawless events through the words of those who
            experienced the magic firsthand.
          </p>
        </div>

        {/* Testimonials 2-Column Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-2xl p-6 lg:p-8 shadow-[0_2px_15px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-shadow duration-300"
            >
              {/* Top Row: Avatar + Name | Quote Icon */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                    <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 
                      className="font-bold text-[#1E002C] text-sm lg:text-base"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {testimonial.name}
                    </h4>
                    <p className="text-xs font-semibold text-[#FF0066]">
                      Recommends!
                    </p>
                  </div>
                </div>

                {/* Large Pink Quote Mark */}
                <span 
                  className="text-[#FF0066] text-5xl lg:text-6xl font-bold leading-none select-none -mt-2"
                  style={{ fontFamily: "'Libre Baskerville', serif" }}
                >
                  "
                </span>
              </div>

              {/* Testimonial Text */}
              <p 
                className="text-gray-700 text-sm lg:text-[15px] leading-relaxed"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {testimonial.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
