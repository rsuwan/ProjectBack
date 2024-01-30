import communityProperities from "../../../db/modle/communityProperties.modle.js";
import communities from "../../../db/modle/community.modle.js";
import post from "../../../db/modle/post.modle.js";
import user from "../../../db/modle/User.modle.js";
export const postView = async (req, res) => {
  try {
    const communityParams = req.params;
    const communityName = communityParams.community; // This should be a string
    const found = await communities.findOne({ community_name: communityName });
    if (!found) {
      return res.status(404).send({ msg: "Community not found" });
    }
    const properties = await communityProperities.find(
      { community_Name: communityName },
      { _id: 0, __v: 0 }
    );
    if (!properties) {
      return res.status(404).send({ msg: "No found community" });
    }
    if (properties.length === 0) {
      return res.status(404).send({ msg: "No properties found for community" });
    }
    return res.status(200).send(properties);
  } catch (err) {
    res.status(500).send({ msg: "Error retrieving properties" });
  }
};
export const createPost = async (req, res) => {
  try {
    const { community, id } = req.params;
    const foundCommunity = await communities.findOne({
      community_name: community,
    });
    const foundID = await user.findOne({ email: id });
    console.log(foundID);
    if (!foundCommunity) {
      return res.status(404).send({ msg: "Community not found" });
    }
    if (!foundID) {
      return res.status(404).send({ msg: "email not found" });
    }
    const { type, input } = req.body;
    console.log(input);
    const newPost = await post.create({
      user_email: id,
      user_name: foundID.firstName + " " + foundID.lastName,
      community_name: community,
      post_type: type,
      like: 0,
      properties: input,
    });
    newPost.save();
    return res.status(201).send({ msg: "created successfuly:)" });
  } catch (err) {
    return res.status(500).send({ msg: "Error retrieving properties" });
  }
};
export const viewPost = async (req, res) => {
  try {
    const communityParams = req.params;
    const communityName = communityParams.community;

    // Find the community
    const found = await communities.findOne({ community_name: communityName });
    console.log(found);
    if (!found) {
      return res.status(404).send({ msg: 'Community not found' });
    }

    // Find posts, sorted by date in descending order
    try {
      const posts = await post.find({ community_name: communityName })
        .sort({ createdAt: -1 }); // Sort by createdAt in descending order

      if (!posts || posts.length === 0) {
        return res.status(404).send('No posts found for community');
      }

      res.status(201).send(posts);
    } catch (err) {
      return res.status(500).send('Error retrieving posts');
    }
  } catch (err) {
    return res.status(500).send({ msg: 'Error retrieving properties' });
  }
};


// export const viewPosts = async (req, res) => {
//     try {
//         const communityParams = req.params;
//         const communityName = communityParams.community;
//         const found = await communities.findOne({ community_name: communityName });
//         if (!found) {
//             return res.status(404).send({ msg: 'Community not found' });
//         }
//         try {
//             const posts = await post.find({ community_name: communityName }, {});
//             if (!posts || posts.length === 0) {
//                 return res.status(404).send('No posts found for community');
//             }
//             return res.status(201).send(posts);
//         } catch (err) {
//             return res.status(500).send('Error retrieving posts');
//         }
//     } catch (err) {
//         return res.status(500).send({ msg: 'Error retrieving properties' });
//     }
// };
////////////////////////////////////////////////////////////////////////////////////
// export const createPosts = async (req, res) => {
//   try {
//     const { community, id } = req.params;
//     const foundCommunity = await communities.findOne({ community_name: community });
//     const foundID = await user.findOne({ email: id });

//     if (!foundCommunity) {
//       return res.status(404).send({ msg: 'Community not found' });
//     }

//     if (!foundID) {
//       return res.status(404).send({ msg: 'Email not found' });
//     }

//     const { type } = req.body;
//     const mainImage = req.files.mainImage[0]; // Assuming mainImage is a single image
//     const supImages = req.files.supImages || []; // Assuming supImages is an array of images

//     // Upload main image to Cloudinary
//     const mainImageResult = await cloudinary.uploader.upload(mainImage.path, {
//       folder: `${process.env.APP_NAME}/post`,
//     });

//     // Upload supplementary images to Cloudinary
//     const supImagesResults = await Promise.all(
//       supImages.map(async (supImage) => {
//         return cloudinary.uploader.upload(supImage.path, {
//           folder: `${process.env.APP_NAME}/post`,
//         });
//       })
//     );

//     // Create post with image URLs
//     const newPost = await post.create({
//       user_email: id,
//       community_name: community,
//       postType: type,
//       like: 0,
//       properties: {
//         mainImage: mainImageResult.secure_url,
//         supImages: supImagesResults.map((result) => result.secure_url),
//       },
//     });

//     newPost.save();
//     return res.status(201).send({ msg: "Created successfully :)", newPost });
//   } catch (err) {
//     console.error('Error:', err);
//     return res.status(500).send({ msg: 'Internal Server Error' });
//   }
// };
export const deletePost = async (req, res) => {
  try {
    const { community, id, postId } = req.params;

    const foundCommunity = await post.findOne({ community_name: community });
    const foundID = await user.findOne({ email: id });

    if (!foundCommunity) {
      return res.status(404).send({ msg: "Community not found" });
    }

    if (!foundID) {
      return res.status(404).send({ msg: "Email not found" });
    }

    const deletedPost = await post.findOneAndDelete({
      _id: postId,
      user_email: id,
      community_name: community,
    });

    if (!deletedPost) {
      return res.status(404).send({ msg: "Post not found" });
    }

    return res.status(200).send({ msg: "Post deleted successfully" });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).send({ msg: "Internal Server Error" });
  }
};
// export const addImages = async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const existingPost = await post.findById(postId);

//     if (!existingPost) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     // Check if files were uploaded
//     if (!req.files || Object.keys(req.files).length === 0) {
//       return res.status(400).json({ message: "No files uploaded" });
//     }

//     // Loop through uploaded files and update the post with the new images
//     req.files.supImages.forEach(async (file) => {
//       const { secure_url, public_id } = await cloudinary.uploader.upload(
//         file.path,
//         {
//           folder: `${process.env.APP_NAME}/posts`,
//         }
//       );

//       existingPost.supImages.push({ secure_url, public_id });
//     });

//     // Save the changes to the existing post
//     await existingPost.save();

//     return res.status(201).json({ message: "Success", post: existingPost });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };
