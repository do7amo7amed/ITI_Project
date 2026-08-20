const { z } = require("zod");

//Defined allowed values
const resourceTypes = [
   "lecture",
   "sheet",
   "lab",
   "assignment",
   "previous_exam",
   "summary",
   "tutorial",
   "reference",
 ];

const sourceTypes = ["pdf", "youtube", "link"];
 //youtube link validation
const isYouTubeUrl = (url) => {
   try {
     const parsedUrl = new URL(url);

     return (
       parsedUrl.hostname === "youtube.com" ||
       parsedUrl.hostname === "www.youtube.com" );
   } catch {
     return false;
   }
 };

 //Schema
const resourceSchema = z.object({
   title: z
     .string()
     .trim()
     .min(1, "Title is required"),

   description: z
     .string()
     .trim()
     .optional(),

   type: z.enum(resourceTypes),

   sourceType: z.enum(sourceTypes),

   course: z
     .string()
     .min(1, "Course is required"),

   externalUrl: z
     .string()
     .url("Invalid URL")
     .optional(),
 });

const createResourceSchema = resourceSchema.superRefine(
  (data, ctx) => {

    // Lecture : PDF OR YouTube
    if (data.type === "lecture") {
      if (
        data.sourceType !== "pdf" &&
        data.sourceType !== "youtube"
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sourceType"],
          message: "Lecture must be a PDF or YouTube resource",
        });
      }
    }

    // Tutorial : YouTube only
    if (data.type === "tutorial") {
      if (data.sourceType !== "youtube") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sourceType"],
          message: "Tutorial must be a YouTube resource",
        });
      }
    }

    // Other : PDF
        if (
          [
            "sheet",
            "lab",
            "assignment",
            "previous_exam",
            "summary",
          ].includes(data.type)
        ) {
          if (data.sourceType !== "pdf") {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["sourceType"],
              message: `${data.type} must be a PDF resource`,
            });
          }
        }

        // Reference : external link
        if (data.type === "reference") {
          if (data.sourceType !== "link") {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["sourceType"],
              message: "Reference must be an external link",
            });
          }
        }
    // YouTube URL validation
    if (data.sourceType === "youtube") {
      if (
        !data.externalUrl ||
        !isYouTubeUrl(data.externalUrl)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["externalUrl"],
          message: "A valid YouTube URL is required",
        });
      }
    }

    // External link validation
    if (data.sourceType === "link") {
      if (!data.externalUrl) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["externalUrl"],
          message: "External URL is required",
        });
      }
    }
  }
);

const updateResourceSchema = resourceSchema.partial()
  .superRefine((data, ctx) => {

   // YouTube URL validation
      if (data.sourceType === "youtube") {
        if (
          !data.externalUrl ||
          !isYouTubeUrl(data.externalUrl)
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["externalUrl"],
            message: "A valid YouTube URL is required",
          });
        }
      }

      // External link validation
      if (data.sourceType === "link") {
        if (!data.externalUrl) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["externalUrl"],
            message: "External URL is required",
          });
        }
      }

    // If type is provided, sourceType must also be provided
    if (data.type && !data.sourceType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sourceType"],
        message: "sourceType is required when updating type",
      });
    }

    // If sourceType is provided, type must also be provided
    if (data.sourceType && !data.type) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["type"],
        message: "type is required when updating sourceType",
      });
    }

    // Validate type + sourceType combination
    if (data.type && data.sourceType) {

      // Lecture → PDF OR YouTube
      if (
        data.type === "lecture" &&
        data.sourceType !== "pdf" &&
        data.sourceType !== "youtube"
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sourceType"],
          message: "Lecture must be a PDF or YouTube resource",
        });
      }

      // Tutorial → YouTube only
      if (
        data.type === "tutorial" &&
        data.sourceType !== "youtube"
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sourceType"],
          message: "Tutorial must be a YouTube resource",
        });
      }

      // These types → PDF only
      if (
        [
          "sheet",
          "lab",
          "assignment",
          "previous_exam",
          "summary",
        ].includes(data.type) &&
        data.sourceType !== "pdf"
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sourceType"],
          message: `${data.type} must be a PDF resource`,
        });
      }

      // Reference → Link only
      if (
        data.type === "reference" &&
        data.sourceType !== "link"
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sourceType"],
          message: "Reference must be an external link",
        });
      }
    }


  });
module.exports = {createResourceSchema,updateResourceSchema,resourceTypes, sourceTypes};