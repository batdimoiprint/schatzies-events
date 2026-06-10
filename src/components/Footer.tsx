export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black py-12 text-white lg:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-[8%]">
        {/* Main Footer Content — 3 columns */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1.5fr_0.8fr] items-start">
          {/* Brand Section */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <img
                src="/Pictures/business-logo.png"
                alt="Schatzies Events"
                className="h-12 w-auto object-contain"
              />
              <span
                className="text-white font-bold text-lg"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Schatzies
                <br />
                Events
              </span>
            </div>
            <p
              className="text-sm text-gray-400 leading-relaxed max-w-sm"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Creating unforgettable moments and turning your dream events into reality with
              precision, passion, and perfection.
            </p>
          </div>

          {/* Contact Us */}
          <div>
            <h4
              className="mb-5 font-bold text-[#FF0066] text-sm tracking-wider"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              CONTACT US
            </h4>
            <ul
              className="space-y-3 text-sm text-gray-300"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <li className="flex items-start gap-2">
                <span className="text-[#FF0066] mt-0.5">📍</span>
                <a
                  href="https://www.google.com/maps/search/27+Novaliches+Mendoza+Village+Project+8+Quezon+City"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#FF0066] transition"
                >
                  27 Novaliches Mendoza Village Project 8 Quezon City
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#FF0066]">📞</span>
                <a href="tel:+639333807868" className="hover:text-[#FF0066] transition">
                  +63 933 380 7868 / 917 502 3538
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#FF0066]">✉️</span>
                <a
                  href="mailto:schatziesevents@gmail.com"
                  className="hover:text-[#FF0066] transition"
                >
                  schatziesevents@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4
              className="mb-5 font-bold text-[#FF0066] text-sm tracking-wider"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              FOLLOW US
            </h4>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/debutandweddingpackage"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-all hover:bg-[#FF0066] hover:text-white"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/schatziesevents25/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-all hover:bg-[#FF0066] hover:text-white"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-800" />

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-400" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            © {currentYear} Schatzies Events Management. All rights reserved.
          </p>

          {/* Legal Links */}
          <div
            className="flex gap-6 text-sm text-gray-400"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <a href="/privacy-policy" className="hover:text-[#FF0066] transition underline">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="hover:text-[#FF0066] transition underline">
              Terms of Service
            </a>
            <a href="/cookie-policy" className="hover:text-[#FF0066] transition underline">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
