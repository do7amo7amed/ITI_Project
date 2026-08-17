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