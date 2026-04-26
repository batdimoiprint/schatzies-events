import type { PackageWithModal } from '@/components/PackageModal';

export const weddingPackages: PackageWithModal[] = [
  {
    id: 1,
    name: 'Blooms',
    description:
      'Professionally styled reception backdrops, full photo and video coverage, and signature welcome treats like our Iced Coffee Bar.',
    image: '/Pictures/pkg-blooms.jpg',
    modal: {
      note: 'A comprehensive all-in-one collection designed for a seamless event experience. This package includes our full standard of service and professional coordination for up to 200 guests.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: [
            '1 Lead Planner & 4 Coordinators',
            'Staff with Handheld Radios',
            'Professional Event Emcee',
          ],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: [
            'Full Buffet (Beef, Pork, Chicken, Fish)',
            'Signature Iced Coffee Bar',
            'French Fries & Cookies Station',
          ],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: [
            'Elegant Reception Backdrop',
            'Tiffany Chairs for all guests',
            'Full Sound & Light System',
          ],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: [
            '1 Photographer & 2 Videographers',
            'Cinematic Highlight Video',
            'Airbrush Makeup for Bride & Mom',
          ],
        },
      ],
    },
  },
  {
    id: 2,
    name: 'Fascinating',
    description:
      'A cinematic experience featuring high-end storytelling through drone coverage, LED visuals, and a professional magnetic leatherette album.',
    image: '/Pictures/pkg-fascinating.jpg',
    modal: {
      note: 'A premium visual-focused collection designed for cinematic storytelling. This package includes our full standard of service and professional coordination for up to 200 guests.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: [
            '1 Lead Planner & 4 Coordinators',
            'Staff with Handheld Radios',
            'Professional Event Emcee',
            { text: 'Chauffeured Bridal Car (3 Hours)', highlight: true },
          ],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: [
            'Full Buffet (Beef, Pork, Chicken, Fish)',
            'Signature Iced Coffee Bar',
            'French Fries & Cookies Station',
            { text: '10 Bottles of Local Wine', highlight: true },
          ],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: [
            'Elegant Reception Backdrop',
            { text: 'High-Definition LED Wall', highlight: true },
            'Full Sound & Light System',
            { text: 'Drone Coverage for Aerial Shots', highlight: true },
          ],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: [
            '1 Photographer & 2 Videographers',
            { text: 'Same-Day Edit (SDE) Video', highlight: true },
            'Airbrush Makeup for Bride & Mom',
            { text: '40-Page Magnetic Leatherette Album', highlight: true },
          ],
        },
      ],
    },
  },
  {
    id: 3,
    name: 'Windy',
    description:
      'An enchanted atmosphere brought to life with signature fairy-light dance floors, entrance tunnels, and immersive overhead ceiling treatments.',
    image: '/Pictures/pkg-windy.jpg',
    modal: {
      note: 'An immersive atmosphere-focused collection designed for a magical, light-filled experience. This package includes our full standard of service and professional coordination for up to 200 guests.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: [
            '1 Lead Planner & 4 Coordinators',
            'Staff with Handheld Radios',
            'Professional Event Emcee',
            { text: 'Chauffeured Bridal Car (3 Hours)', highlight: true },
          ],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: [
            'Full Buffet (Beef, Pork, Chicken, Fish)',
            'Signature Iced Coffee Bar',
            'French Fries & Cookies Station',
            { text: '10 Bottles of Local Wine', highlight: true },
          ],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: [
            { text: 'Signature Fairy-light Dance Floor', highlight: true },
            { text: 'Immersive Overhead Ceiling Treatment', highlight: true },
            { text: 'Elegant Entrance Tunnel Setup', highlight: true },
            'Full Sound & Light System',
          ],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: [
            '1 Photographer & 2 Videographers',
            { text: 'Same-Day Edit (SDE) Video', highlight: true },
            'Airbrush Makeup for Bride & Mom',
            { text: '40-Page Magnetic Leatherette Album', highlight: true },
          ],
        },
      ],
    },
  },
  {
    id: 4,
    name: 'De Luxe',
    description:
      'Sophisticated luxury defined by premium guest experiences, featuring a chauffeured Mercedes Benz and a free-flowing cocktail mobile bar.',
    image: '/Pictures/pkg-deluxe.jpg',
    modal: {
      note: 'A high-end hospitality collection designed for a refined and sophisticated celebration. This package includes our full standard of service and professional coordination for up to 200 guests.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: [
            '1 Lead Planner & 5 Coordinators',
            'Staff with Handheld Radios',
            'Professional Event Emcee',
            { text: 'Mercedes Benz Bridal Car (3 Hours)', highlight: true },
          ],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: [
            'Full Buffet (Beef, Pork, Chicken, Fish)',
            'Signature Iced Coffee Bar',
            'French Fries & Cookies Station',
            { text: 'Free-Flowing Mobile Bar (Cocktails)', highlight: true },
          ],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: [
            'Elegant Reception Backdrop',
            { text: 'High-Definition LED Wall', highlight: true },
            'Full Sound & Light System',
            { text: 'Panoramic Entrance Backdrop', highlight: true },
          ],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: [
            '1 Photographer & 2 Videographers',
            { text: 'Same-Day Edit (SDE) Video', highlight: true },
            { text: '40-Page Magnetic Leatherette Album', highlight: true },
            { text: 'Personalized Guest Souvenirs', highlight: true },
          ],
        },
      ],
    },
  },
  {
    id: 5,
    name: 'Grandezza',
    description:
      'The ultimate luxury wedding experience with white-glove service and exclusive VIP features.',
    image: '/Pictures/pkg-grandezza.jpg',
    modal: {
      note: 'Our most premium collection designed for the most discerning couples. This ultra-luxury package includes concierge-level service and professional coordination for up to 300+ guests.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: [
            '1 Lead Planner & 6 Coordinators',
            'Dedicated Wedding Day Manager',
            'Professional Event Emcee & MC',
            { text: 'White-Glove Concierge Service', highlight: true },
          ],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: [
            { text: 'Premium Multi-Course Plated Dinner', highlight: true },
            { text: 'Premium Open Bar (All Night)', highlight: true },
            { text: 'Champagne Toast & Signature Cocktails', highlight: true },
            { text: 'Late Night Dessert Bar', highlight: true },
          ],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: [
            { text: 'Grand Ballroom Setup & Decor', highlight: true },
            { text: 'Custom Lighting Installation', highlight: true },
            { text: 'Luxury Lounge Seating Areas', highlight: true },
            { text: 'Premium Floral Arrangements', highlight: true },
          ],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: [
            { text: '2 Photographers & 3 Videographers', highlight: true },
            { text: '4K Cinematic Film Production', highlight: true },
            { text: 'Custom Photo Album + Digital Collection', highlight: true },
            { text: 'Professional Hair & Makeup for Full Wedding Party', highlight: true },
          ],
        },
      ],
    },
  },
];

