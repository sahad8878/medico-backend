const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const departmentSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      trim: true
    },
    doctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctors",
      },
    ],
    departmentImg: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
departmentSchema.plugin(mongoosePaginate);

const departmentModel = mongoose.model("departments", departmentSchema);
module.exports = departmentModel;
