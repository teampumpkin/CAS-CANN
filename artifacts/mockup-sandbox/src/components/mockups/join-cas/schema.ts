import { z } from "zod";

export const casRegistrationSchema = z.object({
  wantsMembership: z.enum(["Yes", "No"], {
    required_error: "Please select whether you want to become a CAS member",
  }),
  wantsCANNMembership: z.enum(["Yes", "No"], {
    required_error: "Please select whether you want to join CANN",
  }),
  fullName: z.string().optional(),
  email: z.string().optional(),
  discipline: z.string().optional(),
  subspecialty: z.string().optional(),
  amyloidosisType: z.enum(["ATTR", "AL", "Both ATTR and AL", "Other"]).optional(),
  institution: z.string().optional(),
  wantsServicesMapInclusion: z.enum(["Yes", "No"]).optional(),
  centerName: z.string().optional(),
  centerAddress: z.string().optional(),
  centerPhone: z.string().optional(),
  centerFax: z.string().optional(),
  wantsCommunications: z.enum(["Yes", "No"]).optional(),
  cannCommunications: z.enum(["Yes", "No"]).optional(),
  noMemberName: z.string().optional(),
  noMemberEmail: z.string().optional(),
  noMemberMessage: z.string().optional(),
}).superRefine((data, ctx) => {
  const isMember = data.wantsMembership === "Yes" || data.wantsCANNMembership === "Yes";

  if (isMember) {
    if (!data.fullName || data.fullName.trim().length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Full name is required", path: ["fullName"] });
    }
    if (!data.email || data.email.trim().length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Email address is required", path: ["email"] });
    } else if (!z.string().email().safeParse(data.email).success) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please enter a valid email address", path: ["email"] });
    }
    if (!data.discipline || data.discipline.trim().length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Discipline is required", path: ["discipline"] });
    }
    if (!data.subspecialty || data.subspecialty.trim().length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Sub-specialty area is required", path: ["subspecialty"] });
    }
    if (!data.amyloidosisType) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select the type of amyloidosis patients you care for", path: ["amyloidosisType"] });
    }
    if (!data.institution || data.institution.trim().length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Centre or Clinic Name/Institution is required", path: ["institution"] });
    }
    if (!data.wantsCommunications) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select whether you want to receive communications", path: ["wantsCommunications"] });
    }
  }

  if (data.wantsCANNMembership === "Yes") {
    if (!data.cannCommunications) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please select whether you want to receive CANN communications", path: ["cannCommunications"] });
    }
  }

  if (!isMember) {
    if (!data.noMemberName || data.noMemberName.trim().length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Name is required", path: ["noMemberName"] });
    }
    if (!data.noMemberEmail || data.noMemberEmail.trim().length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Email is required", path: ["noMemberEmail"] });
    } else if (!z.string().email().safeParse(data.noMemberEmail).success) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please enter a valid email address", path: ["noMemberEmail"] });
    }
  }
});

export type CASRegistrationForm = z.infer<typeof casRegistrationSchema>;
