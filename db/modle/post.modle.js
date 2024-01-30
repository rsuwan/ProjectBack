import mongoose, { Schema, model } from "mongoose";
const PostSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: [true, "Uer email is required"],
  },
  user_name: {
    type: String,
    required: [true, "Uer email is required"],
  },
  community_name: {
    type: String,
    required: [true, "Community name is required"],
  },
  like: {
    type: Number,
    required: true,
    default: 0,
  },
  post_type:{
    type: String,
    enum: ['owner', 'costomer'],
    required: [true, "type is required"],
  },
  supImages: [
    {
      type: Object,
      // required: [true, "sup Images is required"],
    },
  ],
    properties: [{
      type: Object,
    }],

});

const postModel = mongoose.models.Post || model("Post", PostSchema);
export default postModel;