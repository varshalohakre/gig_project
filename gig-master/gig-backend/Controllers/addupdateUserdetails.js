import User from "../Model/userSchema.js";
import Profile from "../Model/profileSchema.js";
import mongoose from "mongoose";
import path from "path";
import { v2 as cloudinary, v2 } from "cloudinary";
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Delete user document
    await User.findByIdAndDelete(userId);

    // Delete user's profile
    await Profile.findOneAndDelete({ user: userId });

    res.status(200).json({ message: "User and profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updates = req.body;

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true, // Return the updated document
    });

    // Update user's profile
    if (updatedUser) {
      const profile = await Profile.findOne({ user: userId });
      if (profile) {
        // Update profile if it exists
        profile.category = updates.category || profile.category;
        profile.description = updates.description || profile.description;
        profile.portfolio = updates.portfolio || profile.portfolio;
        profile.pricing = updates.pricing || profile.pricing;
        profile.location = updates.location || profile.location;
        await profile.save();
      } else {
        // Create new profile if it doesn't exist
        await Profile.create({
          user: userId,
          category: updates.category,
          description: updates.description,
          portfolio: updates.portfolio,
          pricing: updates.pricing,
          location: updates.location,
        });
      }
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find user details
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find profile details
    const profile = await Profile.findOne({ user: userId });

    // Combine user and profile details
    const userDetails = {
      _id: user._id,
      email: user.email,
      mobileNumber: user.mobileNumber,
      name: user.name,
      roles: user.roles,
      profile: profile || null, // Return profile or null if not found
    };

    res.status(200).json(userDetails);
  } catch (error) {
    console.error("Error getting user details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllTalentArtists = async (req, res) => {
  try {
    // Find users with "talent_artist" role
    const users = await User.find({ roles: { $in: ["talent_artist"] } });

    // If no users found, return empty array
    if (!users || users.length === 0) {
      return res.status(200).json([]);
    }

    // Get profile details for each user
    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        try {
          if (!mongoose.Types.ObjectId.isValid(user._id)) return false;
          const profile = await Profile.findOne({ user: user._id });
          const distribution = profile?.ratings?.reduce((acc, rating) => {
            acc[rating.rating] = (acc[rating.rating] || 0) + 1;
            return acc;
          }, {});
          const totalRatings = Object.values(distribution)?.reduce(
            (sum, count) => sum + count,
            0
          );
          const totalScore = Object.entries(distribution)?.reduce(
            (sum, [rating, count]) => sum + rating * count,
            0
          );
          const avgRating = totalRatings
            ? (totalScore / totalRatings).toFixed(1)
            : 0;
          return {
            _id: user._id,
            email: user.email,
            name: user.name,
            roles: user.roles,
            profileImage: profile.profileImage || null,
            avgRating: avgRating,
            category: profile.category, // Return profile or null if not found
          };
        } catch (profileError) {
          console.error("Error getting profile:", profileError);
          return {
            _id: user._id,
            email: user.email,
            name: user.name,
            roles: user.roles,
            profileImage: null,
            avgRating: 0,
            category: [],
          };
        }
      })
    );

    res.status(200).json(usersWithProfiles);
  } catch (error) {
    console.error("Error getting talent artists:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getTopTalentArtists = async (req, res) => {
  try {
    // Find users with "talent_artist" role
    const users = await User.find({ roles: { $in: ["talent_artist"] } });

    // If no users found, return empty array
    if (!users || users.length === 0) {
      return res.status(200).json([]);
    }

    // Get profile details and compute average rating for each user
    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        try {
          if (!mongoose.Types.ObjectId.isValid(user._id)) return false;
          const profile = await Profile.findOne({ user: user._id });
          const distribution = profile?.ratings?.reduce((acc, rating) => {
            acc[rating.rating] = (acc[rating.rating] || 0) + 1;
            return acc;
          }, {});
          const totalRatings = Object.values(distribution)?.reduce(
            (sum, count) => sum + count,
            0
          );
          const totalScore = Object.entries(distribution)?.reduce(
            (sum, [rating, count]) => sum + rating * count,
            0
          );
          const avgRating = totalRatings
            ? (totalScore / totalRatings).toFixed(1)
            : 0;
          return {
            _id: user._id,
            email: user.email,
            name: user.name,
            roles: user.roles,
            profileImage: profile.profileImage || null,
            avgRating: parseFloat(avgRating),
            category: profile.category || [], // Return profile category or empty array if not found
          };
        } catch (profileError) {
          console.error("Error getting profile:", profileError);
          return {
            _id: user._id,
            email: user.email,
            name: user.name,
            roles: user.roles,
            profileImage: null,
            avgRating: 0,
            category: [],
          };
        }
      })
    );

    // Filter out any invalid users (those that returned false)
    const validUsers = usersWithProfiles.filter((user) => user);

    // Sort users by average rating in descending order and take the top 4
    const topArtists = validUsers
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 4);

    res.status(200).json(topArtists);
  } catch (error) {
    console.error("Error getting top talent artists:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const uploadProfilePhoto = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming you have a userId parameter in the route
    const profile = await Profile.findOne({ user: userId });
    console.log("khikhi");
    if (profile) {
      const result = await v2.uploader.upload(req.file.path);
      profile.profileImage = result.url; // Store the image path in the profile document
      await profile.save();
      res.json({ message: "Image uploaded successfully" });
    } else {
      res.status(404).json({ message: "Profile not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading image" });
  }
};

export const getProfilePhoto = async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ user: userId });

    if (profile) {
      const filePath = path.join(__dirname, "uploads", profile.profileImage); // Adjust path based on your structure
      const imageData = fs.readFileSync(filePath);
      res.set("Content-Type", "image/jpeg"); // Set appropriate content type
      res.send(imageData);
    } else {
      res.status(404).json({ message: "Profile not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving image" });
  }
};

export const addRating = async (req, res) => {
  try {
    const { talentid } = req.params;
    const { ratings } = req.body;
    console.log(talentid);
    // Find the profile of the user being rated
    if (!mongoose.Types.ObjectId.isValid(talentid)) return false;
    const profile = await Profile.findOne({ user: talentid });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Add each rating from the request body to the user's profile
    ratings.forEach(async (ratingObj) => {
      // Check if the rating is provided and within the valid range
      const { user: ratedByUserId, rating, comment } = ratingObj;
      if (!rating || rating < 0 || rating > 5) {
        return res.status(400).json({ message: "Invalid rating" });
      }
      console.log(2);
      // Add the rating to the user's profile
      profile.ratings.push({ user: ratedByUserId, rating, comment });
    });

    // Save the profile with the added ratings
    await profile.save();

    res.status(200).json({ message: "Ratings added successfully" });
  } catch (error) {
    console.error("Error adding ratings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addRating2 = async (req, res) => {
  try {
    const { talentid } = req.params;
    const { ratings } = req.body;

    if (!mongoose.Types.ObjectId.isValid(talentid)) {
      return res.status(400).json({ message: "Invalid talent ID" });
    }

    if (!Array.isArray(ratings) || ratings.length === 0) {
      return res.status(400).json({ message: "Invalid ratings array" });
    }

    let profile = await Profile.findOne({ user: talentid });

    if (!profile) {
      // If profile not found, create a new one
      profile = new Profile({
        user: talentid,
        category: [],
        description: "",
        portfolio: [],
        ratings: [],
        profileImage: "",
        location:""
      });
    }

    for (const ratingObj of ratings) {
      const { user: ratedByUserId, rating, comment } = ratingObj;

      if (!rating || rating < 0 || rating > 5) {
        return res.status(400).json({ message: "Invalid rating" });
      }

      if (!mongoose.Types.ObjectId.isValid(ratedByUserId)) {
        return res.status(400).json({ message: "Invalid user ID for rating" });
      }

      // Check if the user has already rated this profile
      const existingRatingIndex = profile.ratings.findIndex(
        (r) => r.user.toString() === ratedByUserId
      );

      if (existingRatingIndex !== -1) {
        // Update the existing rating
        profile.ratings[existingRatingIndex].rating = rating;
        profile.ratings[existingRatingIndex].comment = comment;
        profile.ratings[existingRatingIndex].createdAt = new Date();
      } else {
        // Add a new rating
        profile.ratings.push({
          user: ratedByUserId,
          rating,
          comment,
          createdAt: new Date(),
        });
      }
    }

    await profile.save();

    res.status(200).json({ message: "Ratings added successfully" });
  } catch (error) {
    console.error("Error adding ratings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRatings = async (req, res) => {
  try {
    const { talentid } = req.params;
    console.log(talentid);
    if (!mongoose.Types.ObjectId.isValid(talentid)) {
      return res.status(400).json({ message: "Invalid talent ID" });
    }

    const profile = await Profile.findOne({ user: talentid });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile.ratings);
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getRatingDistribution = async (req, res) => {
  try {
    const { talentid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(talentid)) {
      return res.status(400).json({ message: "Invalid talent ID" });
    }

    const profile = await Profile.findOne({ user: talentid });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const distribution = profile.ratings.reduce((acc, rating) => {
      acc[rating.rating] = (acc[rating.rating] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json(distribution);
  } catch (error) {
    console.error("Error fetching rating distribution:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
