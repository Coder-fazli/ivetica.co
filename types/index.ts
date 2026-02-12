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
