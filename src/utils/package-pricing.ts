/**
 * Hardcoded package pricing matrix for Schatzies Events PH.
 *
 * Based on the official pricing from chat-support.json:
 *
 * WEDDING packages:
 *   Blooms:      50 pax ₱200,000 | 100 pax ₱235,000 | 150 pax ₱277,500 | 200 pax ₱320,000
 *   Fascinating: 100 pax ₱295,000 | 150 pax ₱342,500 | 200 pax ₱390,000
 *   Windy:       100 pax ₱420,000 | 150 pax ₱480,000 | 200 pax ₱540,000
 *   De Luxe:     100 pax ₱520,000 | 150 pax ₱585,000 | 200 pax ₱650,000
 *   Grandezza:   100 pax ₱780,000 | 150 pax ₱870,000 | 200 pax ₱960,000
 *
 * Extra head charges (Wedding) – beyond 100 pax:
 *   Blooms: ₱850/head | Fascinating: ₱950/head | Windy: ₱950/head
 *   De Luxe: ₱1,300/head | Grandezza: ₱1,800/head
 *
 * DEBUT packages:
 *   Charming:     100 pax ₱200,000 | 150 pax ₱242,500 | 200 pax ₱285,000
 *   Irresistible: 100 pax ₱295,000 | 150 pax ₱342,500 | 200 pax ₱390,000
 *   Flawless:     100 pax ₱395,000 | 150 pax ₱445,000 | 200 pax ₱495,000
 *   Elegancia:    100 pax ₱495,000 | 150 pax ₱555,000 | 200 pax ₱615,000
 *   Grandiosa:    100 pax ₱595,000 | 150 pax ₱670,000 | 200 pax ₱745,000
 *
 * Extra head charges (Debut):
 *   Charming: ₱850/head | Irresistible: ₱950/head | Flawless: ₱1,000/head
 *   Elegancia: ₱1,200/head | Grandiosa: ₱1,500/head
 */

export function calculatePackagePrice(packageName: string, eventType: string, pax: number): number {
  const pkg = packageName.trim().toLowerCase();
  const type = eventType.trim().toLowerCase();

  if (type === 'wedding') {
    if (pkg === 'blooms') {
      if (pax <= 50) return 200000;
      if (pax <= 100) return 235000;
      if (pax <= 150) return 277500;
      return 320000;
    }
    if (pkg === 'fascinating') {
      if (pax <= 100) return 295000;
      if (pax <= 150) return 342500;
      return 390000;
    }
    if (pkg === 'windy') {
      if (pax <= 100) return 420000;
      if (pax <= 150) return 480000;
      return 540000;
    }
    if (pkg === 'de luxe') {
      if (pax <= 100) return 520000;
      if (pax <= 150) return 585000;
      return 650000;
    }
    if (pkg === 'grandezza') {
      if (pax <= 100) return 780000;
      if (pax <= 150) return 870000;
      return 960000;
    }
  } else if (type === 'debut') {
    if (pkg === 'charming') {
      if (pax <= 100) return 200000;
      if (pax <= 150) return 242500;
      return 285000;
    }
    if (pkg === 'irresistible') {
      if (pax <= 100) return 295000;
      if (pax <= 150) return 342500;
      return 390000;
    }
    if (pkg === 'flawless') {
      if (pax <= 100) return 395000;
      if (pax <= 150) return 445000;
      return 495000;
    }
    if (pkg === 'elegancia') {
      if (pax <= 100) return 495000;
      if (pax <= 150) return 555000;
      return 615000;
    }
    if (pkg === 'grandiosa') {
      if (pax <= 100) return 595000;
      if (pax <= 150) return 670000;
      return 745000;
    }
  }

  return 0;
}
