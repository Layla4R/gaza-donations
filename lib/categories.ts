import { IconName } from "@/components/icons";

export const CAMPAIGN_CATEGORIES: Record<string, { label: string; icon: IconName }> = {
  food: { label: "غذاء", icon: "utensils" },
  medical: { label: "طبي", icon: "cross" },
  shelter: { label: "مأوى", icon: "home" },
  education: { label: "تعليم", icon: "book-open" },
  water: { label: "مياه", icon: "droplet" },
  general: { label: "عام", icon: "hand-heart" },
};

export function categoryMeta(category?: string | null) {
  return CAMPAIGN_CATEGORIES[category || "general"] || CAMPAIGN_CATEGORIES.general;
}
