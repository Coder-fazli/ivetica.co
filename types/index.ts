export type HeroType = {
  headline: string;
  subtitle: string;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
};

export type AboutType = {
  title: string;
  description1: string;
  description2: string;
  image: string;
  founderQuote: string;
  founderAvatar: string;
};

export type ServiceType = {
  title: string;
  description: string;
  link: string;
};

export type TeamMemberType = {
  name: string;
  role: string;
  photo: string;
  socials: {
    behance?: string;
    dribbble?: string;
    twitter?: string;
    github?: string;
  };
};

export type TestimonialType = {
  name: string;
  company: string;
  quote: string;
};

export type PartnerType = {
  name: string;
  logo: string;
  link?: string;
};

export type HomepageType = {
  hero: HeroType;
  about: AboutType;
  services: ServiceType[];
  team: TeamMemberType[];
  testimonials: TestimonialType[];
  partners: PartnerType[];
};

export type ServiceDetailType = {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  features: string[];
  icon?: string;
  image?: string;
};

export type WorkMetricType = {
  label: string;
  value: string;
};

export type WorkType = {
  title: string;
  slug: string;
  client: string;
  tags: string[];
  thumbnail?: string;
  challenge?: string;
  approach?: string;
  results?: string;
  gallery?: string[];
  metrics?: WorkMetricType[];
  blocks?: Block[];
};

export type MediaItem = {
  url: string;
  kind: "image" | "video" | "text";
};

export type Block =
| { type: "full-media"; media: MediaItem }
| { type: "portrait-media"; media: MediaItem }
| { type: "two-column"; left: MediaItem; right: MediaItem }
| { type: "text"; label: string; body: string }
| { type: "media-text"; media: MediaItem; body: string }
| { type: "text-two-col"; leftLabel: string; leftBody: string; rightLabel: string; rightBody: string }
| { type: "text-full"; label: string; body: string };