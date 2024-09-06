import sharp from "sharp";
import cloudinary from "../helpers/cloudinary.js";
import { Thought } from "../schema/thoughtsSchema.js";
import { Discussion } from "../schema/discussionSchema.js";
import { Carer } from "../schema/userSchema.js";
import { getReceiverSocketId, io } from "../socketConfig/socketConnection.js";

const uploadImage = async (imageBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "your_folder_name" // Optional: specify a folder in Cloudinary
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    sharp(imageBuffer)
      .resize({ width: 800, height: 800, fit: 'inside' })
      .jpeg({ quality: 80 })
      .toBuffer()
      .then((buffer) => {
        uploadStream.end(buffer);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const createNewThought = async (req, res) => {
  try {
    const { thought } = req.body;
    const image = req.file;
    const carerId = req.id;

    if (!thought) {
      return res.status(400).json({
        message: "Thought required",
        success: false,
      });
    }

    let cloudinaryResponseURL = "";

    if (image) {
      const imageBuffer = await sharp(image.buffer)
        .resize({ width: 800, height: 800, fit: "inside" })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer();

      const imageUri = `data: image/jpeg;base64, ${imageBuffer.toString(
        "base64"
      )}`;

      let cloudinaryResponse = null;
      try {
        cloudinaryResponse = await uploadImage(image.buffer);
        cloudinaryResponseURL = cloudinaryResponse.secure_url;
        console.log("Upload successful:", cloudinaryResponse);
      } catch (error) {
        console.error("Upload error:", error);
      }
    }

    const newThought = await Thought.create({
      thought: thought,
      image: cloudinaryResponseURL,
      carer: carerId,
    });

    const carer = await Carer.findById(carerId);
    if (carer) {
      carer.thoughts.push(newThought._id);
      await carer.save();
    }

    await newThought.populate({ path: "carer", select: "-password" });

    
    return res.status(201).json({
      message: "New thought created!",
      thought: newThought,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllThoughts = async (req, res) => {
  try {
    const thoughts = await Thought.find()
      .sort({ createdAt: -1 })
      .populate({ path: "carer", select: "userName userDp" })
      .populate({
        path: "discussions",
        sort: { createdAt: -1 },
        populate: {
          path: "carer",
          select: "userName userDp",
        },
      });
    return res.status(200).json({
      thoughts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCarerThought = async (req, res) => {
  try {
    const carerId = req.id;
    const thoughts = await Thought.find({ carer: carerId })
      .sort({ createdAt: -1 })
      .populate({
        path: "carer",
        select: "userName, userDp",
      })
      .populate({
        path: "discussions",
        sort: { createdAt: -1 },
        populate: {
          path: "carer",
          select: "userName, userDp",
        },
      });
    return res.status(200).json({
      thoughts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const appreciateThought = async (req, res) => {
  try {
    const appreciatingCarerId = req.id;
    const thoughtId = req.params.id;
    const thought = await Thought.findById(thoughtId);
    if (!thought)
      return res
        .status(404)
        .json({ message: "Thought not found", success: false });

    // like logic started
    await thought.updateOne({
      $addToSet: { appreciations: appreciatingCarerId },
    });
    await thought.save();

    // implement socket io for real time notification
    const carer = await Carer.findById(appreciatingCarerId).select(
      "userName userDp"
    );

    const thoughtPosterId = thought.carer.toString();
   
    if (thoughtPosterId !== appreciatingCarerId) {
      // emit a notification event
      const notification = {
        type: "appreciate",
        userId: appreciatingCarerId,
        carerDetails: carer,
        thoughtId,
        message: "Your thought was appreciated",
      };

      const thoughtPosterSocketId = getReceiverSocketId(thoughtPosterId);
      io.to(thoughtPosterSocketId).emit("notification", notification);
    }

    return res
      .status(200)
      .json({ message: "Thought appreciated!", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const unAppreciateThought = async (req, res) => {
  try {
    const unAppreciatingCarerId = req.id;
    const thoughtId = req.params.id;
    const thought = await Thought.findById(thoughtId);

    if (!thought)
      return res
        .status(404)
        .json({ message: "Thought not found", success: false });

    // like logic started
    await thought.updateOne({
      $pull: { appreciations: unAppreciatingCarerId },
    });
    await thought.save();

    // implement socket io for real time notification
    const carer = await Carer.findById(unAppreciatingCarerId).select(
      "userName userDp"
    );
    const thoughtPosterId = thought.carer.toString();
    if (thoughtPosterId !== unAppreciatingCarerId) {
      // emit a notification event
      const notification = {
        type: "unAppreciate",
        carerId: unAppreciatingCarerId,
        carerDetails: carer,
        thoughtId,
        message: "Your post was unappreciated",
      };

      const thoughtPosterIdSocketId = getReceiverSocketId(thoughtPosterId);
      io.to(thoughtPosterIdSocketId).emit("notification", notification);
    }
    return res
      .status(200)
      .json({ message: "Thought unappreciated", success: true });
  } catch (error) {}
};

export const addDiscussion = async (req, res) => {
  try {
    const thoughtId = req.params.id;
    const discussedCarerId = req.id;

    const { text } = req.body;

    const thought = await Thought.findById(thoughtId);

    if (!text)
      return res
        .status(400)
        .json({ message: "Text is required", success: false });

    const discussion = await Discussion.create({
      text,
      carer: discussedCarerId,
      thought: thoughtId,
    });

    await discussion.populate({
      path: "carer",
      select: "userName userDp",
    });

    thought.discussions.push(discussion._id);
    await thought.save();

    return res.status(201).json({
      message: "Discussion started",
      discussion,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getDiscussionsOfThought = async (req, res) => {
  try {
    const thoughtId = req.params.id;

    const discussions = await Discussion.find({ thought: thoughtId }).populate(
      "carer",
      "userName userDp"
    );

    if (!discussions)
      return res
        .status(404)
        .json({
          message: "There has been no discussions yet for this thought",
          success: false,
        });

    return res.status(200).json({ success: true, discussions });
  } catch (error) {
    console.log(error);
  }
};

export const deleteThought = async (req, res) => {
  try {
    const thoughtId = req.params.id;
    const carerId = req.id;

    const thought = await Thought.findById(thoughtId);
    if (!thought)
      return res
        .status(404)
        .json({ message: "Thought not found", success: false });

    // check if the logged-in user is the owner of the post
    if (thought.carer.toString() !== carerId)
      return res
        .status(403)
        .json({ message: "You do not have permission to do this" });

    // delete post
    await Thought.findByIdAndDelete(thoughtId);

    // remove the post id from the user's post
    let carer = await Carer.findById(carerId);
    carer.thoughts = carer.thoughts.filter((id) => id.toString() !== thoughtId);
    await carer.save();

    await Discussion.deleteMany({ thought: thoughtId });

    return res.status(200).json({
      success: true,
      message: "Thought deleted",
    });
  } catch (error) {
    console.log(error);
  }
};

export const bookmarkThought = async (req, res) => {
  try {
    const thoughtId = req.params.id;
    const carerId = req.id;
    const thought = await Thought.findById(thoughtId);
    if (!thought)
      return res
        .status(404)
        .json({ message: "Thought not found", success: false });

    const carer = await Carer.findById(carerId);
    if (carer.bookmarks.includes(thought._id)) {
      // already bookmarked -> remove from the bookmark
      await carer.updateOne({ $pull: { bookmarks: thought._id } });
      await carer.save();
      return res
        .status(200)
        .json({ type: "unsaved", message: "Bookmark removed", success: true });
    } else {
      await carer.updateOne({ $addToSet: { bookmarks: thought._id } });
      await carer.save();
      return res
        .status(200)
        .json({ type: "saved", message: "Thought bookmarked", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};

// Report a thought
export const reportThought = async (req, res) => {
  try {
    const carerId = req.body.carerId;
    const thoughtId = req.params.id;
    const thought = await Thought.findById(thoughtId);

    if (!thought) {
      return res.status(404).json({ message: "Thought not found", success: false });
    }

    if (thought.reports.includes(carerId)) {
      return res.status(400).json({ message: "You have already reported this thought", success: false });
    }

    // Add the user to the reports array
    thought.reports.push(carerId);

    // Flag the post if reports exceed 5
    if (thought.reports.length > 5) {
      thought.flagged = true;
      thought.thought = "This post has been reported and is under review.";
    }

    await thought.save();
    return res.status(200).json({ message: "Thought reported", success: true, thought });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

