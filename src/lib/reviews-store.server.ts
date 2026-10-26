import fs from "node:fs";
import path from "node:path";
import { Review, SEED_REVIEWS } from "./reviews";

const DATA_DIR = path.resolve(process.cwd(), ".data");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readLocalReviews(): Review[] {
  try {
    ensureDir();
    if (!fs.existsSync(REVIEWS_FILE)) {
      // Seed with default verified reviews
      fs.writeFileSync(REVIEWS_FILE, JSON.stringify(SEED_REVIEWS, null, 2), "utf-8");
      return [...SEED_REVIEWS];
    }
    const raw = fs.readFileSync(REVIEWS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      fs.writeFileSync(REVIEWS_FILE, JSON.stringify(SEED_REVIEWS, null, 2), "utf-8");
      return [...SEED_REVIEWS];
    }
    return parsed;
  } catch (e) {
    console.warn("Could not read local reviews, falling back to seed:", e);
    return [...SEED_REVIEWS];
  }
}

export function saveLocalReview(review: Review): void {
  try {
    ensureDir();
    const list = readLocalReviews();
    const idx = list.findIndex((x) => x.id === review.id);
    if (idx >= 0) {
      list[idx] = review;
    } else {
      list.unshift(review);
    }
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.error("Could not save local review:", e);
  }
}

export function updateLocalReviewStatus(id: string, status: "accepted" | "declined" | "pending"): void {
  try {
    ensureDir();
    const list = readLocalReviews();
    const item = list.find((x) => x.id === id);
    if (item) {
      item.status = status;
      fs.writeFileSync(REVIEWS_FILE, JSON.stringify(list, null, 2), "utf-8");
    }
  } catch (e) {
    console.error("Could not update local review status:", e);
  }
}

export function toggleLocalReviewVerified(id: string, verified: boolean): void {
  try {
    ensureDir();
    const list = readLocalReviews();
    const item = list.find((x) => x.id === id);
    if (item) {
      item.verified = verified;
      fs.writeFileSync(REVIEWS_FILE, JSON.stringify(list, null, 2), "utf-8");
    }
  } catch (e) {
    console.error("Could not toggle local review verified status:", e);
  }
}

export function deleteLocalReview(id: string): void {
  try {
    ensureDir();
    const list = readLocalReviews().filter((x) => x.id !== id);
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.error("Could not delete local review:", e);
  }
}
