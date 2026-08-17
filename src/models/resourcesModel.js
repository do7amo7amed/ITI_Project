const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, //removes unnecessary spaces around the title.
    },

    description: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "lecture",
        "sheet",
        "lab",
        "assignment",
        "previous_exam",
        "summary",
        "tutorial",
        "reference",
      ],
      required: true,
    },

    sourceType: {
      type: String,
      enum: ["pdf", "youtube", "link"],
      required: true,
    },

    fileUrl: {
      type: String,
    },

    externalUrl: {
      type: String,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resource", resourceSchema);