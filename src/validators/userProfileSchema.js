//src/validators/userProfileSchema.js

const { z } = require("zod");

const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).trim().optional(),
  university: z.string().trim().optional(),
  department: z.string().trim().optional(),
  academicLevel: z.number().int().min(1).max(4).optional(),
  profileInformation: z
    .object({
      bio: z.string().optional(),
    })
    .optional(),
});

module.exports = {
  updateProfileSchema,
};
