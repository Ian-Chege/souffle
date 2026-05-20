export interface Lamp {
  id: string;
  name: string;
  designer: string;
  country: string;
  year: number;
  era: string;
  material: string;
  materialTag: string;
  edition: string;
  price: number;
  status: string;
  sold: boolean;
  angle: number;
  dims: string;
  weight: string;
  condition: string;
  rewired: string;
  description: string;
  provenance: [string, string][];
}

export interface JournalEntry {
  id: string;
  kicker: string;
  title: string;
  excerpt: string;
  angle: number;
}

export const LAMPS: Lamp[] = [
  {
    id: "petale",
    name: "Pétale",
    designer: "Studio Mizu",
    country: "France",
    year: 1972,
    era: "1970s",
    material: "Brass & opaline glass",
    materialTag: "Glass",
    edition: "Numbered 4 of 80",
    price: 4800,
    status: "One available",
    sold: false,
    angle: 105,
    dims: "Ø 28 × H 42 cm",
    weight: "3.1 kg",
    condition: "Excellent. Original patina to brass; minor age-consistent marks.",
    rewired: "Yes — rewired 2024 for EU/US, signed certificate included.",
    description:
      "A quiet object that opens slowly. The opaline shade was hand-blown in two halves and joined at the seam — visible only if you look for it. Mizu intended Pétale to throw light against the wall behind it, never toward the reader. Most who buy one will reorient their room.",
    provenance: [
      ["1972", "Made in atelier, Vincennes — second series."],
      ["1981", "Acquired by the Sereau family, Lyon."],
      ["2019", "Estate sale, Hôtel Drouot, Paris."],
      ["2024", "Souffle archive, Antwerp."],
    ],
  },
  {
    id: "obol",
    name: "Obol",
    designer: "Vauri Karjalainen",
    country: "Finland",
    year: 1968,
    era: "1960s",
    material: "Spun aluminium, enamel",
    materialTag: "Metal",
    edition: "Unnumbered, est. ~120 made",
    price: 3200,
    status: "Two available",
    sold: false,
    angle: 88,
    dims: "Ø 36 × H 22 cm",
    weight: "1.8 kg",
    condition: "Very good. Light scratching to underside; enamel intact.",
    rewired: "Yes — 2023.",
    description:
      "Karjalainen worked from a single disc, raised then domed by hand. Inside the rim, he stamped the year in a typewriter face that lost its ink halfway through the run — half the surviving lamps are unmarked. This is one of the marked.",
    provenance: [
      ["1968", "Workshop, Lahti."],
      ["1992", "Bukowskis modern auctions, Stockholm."],
      ["2025", "Souffle archive."],
    ],
  },
  {
    id: "hypnos",
    name: "Hypnos",
    designer: "Officina Romano",
    country: "Italy",
    year: 1970,
    era: "1970s",
    material: "Travertine, brushed steel",
    materialTag: "Stone",
    edition: "Series of 24",
    price: 5600,
    status: "Last available",
    sold: false,
    angle: 115,
    dims: "Ø 22 × H 56 cm",
    weight: "7.2 kg",
    condition: "Excellent. Travertine base unrepaired.",
    rewired: "Yes — 2024.",
    description:
      "Heavy enough that you move it once and leave it. The shade tilts 14 degrees off vertical; the catalogue, when one surfaced, described this as 'an unhappy accident kept for being more interesting than the original drawing.'",
    provenance: [
      ["1970", "Officina Romano, Rome."],
      ["2003", "Private collection, Milan."],
      ["2025", "Souffle archive."],
    ],
  },
  {
    id: "tessera",
    name: "Tessera",
    designer: "Frattini & Sons",
    country: "Italy",
    year: 1965,
    era: "1960s",
    material: "Hand-cut glass mosaic",
    materialTag: "Glass",
    edition: "One of nine known",
    price: 8400,
    status: "Sold",
    sold: true,
    angle: 95,
    dims: "Ø 32 × H 48 cm",
    weight: "4.4 kg",
    condition: "Original; two tesserae replaced 1989.",
    rewired: "Yes — 2022.",
    description:
      "Each face holds 84 tesserae of green and umber. Frattini's workshop made nine; four are in museum collections, three in private hands, two unaccounted for. This was the eighth, identified by the slight pink in tile 41.",
    provenance: [
      ["1965", "Workshop, Milan."],
      ["1989", "Conservation, Murano."],
      ["2010", "Christie's, London."],
      ["2026", "Sold via Souffle."],
    ],
  },
  {
    id: "soglia",
    name: "Soglia",
    designer: "Bruno Cantieri",
    country: "Italy",
    year: 1958,
    era: "1950s",
    material: "Walnut, parchment",
    materialTag: "Wood",
    edition: "Prototype",
    price: 6200,
    status: "One available",
    sold: false,
    angle: 92,
    dims: "W 24 × D 18 × H 38 cm",
    weight: "2.6 kg",
    condition: "Honest wear. Parchment shade replaced in kind, 2018.",
    rewired: "Yes — 2024.",
    description:
      "A study, never produced. Cantieri's notebooks show three drawings of Soglia and one terse instruction: 'meno.' The lamp obeyed and the project closed. This is the only one made.",
    provenance: [
      ["1958", "Cantieri studio, Como."],
      ["1976", "Family archive."],
      ["2018", "Conservation, Milan."],
      ["2025", "Souffle archive."],
    ],
  },
  {
    id: "halo",
    name: "Halo 03",
    designer: "Maurer estate (unsigned)",
    country: "Germany",
    year: 1974,
    era: "1970s",
    material: "Borosilicate, nickel",
    materialTag: "Glass",
    edition: "Three of three",
    price: 7100,
    status: "One available",
    sold: false,
    angle: 100,
    dims: "Ø 30 × H 30 cm",
    weight: "2.2 kg",
    condition: "Excellent. Tiny chip to underside of glass, hidden.",
    rewired: "Yes — 2023.",
    description:
      "The third and last of an internal trial — Maurer's studio made three and kept all three. Two were sold privately in the 1990s; the third surfaced in a 2024 estate. Glass is the same borosilicate the studio used for its commercial run but blown twice as thick.",
    provenance: [
      ["1974", "Maurer studio, Munich."],
      ["2024", "Estate of Hannes Geiger."],
      ["2025", "Souffle archive."],
    ],
  },
  {
    id: "globo",
    name: "Globo di Luce",
    designer: "Vetreria Murano",
    country: "Italy",
    year: 1953,
    era: "1950s",
    material: "Murano cristallo",
    materialTag: "Glass",
    edition: "Unknown — likely ~60",
    price: 2400,
    status: "Reserved",
    sold: false,
    angle: 110,
    dims: "Ø 26 × H 32 cm",
    weight: "3.5 kg",
    condition: "Very good. One internal bubble — original to the blow.",
    rewired: "Yes — 2024.",
    description:
      "Pre-stamp Murano: no maker's mark, no catalogue number. The glass holds a green only Venetian cristallo achieves, the result of an iron flux the family abandoned by 1960. Replaced, in part, by lesser greens.",
    provenance: [
      ["1953", "Murano workshop (attr.)."],
      ["1979", "Aldo Rossi residence, Milan."],
      ["2025", "Souffle archive."],
    ],
  },
  {
    id: "sentinelle",
    name: "Sentinelle",
    designer: "Atelier Brun",
    country: "France",
    year: 1981,
    era: "1980s",
    material: "Cast bronze, silk",
    materialTag: "Metal",
    edition: "Numbered 12 of 40",
    price: 5400,
    status: "One available",
    sold: false,
    angle: 82,
    dims: "Ø 18 × H 64 cm",
    weight: "5.8 kg",
    condition: "Excellent. Original silk shade — UV protected.",
    rewired: "Yes — 2024.",
    description:
      "Tall, narrow, watchful. Brun cast forty in two pulls; this is from the second, identifiable by a faint horizontal line at the base where the mould was repaired between runs.",
    provenance: [
      ["1981", "Atelier Brun, Paris."],
      ["2002", "Private collection, Geneva."],
      ["2025", "Souffle archive."],
    ],
  },
  {
    id: "noumea",
    name: "Nouméa",
    designer: "Jean-Paul Lacoste",
    country: "France",
    year: 1962,
    era: "1960s",
    material: "Coral, brass",
    materialTag: "Stone",
    edition: "One of one",
    price: 9800,
    status: "Inquire",
    sold: false,
    angle: 98,
    dims: "Ø 24 × H 44 cm",
    weight: "4.1 kg",
    condition: "Museum-grade. Coral untouched.",
    rewired: "Yes — 2024, with original switch retained.",
    description:
      "Made for a single client and never repeated. Lacoste used a piece of coral collected on a 1959 expedition; later, when the conservation status changed, the lamp became unrepeatable by ethics as well as material.",
    provenance: [
      ["1962", "Commissioned, Paris."],
      ["1988", "Estate of the original client."],
      ["2026", "Souffle archive."],
    ],
  },
  {
    id: "miroir",
    name: "Miroir",
    designer: "Anonyme",
    country: "Belgium",
    year: 1969,
    era: "1960s",
    material: "Polished steel, mirror",
    materialTag: "Metal",
    edition: "Unknown",
    price: 1900,
    status: "One available",
    sold: false,
    angle: 90,
    dims: "Ø 32 × H 28 cm",
    weight: "2.8 kg",
    condition: "Very good. Mirror foxing — light, decorative.",
    rewired: "Yes — 2024.",
    description:
      "Found in a Liège flea market in 2021 and unattributed since. The lamp throws its source backward into a small interior mirror; you see the bulb only as a smudge of light, never directly.",
    provenance: [
      ["c.1969", "Belgium (workshop unknown)."],
      ["2021", "Marché de la Batte, Liège."],
      ["2025", "Souffle archive."],
    ],
  },
  {
    id: "aino",
    name: "Aino 08",
    designer: "Aino-line (attr.)",
    country: "Finland",
    year: 1956,
    era: "1950s",
    material: "Birch, linen shade",
    materialTag: "Wood",
    edition: "Series; ~200 made",
    price: 1450,
    status: "Three available",
    sold: false,
    angle: 86,
    dims: "Ø 26 × H 40 cm",
    weight: "1.4 kg",
    condition: "Good. Honest patina.",
    rewired: "Yes — 2023.",
    description:
      "The most quietly democratic lamp in the catalogue. Made in the hundreds and likely overlooked by every guide on this continent. Worth your time.",
    provenance: [
      ["1956", "Workshop, Helsinki."],
      ["1998", "Estate sale, Turku."],
      ["2025", "Souffle archive."],
    ],
  },
  {
    id: "umbra",
    name: "Umbra",
    designer: "Studio Reggiani",
    country: "Italy",
    year: 1977,
    era: "1970s",
    material: "Lacquered steel, linen",
    materialTag: "Metal",
    edition: "Numbered 7 of 50",
    price: 2800,
    status: "One available",
    sold: false,
    angle: 102,
    dims: "Ø 30 × H 36 cm",
    weight: "2.3 kg",
    condition: "Excellent.",
    rewired: "Yes — 2024.",
    description:
      "Reggiani designed Umbra to cast two shadows at once — one across the wall, one across the desk. Owners report that they stop noticing the second after a week, then never see anything else.",
    provenance: [
      ["1977", "Reggiani, Italy."],
      ["2007", "Phillips de Pury, London."],
      ["2025", "Souffle archive."],
    ],
  },
];

export const JOURNAL: JournalEntry[] = [
  {
    id: "j1",
    kicker: "Essay · 06 min",
    title: "On lamps that ask to be moved",
    excerpt:
      "An object should know where it wants to live. Sometimes it tells you within a week; sometimes it takes a season.",
    angle: 75,
  },
  {
    id: "j2",
    kicker: "Field note · Antwerp",
    title: "A morning with Pétale",
    excerpt:
      "Mizu's lamp throws light backward. To understand it, sit behind it for an hour and read someone else's book.",
    angle: 95,
  },
  {
    id: "j3",
    kicker: "Conservation · 10 min",
    title: "Why we rewire everything, twice",
    excerpt:
      "Every lamp passes through two electricians before reaching you. One in Antwerp; one wherever you live.",
    angle: 112,
  },
];
