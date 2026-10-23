import fs from "node:fs";
import path from "node:path";

export interface StoredInquiry {
  id: string;
  kind: "contact" | "quote";
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service?: string | null;
  budget?: string | null;
  timeline?: string | null;
  message: string;
  status: string;
  created_at: string;
}

export interface StoredNote {
  id: string;
  inquiry_id: string;
  kind: string;
  body: string;
  created_at: string;
}

const DATA_DIR = path.resolve(process.cwd(), ".data");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");
const NOTES_FILE = path.join(DATA_DIR, "inquiry-notes.json");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readLocalInquiries(): StoredInquiry[] {
  try {
    ensureDir();
    if (!fs.existsSync(INQUIRIES_FILE)) return [];
    const raw = fs.readFileSync(INQUIRIES_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Could not read local inquiries:", e);
    return [];
  }
}

export function saveLocalInquiry(item: StoredInquiry): void {
  try {
    ensureDir();
    const list = readLocalInquiries();
    const idx = list.findIndex((x) => x.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.error("Could not save local inquiry:", e);
  }
}

export function updateLocalInquiryStatus(id: string, status: string): void {
  try {
    const list = readLocalInquiries();
    const item = list.find((x) => x.id === id);
    if (item) {
      item.status = status;
      fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(list, null, 2), "utf-8");
    }
  } catch (e) {
    console.error("Could not update local inquiry status:", e);
  }
}

export function deleteLocalInquiry(id: string): void {
  try {
    const list = readLocalInquiries().filter((x) => x.id !== id);
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.error("Could not delete local inquiry:", e);
  }
}

export function readLocalNotes(inquiryId: string): StoredNote[] {
  try {
    ensureDir();
    if (!fs.existsSync(NOTES_FILE)) return [];
    const list: StoredNote[] = JSON.parse(fs.readFileSync(NOTES_FILE, "utf-8"));
    return list.filter((n) => n.inquiry_id === inquiryId);
  } catch {
    return [];
  }
}

export function saveLocalNote(note: StoredNote): void {
  try {
    ensureDir();
    const list: StoredNote[] = fs.existsSync(NOTES_FILE)
      ? JSON.parse(fs.readFileSync(NOTES_FILE, "utf-8"))
      : [];
    list.unshift(note);
    fs.writeFileSync(NOTES_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (e) {
    console.error("Could not save local note:", e);
  }
}
