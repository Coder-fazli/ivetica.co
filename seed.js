const mongoose = require("mongoose");

// Same connection string from your .env.local
const MONGODB_URI =
  "mongodb+srv://ivetica:NOkOprz1tloXEotL@ivetica.qfdlhbk.mongodb.net/Ivetica?retryWrites=true&w=majority";

// Same schema as models/Homepage.ts but in plain JS (because seed.js runs with node, not Next.js)
const HomePageSchema = new mongoose.Schema({
  hero: {
    headline: String,
    subtitle: String,
    cta1Text: String,
    cta1Link: String,
    cta2Text: String,
    cta2Link: String,
  },
  about: {
    title: String,
    description1: String,
    description2: String,
    image: String,
    founderQuote: String,
    founderAvatar: String,
  },
  services: [{ title: String, description: String, link: String }],
  team: [
    {
      name: String,
      role: String,
      photo: String,
      socials: {
        behance: String,
        dribbble: String,
        twitter: String,
        github: String,
      },
    },
  ],
  testimonials: [{ name: String, company: String, quote: String }],
  partners: [{ name: String, logo: String, link: String }],
});

const Homepage = mongoose.model("Homepage", HomePageSchema);

// This is the actual data — same content that is hardcoded in your components right now
const homepageData = {
  hero: {
    headline: "Designing <span class='mil-thin'>a Better</span><br /> World <span class='mil-thin'>Today</span>",
    subtitle:
      "Our creative agency is a team of professionals focused on helping your brand grow and move forward.",
    cta1Text: "What we do",
    cta1Link: "/services",
    cta2Text: "View works",
    cta2Link: "/portfolio",
  },
  about: {
    title: "Discover <br />Our <span class='mil-thin'>Studio</span>",
    description1:
      "A digital agency is a business you hire to outsource your digital marketing efforts, instead of handling in-house. They can provide your business with a variety of digital solutions to promote your product or service online and help you hit your marketing goals and grow your business.",
    description2:
      "Digital agencies can vary in size and can provide a wide array of services. Below are the most common types of agencies.",
    image: "/img/photo/2.jpg",
  founderQuote: "Passionately Creating <span class='mil-thin'>Design Wonders:</span> Unleashing <span class='mil-thin'>Boundless Creativity</span>",
    founderAvatar: "/img/faces/1.jpg",
  },
  services: [
    {
      title: "Branding and <br />Identity Design",
      description:
        "Our creative agency is a team of professionals focused on helping your brand grow.",
      link: "/services",
    },
    {
      title: "Website Design and <br /> Development",
      description:
        "Our creative agency is a team of professionals focused on helping your brand grow.",
      link: "/services",
    },
    {
      title: "Advertising and <br /> Marketing Campaigns",
      description:
        "Our creative agency is a team of professionals focused on helping your brand grow.",
      link: "/services",
    },
    {
      title: "Creative Consulting and <br />Development",
      description:
        "Our creative agency is a team of professionals focused on helping your brand grow.",
      link: "/services",
    },
  ],
  team: [
    {
      name: "Anna Oldman",
      role: "Director",
      photo: "/img/faces/1.jpg",
      socials: { behance: "#", dribbble: "#" },
    },
    {
      name: "Oscar Freeman",
      role: "Interrupted Designer",
      photo: "/img/faces/2.jpg",
      socials: { dribbble: "#", behance: "#" },
    },
    {
      name: "Emma Newman",
      role: "Interrupted Designer",
      photo: "/img/faces/3.jpg",
      socials: { behance: "#", dribbble: "#" },
    },
    {
      name: "Lisa Trueman",
      role: "Brand Consultant",
      photo: "/img/faces/4.jpg",
      socials: { twitter: "#", github: "#" },
    },
  ],
  testimonials: [
    {
      name: "Sarah Newman",
      company: "Envato market",
      quote:
        "This creative agency stands out with their exceptional talent and expertise. Their ability to think outside the box and bring unique ideas to life is truly impressive. With meticulous attention to detail, they consistently deliver visually stunning and impactful work.",
    },
    {
      name: "Emma Trueman",
      company: "Envato market",
      quote:
        "I had the pleasure of working with this creative agency, and I must say, they truly impressed me. They consistently think outside the box, resulting in impressive and impactful work. I highly recommend this agency for their consistent delivery of exceptional creative solutions.",
    },
  ],
  partners: [
    { name: "Partner 1", logo: "/img/partners/1.svg", link: "#" },
    { name: "Partner 2", logo: "/img/partners/2.svg", link: "#" },
  ],
};

// Connect to MongoDB, insert data, disconnect
async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Delete old data (so you don't get duplicates if you run this twice)
    await Homepage.deleteMany({});
    console.log("Cleared old homepage data");

    // Insert the new data
    await Homepage.create(homepageData);
    console.log("Homepage seeded!");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();
