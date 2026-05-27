export interface LampSeed {
  slug: string;
  name: string;
  designer: string;
  country: string;
  year: number;
  material: string;
  price: number;
  sold: boolean;
  description: string;
  imageFile: string;
}

export const LAMPS: LampSeed[] = [
  {
    slug: "petale",
    name: "Pétale",
    designer: "Studio Mizu",
    country: "France",
    year: 1972,
    material: "Bronze & amber glass dome",
    price: 78000,
    sold: false,
    description:
      "A quiet object that opens slowly. The amber dome was hand-blown and joined to the bronze armature without solder. Sourced from a Lyon estate sale and brought to Nairobi in 2025.",
    imageFile: "petale.jpg",
  },
  {
    slug: "obol",
    name: "Obol",
    designer: "Vauri Karjalainen",
    country: "Finland",
    year: 1968,
    material: "Spun brass, iron base",
    price: 68000,
    sold: false,
    description:
      "Raised from a single brass disc by hand and mounted to a salvaged iron base. The year was stamped inside the rim with a typewriter face that lost its ink halfway through the run.",
    imageFile: "obol.jpg",
  },
  {
    slug: "hypnos",
    name: "Hypnos",
    designer: "Officina Romano",
    country: "Italy",
    year: 1970,
    material: "Lacquered resin, opal glass",
    price: 95000,
    sold: false,
    description:
      "Heavy enough that you move it once and leave it. The globe sits 14 degrees off centre — an accident the workshop kept for being more interesting than the drawing.",
    imageFile: "hypnos.jpg",
  },
  {
    slug: "tessera",
    name: "Tessera",
    designer: "Frattini & Sons",
    country: "Italy",
    year: 1965,
    material: "Veined glass leaves on bronze",
    price: 195000,
    sold: true,
    description:
      "Each leaf holds 84 hand-cut veins of green and umber. Frattini's workshop made nine; this was the eighth.",
    imageFile: "tessera.jpg",
  },
  {
    slug: "soglia",
    name: "Soglia",
    designer: "Bruno Cantieri",
    country: "Italy",
    year: 1958,
    material: "Steam-bent walnut",
    price: 145000,
    sold: false,
    description:
      "A study, never produced. Cantieri's notebooks show three drawings and one instruction: 'meno.' This is the only one made.",
    imageFile: "soglia.jpg",
  },
  {
    slug: "halo",
    name: "Halo 03",
    designer: "Maurer estate",
    country: "Germany",
    year: 1974,
    material: "Carved oak, brass fitting",
    price: 165000,
    sold: false,
    description:
      "The third and last of an internal trial — Maurer's studio made three and kept all three. Hollowed from a single piece of fallen oak.",
    imageFile: "halo.jpg",
  },
  {
    slug: "globo",
    name: "Globo di Luce",
    designer: "Vetreria Murano",
    country: "Italy",
    year: 1953,
    material: "Woven rattan, painted steel stem",
    price: 38000,
    sold: false,
    description:
      "Pre-stamp Murano: no maker's mark, no catalogue number. The rattan globe is wound from a single continuous reed.",
    imageFile: "globo.jpg",
  },
  {
    slug: "sentinelle",
    name: "Sentinelle",
    designer: "Atelier Brun",
    country: "France",
    year: 1981,
    material: "Folded paper, silk-thread armature",
    price: 110000,
    sold: false,
    description:
      "Tall, narrow, watchful. Brun folded forty over two summers; this is from the second batch, identifiable by a faint crease at the hem.",
    imageFile: "sentinelle.jpg",
  },
  {
    slug: "noumea",
    name: "Nouméa",
    designer: "Jean-Paul Lacoste",
    country: "France",
    year: 1962,
    material: "Carved driftwood, neon filament",
    price: 245000,
    sold: false,
    description:
      "Made for a single client and never repeated. Lacoste used driftwood collected on a 1959 expedition; the lamp is now unrepeatable by both material and ethics.",
    imageFile: "noumea.jpg",
  },
  {
    slug: "miroir",
    name: "Miroir",
    designer: "Anonyme",
    country: "Belgium",
    year: 1969,
    material: "Polished steel, salvaged wheel",
    price: 42000,
    sold: false,
    description:
      "Found in a Liège flea market in 2021 and unattributed since. The lamp throws its source backward through the spokes, splitting the light.",
    imageFile: "miroir.jpg",
  },
  {
    slug: "aino",
    name: "Aino 08",
    designer: "Aino-line",
    country: "Finland",
    year: 1956,
    material: "Stacked vinyl, threaded steel",
    price: 28000,
    sold: false,
    description:
      "The most quietly democratic lamp in the catalogue. Made in the hundreds from materials the workshop already had on the floor.",
    imageFile: "aino.jpg",
  },
  {
    slug: "umbra",
    name: "Umbra",
    designer: "Studio Reggiani",
    country: "Italy",
    year: 1977,
    material: "Lacquered steel, linen drum shade",
    price: 52000,
    sold: false,
    description:
      "Reggiani designed Umbra to cast two shadows at once — one across the wall, one across the desk.",
    imageFile: "umbra.jpg",
  },
];
