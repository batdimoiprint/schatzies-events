export interface SectionContent {
  title: string;
  body: string;
}

export interface PageContent {
  [sectionId: string]: SectionContent;
}

export interface SiteContent {
  [pageId: string]: PageContent;
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  homepage: {
    hero: {
      title: 'Welcome to\nSchatzies\n*Events.*',
      body: 'Premium wedding and debut planning for those who want to be a guest at their own celebration. We handle the stress; you handle the memories. Your most trusted team.',
    },
    spotlight: {
      title: "Step into the *spotlight*, we'll handle the *stage*.",
      body: 'Your milestone is a masterpiece in the making. While you focus on making memories and greeting your guests, our team ensures every light, sound, and moment is executed to perfection.',
    },
    weddings: {
      title: 'A *Love Story* Told in Every Detail',
      body: 'We don’t just plan weddings; we protect your peace. From intimate vows to grand ballrooms, we ensure the only thing you focus on is the person at the end of the aisle.',
    },
    debuts: {
      title: "*Your 18th:* More Than a Birthday, It's a *Milestone*",
      body: 'Eighteen years in the making, designed in a single night. We transform your milestone into a cinematic celebration that captures exactly who you are and who you’re becoming.',
    },
    testimonials: {
      title: 'The Schatzies *experience*.',
      body: 'Celebrating 15 years of flawless events through the words of those who experienced the magic firsthand.',
    },
  },
  'about-us': {
    hero: {
      title: 'Years of turning dreams into *milestones.*',
      body: "At Schatzies Events PH, we believe you should be a guest at your own celebration. Since 2011, we've been the trusted partner for families and couples across the Philippines and beyond.",
    },
    aboutSplit: {
      title: 'About *us*.',
      body: 'Known for our complete and affordable packages, our goal is simple: simplicity. From venue styling to full program coordination, we work closely with you to ensure your event runs flawlessly.',
    },
    whyChoose: {
      title: 'Why choose *Schatzies?*',
      body: 'With years of expertise since 2011, we turn complex logistics into seamless celebrations. As your reliable on-the-ground partner, we handle the details so you can simply stay in the moment.',
    },
    reason1: {
      title: 'since 2011',
      body: 'A decade and a half of helping many clients turn special occasions into perfectly managed, memorable events.',
    },
    reason2: {
      title: "The Local's Choice",
      body: 'Your trusted partner right here in the Philippines. We handle every detail of your local celebration so you can focus on enjoying your special day with loved ones.',
    },
    reason3: {
      title: 'All-Inclusive Ease',
      body: 'Complete event packages that handle everything—from elegant venue styling and buffet catering to professional photo and video coverage.',
    },
    reason4: {
      title: 'Budget-Friendly Luxury',
      body: 'Expertly managing the details so you can focus on the moment. We specialize in all-inclusive event solutions that are both affordable and adaptable.',
    },
  },
  gallery: {
    hero: {
      title: 'The Portfolio\nGallery.',
      body: 'A collection of timeless moments, unforgettable milestones, and dreams turned into reality.',
    },
  },
  services: {
    hero: {
      title: 'Schatzies Atelier — Services\nYour perfect event, *starts here.*',
      body: 'From planning to execution, we offer everything you need to bring your dream event to life.',
    },
  },
  packages: {
    hero: {
      title: 'Our Collections\nYour dream celebration, *all-in-one.*',
      body: '17 years of perfecting the hassle-free milestone. Explore our curated wedding and debut collections designed to handle every detail.',
    },
  },
  footer: {
    brand: {
      title: 'Schatzies *Events*',
      body: 'Creating unforgettable moments and turning your dream events into reality with precision, passion, and perfection.',
    },
  },
};