export const debutPackages: PackageWithModal[] = [
  {
    id: 1,
    name: 'Charming',
    description:
      'Professionally styled reception backdrops, full photo and video coverage, and signature welcome treats.',
    image: '/Pictures/hero-1.jpg',
    modal: {
      note: 'A chic and stylish collection designed to handle your traditions with professional grace. This package includes our full standard of service and professional coordination for up to 200 guests.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: [
            '1 Lead Planner & 4 Coordinators',
            'Staff with Handheld Radios',
            'Professional Event Emcee',
            'Coordination of 18 Roses & Treasures',
          ],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: [
            'Full Buffet (Beef, Pork, Chicken, Fish)',
            'Signature Iced Coffee Bar',
            'French Fries & Cookies Station',
            'One Round of Iced Tea for All Guests',
          ],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: [
            'Elegant Reception Backdrop',
            'Tiffany Chairs for all guests',
            'Full Sound & Light System',
            'Debutante Stage Setup',
          ],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: [
            '1 Photographer & 2 Videographers',
            'Cinematic Highlight Video',
            'Professional Hair & Makeup Coverage',
            'Custom Souvenir Materials',
          ],
        },
      ],
    },
  },
  {
    id: 2,
    name: 'Irresistible',
    description:
      'A glamorous experience featuring LED visuals, drone coverage, and premium photography services for all angles.',
    image: '/Pictures/hero-4.jpg',
    modal: {
      note: 'A premium visual-focused collection designed for stunning imagery. This package includes our full standard of service and professional coordination for up to 200 guests.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: [
            '1 Lead Planner & 4 Coordinators',
            'Staff with Handheld Radios',
            'Professional Event Emcee',
            { text: 'Coordination of 18 Roses & Treasures', highlight: true },
          ],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: [
            'Full Buffet (Beef, Pork, Chicken, Fish)',
            'Signature Iced Coffee Bar',
            'French Fries & Cookies Station',
            { text: '10 Bottles of Local Wine', highlight: true },
          ],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: [
            'Elegant Reception Backdrop',
            { text: 'High-Definition LED Wall', highlight: true },
            'Full Sound & Light System',
            { text: 'Drone Coverage for Aerial Shots', highlight: true },
          ],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: [
            '1 Photographer & 2 Videographers',
            { text: 'Same-Day Edit (SDE) Video', highlight: true },
            'Professional Hair & Makeup Coverage',
            { text: '40-Page Magnetic Leatherette Album', highlight: true },
          ],
        },
      ],
    },
  },
  {
    id: 3,
    name: 'Elegancia',
    description:
      'An enchanted gathering with fairy-light installations, premium styling, and immersive lighting designs.',
    image: '/Pictures/hero-5.jpg',
    modal: {
      note: 'An immersive atmosphere-focused collection designed for a magical experience. This package includes our full standard of service and professional coordination for up to 200 guests.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: [
            '1 Lead Planner & 4 Coordinators',
            'Staff with Handheld Radios',
            'Professional Event Emcee',
            { text: 'Coordination of 18 Roses & Treasures', highlight: true },
          ],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: [
            'Full Buffet (Beef, Pork, Chicken, Fish)',
            'Signature Iced Coffee Bar',
            'French Fries & Cookies Station',
            { text: '10 Bottles of Local Wine', highlight: true },
          ],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: [
            { text: 'Signature Fairy-light Dance Floor', highlight: true },
            { text: 'Immersive Overhead Ceiling Treatment', highlight: true },
            { text: 'Elegant Entrance Tunnel Setup', highlight: true },
            'Full Sound & Light System',
          ],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: [
            '1 Photographer & 2 Videographers',
            { text: 'Same-Day Edit (SDE) Video', highlight: true },
            'Professional Hair & Makeup Coverage',
            { text: '40-Page Magnetic Leatherette Album', highlight: true },
          ],
        },
      ],
    },
  },
  {
    id: 4,
    name: 'Flawless',
    description:
      'Premium luxury debut with Mercedes transportation, exclusive bar service, and high-definition visuals.',
    image: '/Pictures/hero-7.jpg',
    modal: {
      note: 'A high-end hospitality collection designed for a refined celebration. This package includes our full standard of service and professional coordination for up to 200 guests.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: [
            '1 Lead Planner & 5 Coordinators',
            'Staff with Handheld Radios',
            'Professional Event Emcee',
            { text: 'Mercedes Benz Transportation', highlight: true },
          ],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: [
            'Full Buffet (Beef, Pork, Chicken, Fish)',
            'Signature Iced Coffee Bar',
            'French Fries & Cookies Station',
            { text: 'Mobile Bar Service (Premium Beverages)', highlight: true },
          ],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: [
            'Elegant Reception Backdrop',
            { text: 'High-Definition LED Wall', highlight: true },
            'Full Sound & Light System',
            { text: 'Panoramic Entrance Backdrop', highlight: true },
          ],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: [
            '1 Photographer & 2 Videographers',
            { text: 'Same-Day Edit (SDE) Video', highlight: true },
            { text: '40-Page Magnetic Leatherette Album', highlight: true },
            { text: 'Personalized Guest Souvenirs', highlight: true },
          ],
        },
      ],
    },
  },
  {
    id: 5,
    name: 'Grandiosa',
    description:
      'The ultimate luxury debut collection with premium everything - VIP service, premium bar, and luxury touches.',
    image: '/Pictures/hero-11.jpg',
    modal: {
      note: 'Our most premium debut collection designed for the most discerning debutantes. This ultra-luxury package includes concierge-level service and professional coordination for up to 300+ guests.',
      categories: [
        {
          iconName: 'user',
          title: 'Professional Coordination',
          items: [
            '1 Lead Planner & 6 Coordinators',
            'Dedicated Event Day Manager',
            'Professional Event Emcee & MC',
            { text: 'White-Glove Concierge Service', highlight: true },
          ],
        },
        {
          iconName: 'utensils',
          title: 'Catering & Dining',
          items: [
            { text: 'Premium Multi-Course Plated Dinner', highlight: true },
            { text: 'Premium Open Bar (All Night)', highlight: true },
            { text: 'Champagne Toast & Signature Cocktails', highlight: true },
            { text: 'Late Night Premium Dessert Bar', highlight: true },
          ],
        },
        {
          iconName: 'scissors',
          title: 'Styling & Production',
          items: [
            { text: 'Grand Ballroom Setup & Decor', highlight: true },
            { text: 'Custom Lighting Installation', highlight: true },
            { text: 'Luxury Lounge Seating Areas', highlight: true },
            { text: 'Premium Floral Arrangements', highlight: true },
          ],
        },
        {
          iconName: 'video',
          title: 'Media & Glamour',
          items: [
            { text: '2 Photographers & 3 Videographers', highlight: true },
            { text: '4K Cinematic Film Production', highlight: true },
            { text: 'Custom Photo Album + Digital Collection', highlight: true },
            { text: 'Professional Hair & Makeup for Full Group', highlight: true },
          ],
        },
      ],
    },
  },
];

// Helper function to get package by ID and type
export function getPackageById(eventType: string, packageId: number): PackageWithModal | undefined {
  const packages = eventType === 'Wedding' ? weddingPackages : debutPackages;
  return packages.find((pkg) => pkg.id === packageId);
}

// Get all packages by type
export function getPackagesByType(eventType: string): PackageWithModal[] {
  return eventType === 'Wedding' ? weddingPackages : debutPackages;
}
