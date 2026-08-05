export type FieldType = "text" | "textarea" | "image" | "color" | "number" | "select" | "boolean" | "list";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string }[];
  itemFields?: FieldDef[];
  placeholder?: string;
  hint?: string;
}

export interface BlockDefinition {
  type: string;
  label: string;
  description: string;
  icon: import("@/components/icons").IconName;
  category: "layout" | "content" | "media" | "fundraising" | "social";
  defaultProps: Record<string, any>;
  fields: FieldDef[];
}

export interface PageSection {
  id: string;
  type: string;
  props: Record<string, any>;
}

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  {
    type: "hero",
    label: "Hero Slider",
    description: "Full-width image slider with text and CTA buttons",
    icon: "home",
    category: "layout",
    defaultProps: {
      overlayOpacity: "0.45",
      slides: [
        {
          title: "معاً نصنع الأمل",
          subtitle: "منصة تبرعات شفافة وآمنة لدعم الأسر المحتاجة حول العالم.",
          backgroundImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1600&auto=format&fit=crop",
          buttonText: "تبرع الآن",
          buttonLink: "/donate"
        },
        {
          title: "يدٌ تمتد لكل محتاج",
          subtitle: "تبرعك يصل مباشرة للمستحقين دون وسيط بشفافية كاملة.",
          backgroundImage: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1920&q=80",
          buttonText: "تصفح الحملات",
          buttonLink: "/campaigns"
        },
        {
          title: "كل درهم يغير حياة",
          subtitle: "من الغذاء والمأوى إلى التعليم والرعاية الصحية — معك نصنع الفرق.",
          backgroundImage: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1920&q=80",
          buttonText: "تبرع الآن",
          buttonLink: "/donate"
        }
      ]
    },
    fields: [
      { key: "overlayOpacity", label: "Overlay Darkness (0–1)", type: "text", hint: "0 = transparent, 1 = fully dark" },
      {
        key: "slides", 
        label: "Slider Images", 
        type: "list", // هنا يكمن السحر: تحويله إلى مصفوفة قابلة للإضافة
        itemFields: [
          { key: "title", label: "Headline", type: "text", placeholder: "Main hero title" },
          { key: "subtitle", label: "Subheading", type: "textarea", placeholder: "Supporting description text" },
          { key: "buttonText", label: "Button Label", type: "text" },
          { key: "buttonLink", label: "Button URL", type: "text" },
          { key: "backgroundImage", label: "Background Image", type: "image", hint: "Use high-res image (1920×1080 recommended)" }
        ]
      }
    ],
  },
  {
    type: "stats",
    label: "Statistics",
    description: "Display key numbers and impact metrics",
    icon: "bar-chart",
    category: "content",
    defaultProps: {
      title: "Our Impact So Far",
      items: [
        { title: "Total Raised", value: "$482,300" },
        { title: "Donors", value: "12,540" },
        { title: "Active Campaigns", value: "8" },
        { title: "Families Supported", value: "3,210" },
      ],
    },
    fields: [
      { key: "title", label: "Section Title", type: "text" },
      {
        key: "items", label: "Statistics", type: "list",
        itemFields: [
          { key: "title", label: "Label", type: "text" },
          { key: "value", label: "Value", type: "text" },
        ],
      },
    ],
  },
  {
    type: "text",
    label: "Text Block",
    description: "Rich text paragraph with optional title",
    icon: "file-text",
    category: "content",
    defaultProps: {
      title: "About Us",
      body: "We are an independent donation platform dedicated to supporting affected families in crisis zones through secure and transparent donation channels.",
      align: "right",
    },
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "body", label: "Body Text", type: "textarea" },
      {
        key: "align", label: "Text Alignment", type: "select",
        options: [
          { label: "Right (RTL)", value: "right" },
          { label: "Left (LTR)", value: "left" },
          { label: "Center", value: "center" },
        ],
      },
    ],
  },
  {
    type: "image_text",
    label: "Image + Text",
    description: "Side-by-side image and text layout",
    icon: "image",
    category: "layout",
    defaultProps: {
      title: "How Your Donation Is Used",
      body: "Donations go directly to food baskets, clean water, essential medicines, and tents for displaced families — in coordination with humanitarian organizations on the ground.",
      image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1200&auto=format&fit=crop",
      imagePosition: "left",
    },
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "body", label: "Body Text", type: "textarea" },
      { key: "image", label: "Image", type: "image" },
      {
        key: "imagePosition", label: "Image Position", type: "select",
        options: [
          { label: "Left", value: "left" },
          { label: "Right", value: "right" },
        ],
      },
    ],
  },
  {
    type: "donation_buttons",
    label: "Quick Donate Widget",
    description: "Preset amount buttons with custom donation option",
    icon: "heart",
    category: "fundraising",
    defaultProps: {
      title: "Donate Now",
      subtitle: "Choose an amount or enter a custom one",
      amounts: [1, 5, 10, 25, 50, 100],
      campaignId: "",
      allowMonthly: true,
    },
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "text" },
      { key: "allowMonthly", label: "Allow Monthly Recurring", type: "boolean" },
    ],
  },
  {
    type: "campaigns_grid",
    label: "Campaigns Grid",
    description: "Display active campaigns in a responsive grid",
    icon: "layout-grid",
    category: "fundraising",
    defaultProps: {
      title: "Active Campaigns",
      subtitle: "Choose a campaign and make a difference",
      limit: 6,
      onlyFeatured: false,
    },
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "text" },
      { key: "limit", label: "Max Campaigns to Show", type: "number" },
      { key: "onlyFeatured", label: "Featured Campaigns Only", type: "boolean" },
    ],
  },
  {
    type: "gallery",
    label: "Photo Gallery",
    description: "Masonry or grid image gallery",
    icon: "image",
    category: "media",
    defaultProps: {
      title: "Snapshots from the Field",
      images: [
        { url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=800" },
        { url: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?q=80&w=800" },
        { url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=800" },
      ],
    },
    fields: [
      { key: "title", label: "Title", type: "text" },
      {
        key: "images", label: "Images", type: "list",
        itemFields: [{ key: "url", label: "Image URL", type: "image" }],
      },
    ],
  },
  {
    type: "stories",
    label: "Success Stories",
    description: "Testimonials and impact stories from beneficiaries",
    icon: "message-square",
    category: "social",
    defaultProps: {
      title: "Stories of Impact",
      items: [
        {
          title: "The Abu Yousef Family",
          body: "Thanks to your donations, the Abu Yousef family received a food basket and clean water supply for over two weeks.",
          image: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?q=80&w=600",
        },
        {
          title: "Mobile Medical Clinic",
          body: "A mobile clinic was equipped with essential medical supplies to serve more than 500 families monthly.",
          image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600",
        },
      ],
    },
    fields: [
      { key: "title", label: "Section Title", type: "text" },
      {
        key: "items", label: "Stories", type: "list",
        itemFields: [
          { key: "title", label: "Name / Title", type: "text" },
          { key: "body", label: "Story Text", type: "textarea" },
          { key: "image", label: "Photo", type: "image" },
        ],
      },
    ],
  },
  {
    type: "faq",
    label: "FAQ",
    description: "Frequently asked questions with accordion answers",
    icon: "help-circle",
    category: "content",
    defaultProps: {
      title: "Frequently Asked Questions",
      items: [
        { title: "Are my donations secure?", body: "Yes, we use world-class payment gateways including Stripe and PayPal to fully secure your financial information." },
        { title: "Will I get a donation receipt?", body: "Yes, an electronic receipt is automatically sent to your email immediately after your donation is completed." },
        { title: "How are donations used?", body: "Visit our Financial Transparency page for a detailed breakdown of how donations are distributed across projects." },
      ],
    },
    fields: [
      { key: "title", label: "Section Title", type: "text" },
      {
        key: "items", label: "Questions", type: "list",
        itemFields: [
          { key: "title", label: "Question", type: "text" },
          { key: "body", label: "Answer", type: "textarea" },
        ],
      },
    ],
  },
  {
    type: "cta",
    label: "Call to Action",
    description: "High-impact banner with a single CTA button",
    icon: "megaphone",
    category: "layout",
    defaultProps: {
      title: "Every Minute of Delay Costs a Life",
      subtitle: "Contribute now and be part of the solution",
      buttonText: "Donate Now",
      buttonLink: "/donate",
      style: "brand",
    },
    fields: [
      { key: "title", label: "Headline", type: "text" },
      { key: "subtitle", label: "Subheading", type: "text" },
      { key: "buttonText", label: "Button Label", type: "text" },
      { key: "buttonLink", label: "Button URL", type: "text" },
      {
        key: "style", label: "Background Style", type: "select",
        options: [
          { label: "Brand Blue", value: "brand" },
          { label: "Gold / Premium", value: "gold" },
          { label: "Beige / Soft", value: "beige" },
        ],
      },
    ],
  },
  {
    type: "contact_form",
    label: "Contact Form",
    description: "Embedded contact form with email delivery",
    icon: "mail",
    category: "social",
    defaultProps: {
      title: "Contact Us",
      subtitle: "We welcome your questions and inquiries",
      email: "info@forrelief.org",
    },
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "text" },
      { key: "email", label: "Recipient Email", type: "text" },
    ],
  },
  {
    type: "newsletter",
    label: "Newsletter Signup",
    description: "Email subscription form with custom messaging",
    icon: "mail",
    category: "social",
    defaultProps: {
      title: "Subscribe to Our Newsletter",
      subtitle: "Be the first to know about updates and new campaigns",
    },
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "text" },
    ],
  },
  {
    type: "full_image",
    label: "Full Width Image",
    description: "Display an image at full page width",
    icon: "image",
    category: "media",
    defaultProps: {
      src: "",
      alt: "",
      caption: "",
      maxHeight: "600",
    },
    fields: [
      { key: "src", label: "Image", type: "image" },
      { key: "alt", label: "Alt Text", type: "text" },
      { key: "caption", label: "Caption (optional)", type: "text" },
      { key: "maxHeight", label: "Max Height (px)", type: "number" },
    ],
  },
  {
    type: "spacer",
    label: "Spacer / Divider",
    description: "Add vertical spacing between sections",
    icon: "minus",
    category: "layout",
    defaultProps: { height: "48" },
    fields: [{ key: "height", label: "Height (px)", type: "number" }],
  },
];

export const BLOCK_CATEGORIES = [
  { id: "all",         label: "All Blocks"  },
  { id: "layout",      label: "Layout"      },
  { id: "content",     label: "Content"     },
  { id: "fundraising", label: "Fundraising" },
  { id: "media",       label: "Media"       },
  { id: "social",      label: "Social"      },
];

export function getBlockDefinition(type: string) {
  return BLOCK_DEFINITIONS.find((b) => b.type === type);
}

export function createSection(type: string): PageSection {
  const def = getBlockDefinition(type);
  return {
    id: crypto.randomUUID(),
    type,
    props: def ? structuredClone(def.defaultProps) : {},
  };
}