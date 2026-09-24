import { t as IMAGES } from "./images-DAzp0ysB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/data-C7-ErtLf.js
var CATEGORIES = [
	"All",
	"Residential",
	"Hospitality",
	"Commercial",
	"Institutional",
	"International"
];
var SORTS = [
	{
		key: "featured",
		label: "Featured"
	},
	{
		key: "newest",
		label: "Newest"
	},
	{
		key: "name",
		label: "A – Z"
	}
];
var FEATURED = {
	eyebrow: "Featured Project",
	location: "Murud, Maharashtra",
	title: ["Parikrama,", "Murud House"],
	architect: "SPASM Architects",
	description: "A tropical residence shaped around landscape, light and a continuous relationship between inside and outside. Set along the Konkan coast, Parikrama is a quiet dialogue with its surroundings — open to the climate, grounded in nature, and designed for a slower way of living.",
	specs: [
		{
			label: "Typology",
			value: "Residence"
		},
		{
			label: "Architect",
			value: "SPASM Architects"
		},
		{
			label: "Durall’s Role",
			value: "Systems ·\nEngineering Execution"
		}
	],
	award: {
		name: "Architectural Hunter Award",
		year: "2025"
	}
};
var PROJECTS = [
	{
		index: "02",
		name: "Patina",
		location: "Maldives",
		architect: "Studio MK27",
		categories: ["Hospitality", "International"],
		image: IMAGES.projectPatina,
		year: 2024
	},
	{
		index: "03",
		name: "Sentosa House",
		location: "Singapore",
		architect: "Studio MK27",
		categories: ["Residential", "International"],
		image: IMAGES.projectSentosa,
		year: 2023
	},
	{
		index: "04",
		name: "Chiltron House",
		location: "Singapore",
		architect: "WOW Architects",
		categories: ["Residential", "International"],
		image: IMAGES.projectChiltron,
		year: 2022
	},
	{
		index: "05",
		name: "Juhu House",
		location: "Mumbai",
		architect: "Ernesto Bedmar",
		categories: ["Residential"],
		image: IMAGES.projectJuhu,
		year: 2021
	},
	{
		index: "06",
		name: "Project Bangalore",
		location: "Bangalore, Karnataka",
		architect: "WOW Architects",
		categories: ["Commercial", "Institutional"],
		image: IMAGES.projectBangalore,
		year: 2025
	},
	{
		index: "07",
		name: "Banyan Villa",
		location: "Phuket",
		architect: "Studio MK27",
		categories: ["Hospitality", "International"],
		image: IMAGES.projectBanyan,
		year: 2020
	}
];
/** Featured gallery: the hero frame plus the portfolio photos ("01 / 07"). */
var FEATURED_GALLERY = [{
	image: IMAGES.projectFeatured,
	alt: "Parikrama, Murud House — SPASM Architects"
}, ...PROJECTS.map((p) => ({
	image: p.image,
	alt: `${p.name} — ${p.architect}`
}))];
//#endregion
export { SORTS as a, PROJECTS as i, FEATURED as n, FEATURED_GALLERY as r, CATEGORIES as t };
