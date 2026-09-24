export type PartnerMark =
  "jofebar" | "glasmarte" | "meshtec" | "agor" | "adl" | "palagina" | "brombal" | "renson";

export type Partner = {
  mark: PartnerMark;
  name: string;
  country: string;
  description: string;
};

export const PARTNERS: Partner[] = [
  {
    mark: "jofebar",
    name: "Jofebar",
    country: "Switzerland / Portugal",
    description: "PanoramAH! minimal window systems",
  },
  {
    mark: "glasmarte",
    name: "glasmarte",
    country: "Austria",
    description: "Seamless glass railing systems",
  },
  {
    mark: "meshtec",
    name: "Meshtec",
    country: "Thailand",
    description: "Stainless steel high transparency security mesh",
  },
  {
    mark: "agor",
    name: "Agor",
    country: "Israel",
    description: "Movable and retractable swimming pool floors",
  },
  {
    mark: "adl",
    name: "ADL",
    country: "Italy",
    description: "Connecting internal spaces",
  },
  {
    mark: "palagina",
    name: "Palagina",
    country: "France",
    description: "Italian vertical and horizontal sliding insect screens",
  },
  {
    mark: "brombal",
    name: "Brombal",
    country: "Italy",
    description: "Italian luxury fenestration with special metals",
  },
  {
    mark: "renson",
    name: "Renson",
    country: "USA",
    description: "Pioneers in indoor climate",
  },
];

export type PracticeMark = "plain" | "wow" | "italic" | "ecoid" | "diamond" | "solid";

export type Practice = {
  mark: PracticeMark;
  name: string;
  country: string;
  description: string;
};

export const PRACTICES: Practice[] = [
  {
    mark: "plain",
    name: "Ernesto Bedmar Architects",
    country: "Singapore",
    description: "Tropical modernist residential architecture",
  },
  {
    mark: "wow",
    name: "WOW",
    country: "Singapore",
    description: "Award-winning interior & architectural design",
  },
  {
    mark: "italic",
    name: "Andy Fisher workshop",
    country: "Singapore",
    description: "Bespoke interior design & space planning",
  },
  {
    mark: "ecoid",
    name: "eco id",
    country: "Singapore",
    description: "Sustainable architecture & green design",
  },
  {
    mark: "diamond",
    name: "Nomadic Resorts",
    country: "Netherlands",
    description: "Eco-luxury resorts & sustainable hospitality",
  },
  {
    mark: "solid",
    name: "SOM",
    country: "USA",
    description: "Global architecture, engineering & urban planning",
  },
  {
    mark: "solid",
    name: "Studio MK27",
    country: "Brazil",
    description: "Contemporary Brazilian residential architecture",
  },
  {
    mark: "solid",
    name: "Resplendent Ceylon",
    country: "Ceylon",
    description: "Heritage luxury hospitality & resort design",
  },
];
