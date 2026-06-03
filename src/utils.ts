/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AcademicYear = "20-21" | "21-22" | "22-23" | "23-24" | "24-25" | "25-26";

export interface FacultyStats {
  FQI: number;
  retention: {
    FR: number;
  };
  X: number; // Ph.D. Faculty count
  Y: number; // Masters Faculty count
}

export const HISTORICAL_DATA: Record<AcademicYear, FacultyStats> = {
  "20-21": {
    FQI: 6.20,
    retention: { FR: 7.50 },
    X: 4,
    Y: 10,
  },
  "21-22": {
    FQI: 6.50,
    retention: { FR: 7.80 },
    X: 5,
    Y: 12,
  },
  "22-23": {
    FQI: 6.90,
    retention: { FR: 8.20 },
    X: 6,
    Y: 13,
  },
  "23-24": {
    FQI: 7.40,
    retention: { FR: 8.50 },
    X: 7,
    Y: 15,
  },
  "24-25": {
    FQI: 8.00,
    retention: { FR: 9.00 },
    X: 9,
    Y: 18,
  },
  "25-26": {
    FQI: 8.50,
    retention: { FR: 9.60 },
    X: 10,
    Y: 20,
  }
};

export const ALL_ACADEMIC_YEARS: AcademicYear[] = ["20-21", "21-22", "22-23", "23-24", "24-25", "25-26"];
