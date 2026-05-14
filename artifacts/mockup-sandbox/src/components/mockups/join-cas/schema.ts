import { z } from "zod";

export const casRegistrationSchema = z.object({
  wantsMembership: z.enum(["Yes", "No"], {
    required_error: "Please select whether you want to become a CAS member",
  }),
  wantsCANNMembership: z.enum(["Yes", "No"], {
    required_error: "Please select whether you want to join CANN",
  }),

  // Profile
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  primaryEmail: z.string().optional(),
  secondaryEmail: z.string().optional(),
  discipline: z.string().optional(),
  subspecialty: z.string().optional(),
  amyloidosisType: z.enum(["ATTR", "AL", "Both ATTR and AL", "Other"]).optional(),
  institution: z.string().optional(),

  // Services Map
  wantsServicesMapInclusion: z.enum(["Yes", "No"]).optional(),
  streetName: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  phoneCode: z.string().optional(),
  phoneNumber: z.string().optional(),
  faxCode: z.string().optional(),
  faxNumber: z.string().optional(),
  // legacy combined fields (kept for back-compat with Current.tsx)
  phone: z.string().optional(),
  fax: z.string().optional(),

  // Communications
  wantsCommunications: z.enum(["Yes", "No"]).optional(),
  cannCommunications: z.enum(["Yes", "No"]).optional(),

  // Non-member
  noMemberName: z.string().optional(),
  noMemberEmail: z.string().optional(),
  noMemberMessage: z.string().optional(),

  // Legacy fields (kept for the baseline Current.tsx mockup — do not use in Redesigned)
  fullName: z.string().optional(),
  email: z.string().optional(),
  centerName: z.string().optional(),
  centerAddress: z.string().optional(),
  centerPhone: z.string().optional(),
  centerFax: z.string().optional(),
}).superRefine((data, ctx) => {
  const isMember = data.wantsMembership === "Yes" || data.wantsCANNMembership === "Yes";

  if (isMember) {
    if (!data.firstName?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "First name is required", path: ["firstName"] });
    if (!data.lastName?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Last name is required", path: ["lastName"] });
    if (!data.primaryEmail?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Primary email is required", path: ["primaryEmail"] });
    } else if (!z.string().email().safeParse(data.primaryEmail).success) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please enter a valid email address", path: ["primaryEmail"] });
    }
    if (data.secondaryEmail && data.secondaryEmail.trim() && !z.string().email().safeParse(data.secondaryEmail).success) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please enter a valid email address", path: ["secondaryEmail"] });
    }
    if (!data.discipline?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Professional designation is required", path: ["discipline"] });
    if (!data.subspecialty?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Sub-specialty area is required", path: ["subspecialty"] });
    if (!data.amyloidosisType) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select the type of amyloidosis patients you care for", path: ["amyloidosisType"] });
    if (!data.institution?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Clinic or Centre Name/Institution is required", path: ["institution"] });
    if (!data.wantsServicesMapInclusion) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please indicate map services preference", path: ["wantsServicesMapInclusion"] });
    if (!data.wantsCommunications) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select whether you want to receive communications", path: ["wantsCommunications"] });
  }

  if (data.wantsServicesMapInclusion === "Yes") {
    if (!data.streetName?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Street name is required", path: ["streetName"] });
    if (!data.postalCode?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Postal code is required", path: ["postalCode"] });
    if (!data.phoneNumber?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Phone number is required", path: ["phoneNumber"] });
  }

  if (data.wantsCANNMembership === "Yes") {
    if (!data.cannCommunications) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select whether you want to receive CANN communications", path: ["cannCommunications"] });
    }
  }

  if (!isMember) {
    if (!data.noMemberName?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Name is required", path: ["noMemberName"] });
    if (!data.noMemberEmail?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Email is required", path: ["noMemberEmail"] });
    } else if (!z.string().email().safeParse(data.noMemberEmail).success) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please enter a valid email address", path: ["noMemberEmail"] });
    }
  }
});

export type CASRegistrationForm = z.infer<typeof casRegistrationSchema>;

// Lightweight Canadian postal code → city/province lookup (mockup demo only).
// Real implementation would call a postal code API.
const POSTAL_PREFIX_MAP: Record<string, { city: string; province: string }> = {
  M: { city: "Toronto", province: "Ontario" },
  K: { city: "Ottawa", province: "Ontario" },
  L: { city: "Mississauga", province: "Ontario" },
  N: { city: "London", province: "Ontario" },
  H: { city: "Montreal", province: "Quebec" },
  J: { city: "Laval", province: "Quebec" },
  G: { city: "Quebec City", province: "Quebec" },
  V: { city: "Vancouver", province: "British Columbia" },
  T: { city: "Calgary", province: "Alberta" },
  R: { city: "Winnipeg", province: "Manitoba" },
  S: { city: "Saskatoon", province: "Saskatchewan" },
  B: { city: "Halifax", province: "Nova Scotia" },
  E: { city: "Fredericton", province: "New Brunswick" },
  A: { city: "St. John's", province: "Newfoundland and Labrador" },
  C: { city: "Charlottetown", province: "Prince Edward Island" },
  X: { city: "Yellowknife", province: "Northwest Territories" },
  Y: { city: "Whitehorse", province: "Yukon" },
};

export function lookupPostalCode(postalCode: string): { city: string; province: string } | null {
  const clean = postalCode.trim().toUpperCase();
  if (clean.length < 1) return null;
  const prefix = clean[0];
  return POSTAL_PREFIX_MAP[prefix] || null;
}
