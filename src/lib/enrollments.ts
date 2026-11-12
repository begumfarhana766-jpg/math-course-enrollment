import { z } from "zod";

export const CLASS_OPTIONS = ["10", "12"] as const;
export const BOARD_OPTIONS = ["CBSE", "ICSE / ISC", "State Board"] as const;
export const BATCH_OPTIONS = ["Morning (7–9 AM)", "Evening (5–7 PM)", "Weekend"] as const;

export const enrollmentSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter the student's full name").max(80),
  email: z.string().trim().email("Enter a valid email").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{10,15}$/, "Enter a valid phone number (10–15 digits)"),
  studentClass: z.enum(CLASS_OPTIONS, { errorMap: () => ({ message: "Choose Class 10 or 12" }) }),
  board: z.enum(BOARD_OPTIONS, { errorMap: () => ({ message: "Choose a board" }) }),
  school: z.string().trim().min(2, "Enter the school name").max(120),
  guardianName: z.string().trim().min(2, "Enter a parent / guardian name").max(80),
  batch: z.enum(BATCH_OPTIONS, { errorMap: () => ({ message: "Choose a batch" }) }),
  notes: z.string().trim().max(500, "Keep notes under 500 characters").optional().default(""),
});

export type EnrollmentInput = z.infer<typeof enrollmentSchema>;
export type Enrollment = EnrollmentInput & { id: string; submittedAt: string };

const STORAGE_KEY = "math-enrollments-v1";
const SESSION_KEY = "math-enrollments-session";

export function loadEnrollments(): Enrollment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Enrollment[]) : [];
  } catch {
    return [];
  }
}

function saveAll(list: Enrollment[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function makeEnrollmentId(studentClass: string, existingCount: number) {
  return `MATH${studentClass}-${String(existingCount + 1).padStart(4, "0")}`;
}

export function addEnrollment(input: EnrollmentInput): Enrollment {
  const list = loadEnrollments();
  const sameClass = list.filter((e) => e.studentClass === input.studentClass).length;
  const entry: Enrollment = {
    ...input,
    id: makeEnrollmentId(input.studentClass, sameClass),
    submittedAt: new Date().toISOString(),
  };
  saveAll([entry, ...list]);
  return entry;
}

export function deleteEnrollment(id: string) {
  saveAll(loadEnrollments().filter((e) => e.id !== id));
}

export function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(SESSION_KEY) === "1";
}
export function logIn() {
  window.localStorage.setItem(SESSION_KEY, "1");
}
export function logOut() {
  window.localStorage.removeItem(SESSION_KEY);
}
