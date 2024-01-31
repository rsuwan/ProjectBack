import user from "../../../db/modle/User.modle.js";
import admin from "../../../db/modle/admin.modle.js";
import log from "../../../db/log.js";
import post from "../../../db/modle/post.modle.js";
import commentModle from "../../../db/modle/comment.modle.js";
import cloudinary from "../../services/cloudinary.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const viewMyPosts = async (req, res) => {
  // http://localhost:3000/userDo/alia@gmail.com/viewMyPosts
  try {
    const communityParams = req.params;
    const email = communityParams.email;
    const found = await user.findOne({ email: email });
    if (!found) {
      return res.status(404).send({ msg: "this user not founded" });
    }
    try {
      const posts = await post.find({ user_email: email }, {});
      if (!posts || posts.length === 0) {
        return res.status(404).send("this user did not posted");
      }
      let newArr = [];
      for (let i of posts) {
        console.log(i);
        let obj = {};
        const commentsNumber = await commentModle.countDocuments({
          post_id: i._id,
        });
        const personalImage = await user.findOne(
          { email: i.user_email },
          { image: 1, _id: 0 }
        );
        obj["post"] = i;
        obj["commentsNumber"] = commentsNumber;
        obj["personalImage"] = personalImage;
        newArr.push(obj);
      }

      return res.status(201).send(newArr);
    } catch (err) {
      return res.status(500).send("Error retrieving posts");
    }
  } catch (err) {
    return res.status(500).send({ msg: "Error retrieving properties" });
  }
};
export const viewMyComments = async (req, res) => {
  // http://localhost:3000/userDo/raghad@gmail.com/viewMyComments
  try {
    const communityParams = req.params;
    const email = communityParams.email;
    const found = await user.findOne({ email: email });
    if (!found) {
      return res.status(404).send({ msg: "this user not founded" });
    }
    try {
      const comments = await commentModle.find({ user_email: email }, {});
      if (!comments || comments.length === 0) {
        return res
          .status(404)
          .send({ msg: "this user deos not have a comment" });
      }
      let newArr = [];
      for (let i of comments) {
        console.log(i);
        let obj = {};
        const postD = await post.findOne({ _id: i.post_id }, {});
        console.log(postD);
        if (!postD) {
          return res
            .status(404)
            .send({ msg: "con not find the post for this comemnt" });
        }
        obj["comments"] = i;
        obj["post"] = postD;
        newArr.push(obj);
      }
      return res.status(201).send(newArr);
    } catch (err) {
      return res.status(500).send({ msg: "Error retrieving posts" });
    }
  } catch (err) {
    return res.status(500).send({ msg: "Error retrieving properties" });
  }
};
export const viewMyPersonalInformation = async (req, res) => {
  //http://localhost:3000/userDo/raghad@gmail.com/viewMyPersonalInformation
  const personalInfoParams = req.params;
  const email = personalInfoParams.email;
  try {
    const userData = await log.findOne({ email: email });
    if (!userData) {
      return res.status(404).send({ msg: "User Not Found" });
    }
    if (userData.role === "User") {
      const info = await user.findOne({ email: email });
      return res.status(200).send(info);
    }
    const info = await admin.findOne({ email: email });
    return res.status(200).send(info);
  } catch (error) {
    return res.status(404).send({ msg: "something error" });
  }
};
export const updateMyPersonalInformation = async (req, res) => {
  // http://localhost:3000/userDo/raghad@gmail.com/viewMyPersonalInformation    const personalInfoParams = req.params;
  const personalInfoParams = req.params;
  const { firstName, lastName, phone, birth_date, address } = req.body;
  const email = personalInfoParams.email;
  try {
    const userData = await log.findOne({ email: email });
    if (!userData) {
      return res.status(404).send({ msg: "User Not Found" });
    }
    console.log(userData);
    if (userData.role === "User") {
      console.log("sss");
      const info = await user.updateOne(
        {
          email: email,
        },
        {
          $set: {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            address: address,
            birth_date: birth_date,
          },
        }
      );
      return res.status(200).send(info);
    }
    const info = await admin.updateOne(
      {
        email: email,
      },
      {
        $set: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          address: address,
          birth_date: birth_date,
        },
      }
    );

    return res.status(200).send(info);
  } catch (error) {
    return res.status(500).send({ msg: "something error" });
  }
};
export const changePassword = async (req, res) => {
  //http://localhost:3000/userDo/raghad@gmail.com/changePassword
  const { password, newpassword } = req.body;
  const email = req.params.email;
  const found = await log.findOne({ email: email });
  if (!found) {
    return res.status(404).send({ msg: "this user not founded" });
  }

  try {
    const hashedPassword = await bcrypt.hash(
      newpassword,
      parseInt(process.env.SALT_ROUND)
    );
    await user.updateOne(
      { email: email },
      { $set: { password: hashedPassword } }
    );
    return res.status(200).send({ msg: "Password Changed Successfully" });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};
export const updateimage = async (req, res) => {
  const userimage = await user.findById(req.params.id);

  try {
    if (!userimage) {
      return res
        .status(404)
        .json({ message: `Community not found with id: ${req.params.id}` });
    }
    if (req.file) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        { folder: `${process.env.APP_NAME}/imageusers` }
      );
      await cloudinary.uploader.destroy(userimage.image.public_id);
      userimage.image = { secure_url, public_id };
    }
    await userimage.save();

    return res
      .status(200)
      .json({ message: "Community updated successfully", userimage });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const addImageUser = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming you are passing the user ID in the URL
    const existingUser = await user.findById(userId); // Use findById instead of findOne with email
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.APP_NAME}/posts`,
      }
    );
    existingUser.image = { secure_url, public_id };
    await existingUser.save();
    return res.status(201).json({ message: "Success", user: existingUser });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const addImageAdmin = async (req, res) => {
  const userEmail = req.params.email;
  const existingUser = await admin.findOne({ email: userEmail });
  try {
    if (!existingUser) {
      return res.status(404).json({ message: "Account not found" });
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.APP_NAME}/posts`,
      }
    );
    existingUser.image = { secure_url, public_id };
    await existingUser.save();
    return res.status(201).json({ message: "Success", user: existingUser });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
// export const likePost = asyncHandler(async (req, res, next) => {
//   const { id } = req.params; // post id
//   const user_id = req.user._id;

//   try {
//     const Post = await post.findByIdAndUpdate(
//       id,
//       {
//         $addToSet: { likes: user_id },
//         $pull: { unlikes: user_id },
//       },
//       { new: true }
//     );

//     return res.status(200).json({ message: "Post liked successfully", Post });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });
// export const unlikePost = asyncHandler(async (req, res, next) => {
//   const { id } = req.params; // post id
//   const user_id = req.user._id;

//   try {
//     const Post = await post.findByIdAndUpdate(
//       id,
//       {
//         $addToSet: { unlikes: user_id },
//         $pull: { likes: user_id },
//       },
//       { new: true }
//     );

//     return res.status(200).json({ message: "Post unliked successfully", Post });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });
