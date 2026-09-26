import {
  Award,
  BarChart3,
  Building2,
  Clock,
  Columns3,
  Compass,
  Cpu,
  Crosshair,
  Droplet,
  Factory,
  Gauge,
  Globe,
  Hammer,
  Layers,
  Leaf,
  Lightbulb,
  Mail,
  MapPin,
  Network,
  PanelsTopLeft,
  Phone,
  Ruler,
  Share2,
  ShieldCheck,
  Sparkles,
  Sun,
  Thermometer,
  Users,
  Volume2,
  Wind,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * The icons content can name. Stored by key so content stays plain JSON;
 * the admin panel's icon picker offers exactly this list. Keys are
 * kebab-case lucide names, so adding one is a single line here.
 */
export const ICONS = {
  award: Award,
  "bar-chart-3": BarChart3,
  "building-2": Building2,
  clock: Clock,
  "columns-3": Columns3,
  compass: Compass,
  cpu: Cpu,
  crosshair: Crosshair,
  droplet: Droplet,
  factory: Factory,
  gauge: Gauge,
  globe: Globe,
  hammer: Hammer,
  layers: Layers,
  leaf: Leaf,
  lightbulb: Lightbulb,
  mail: Mail,
  "map-pin": MapPin,
  network: Network,
  "panels-top-left": PanelsTopLeft,
  phone: Phone,
  ruler: Ruler,
  "share-2": Share2,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  sun: Sun,
  thermometer: Thermometer,
  users: Users,
  "volume-2": Volume2,
  wind: Wind,
  wrench: Wrench,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

/** The icon for a stored name; an unknown name draws a neutral mark rather than nothing. */
export function iconOf(name: string): LucideIcon {
  return (ICONS as Record<string, LucideIcon>)[name] ?? Sparkles;
}
