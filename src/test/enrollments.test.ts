import { describe, expect, it } from "vitest";
import { enrollmentSchema, makeEnrollmentId } from "@/lib/enrollments";

const valid = {
  fullName: "Ananya Sharma",
  email: "ananya@example.com",
  phone: "9876543210",
  studentClass: "10",
  board: "CBSE",
  school: "DPS",
  guardianName: "Ravi Sharma",
  batch: "Weekend",
  notes: "",
};

describe("enrollment rules", () => {
  it("accepts Class 10 and Class 12", () => {
    expect(enrollmentSchema.safeParse(valid).success).toBe(true);
    expect(enrollmentSchema.safeParse({ ...valid, studentClass: "12" }).success).toBe(true);
  });

  it("rejects any class other than 10 or 12", () => {
    expect(enrollmentSchema.safeParse({ ...valid, studentClass: "11" }).success).toBe(false);
  });

  it("numbers enrollment IDs per class", () => {
    expect(makeEnrollmentId("12", 4)).toBe("MATH12-0005");
  });
});
