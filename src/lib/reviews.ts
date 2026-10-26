export interface Review {
  id: string;
  name: string;
  role_or_company: string;
  email?: string | null;
  rating: number; // 1 to 5
  message: string;
  verified: boolean;
  status: "accepted" | "declined" | "pending";
  created_at: string;
}

export interface ReviewStats {
  averageRating: number;
  totalCount: number;
  verifiedCount: number;
  recommendedPercent: number;
  ratingDistribution: Record<number, number>;
}

export const SEED_REVIEWS: Review[] = [
  {
    id: "seed-rev-1",
    name: "Rajesh Kannan",
    role_or_company: "Director, Kannan Textiles & Exports",
    email: "rajesh@kannantextiles.in",
    rating: 5,
    message:
      "ZEXOVA DIGITAL built our corporate website and B2B ordering catalog. The performance, design quality, and mobile responsiveness exceeded our expectations. Our client inquiries doubled in the first month!",
    verified: true,
    status: "accepted",
    created_at: "2026-10-15T10:30:00.000Z",
  },
  {
    id: "seed-rev-2",
    name: "Priya Sundaram",
    role_or_company: "Founder, Bloom Organic Skincare",
    email: "priya@bloomsin.com",
    rating: 5,
    message:
      "Amazing work on our e-commerce platform. The checkout process is super fast, and the mobile experience is seamless. The team was extremely patient and supportive throughout our launch.",
    verified: true,
    status: "accepted",
    created_at: "2026-10-18T14:20:00.000Z",
  },
  {
    id: "seed-rev-3",
    name: "Dr. Arvind Swaminathan",
    role_or_company: "Managing Director, Apex Healthcare Clinics",
    email: "arvind@apexhealth.org",
    rating: 5,
    message:
      "They automated our patient appointment booking and WhatsApp notification workflows. It saved our clinic staff hours every day. Truly professional and reliable engineering from start to finish.",
    verified: true,
    status: "accepted",
    created_at: "2026-10-19T09:15:00.000Z",
  },
  {
    id: "seed-rev-4",
    name: "Vignesh Balaji",
    role_or_company: "Co-Founder, EduLaunch EdTech",
    email: "vignesh@edulaunch.tech",
    rating: 5,
    message:
      "Delivered our student learning portal ahead of schedule. The UI is modern, clean, and loved by our students and faculties. ZEXOVA is our go-to tech partner for all future software projects.",
    verified: true,
    status: "accepted",
    created_at: "2026-10-20T16:45:00.000Z",
  },
  {
    id: "seed-rev-5",
    name: "Kavitha Murugan",
    role_or_company: "Proprietor, Murugan Silver & Jewelry",
    email: "kavitha@muruganjewels.com",
    rating: 5,
    message:
      "Local SEO and website redesign brought so many local footfalls and inquiries to our store. Beautiful aesthetic that matches our luxury brand. Highly recommend them for growing any local business!",
    verified: true,
    status: "accepted",
    created_at: "2026-10-22T11:00:00.000Z",
  },
  {
    id: "seed-rev-6",
    name: "Manoj Kumar",
    role_or_company: "CEO, QuickHaul Logistics",
    email: "manoj@quickhaul.in",
    rating: 5,
    message:
      "From the initial consultation to final deployment, communication was crystal clear. The parcel tracking system they built runs flawlessly. Superb quality and dependable post-launch support.",
    verified: true,
    status: "accepted",
    created_at: "2026-10-23T15:30:00.000Z",
  },
];

export function calculateReviewStats(reviews: Review[]): ReviewStats {
  if (!reviews || !reviews.length) {
    return {
      averageRating: 5.0,
      totalCount: 0,
      verifiedCount: 0,
      recommendedPercent: 100,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const totalCount = reviews.length;
  const sumRating = reviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0);
  const rawAvg = sumRating / totalCount;
  const averageRating = Number.isInteger(rawAvg) ? Number(rawAvg.toFixed(1)) : Number(rawAvg.toFixed(1));
  const verifiedCount = reviews.filter((r) => r.verified).length;
  const positiveCount = reviews.filter((r) => Number(r.rating) >= 4).length;
  const recommendedPercent = Math.round((positiveCount / totalCount) * 100);

  const ratingDistribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const r of reviews) {
    const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
    ratingDistribution[star] = (ratingDistribution[star] || 0) + 1;
  }

  return {
    averageRating: isNaN(averageRating) ? 5.0 : averageRating,
    totalCount,
    verifiedCount,
    recommendedPercent: isNaN(recommendedPercent) ? 100 : recommendedPercent,
    ratingDistribution,
  };
}
