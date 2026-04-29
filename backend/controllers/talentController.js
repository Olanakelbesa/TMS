import Talent from "../models/Talent.js";
import Notification from "../models/Notification.js";

// @desc   Create a new talent
// @route  POST /api/talents
// @access Public
export const createTalent = async (req, res) => {
  try {
    const { fullName, email, primarySkill, experience, description } = req.body;

    // Check duplicate email
    const existing = await Talent.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "A talent with this email already exists" });
    }

    const talent = await Talent.create({ fullName, email, primarySkill, experience, description });
    
    // Create notification for admin
    await Notification.create({
      title: "New Talent Application",
      message: `${fullName} has submitted a new application as a ${primarySkill}.`,
      type: "new_registration",
      link: `/admin/dashboard`
    });

    res.status(201).json({ success: true, data: talent });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc   Get all talents with search & pagination
// @route  GET /api/talents
// @access Public
export const getTalents = async (req, res) => {
  try {
    const { search, skill, status, page = 1, limit = 9 } = req.query;

    const query = {};
    
    // Default to 'active' status for public requests unless admin specifies otherwise
    // We can check if the user is admin in the future, but for now we filter by active
    query.status = status || "active";
    
    // If status is 'all', remove the filter
    if (status === "all") {
      delete query.status;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { primarySkill: { $regex: search, $options: "i" } },
      ];
    }
    if (skill && skill !== "All") {
      query.primarySkill = { $regex: skill, $options: "i" };
    }

    const total = await Talent.countDocuments(query);
    const talents = await Talent.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: talents,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc   Get single talent by ID
// @route  GET /api/talents/:id
// @access Public
export const getTalentById = async (req, res) => {
  try {
    const talent = await Talent.findById(req.params.id);
    if (!talent) return res.status(404).json({ message: "Talent not found" });
    res.json({ success: true, data: talent });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc   Update talent
// @route  PUT /api/talents/:id
// @access Admin
export const updateTalent = async (req, res) => {
  try {
    const talent = await Talent.findById(req.params.id);
    if (!talent) return res.status(404).json({ message: "Talent not found" });

    const updated = await Talent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ success: true, data: updated });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc   Delete talent
// @route  DELETE /api/talents/:id
// @access Admin
export const deleteTalent = async (req, res) => {
  try {
    const talent = await Talent.findById(req.params.id);
    if (!talent) return res.status(404).json({ message: "Talent not found" });

    await Talent.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Talent deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc   Get talent analytics stats
// @route  GET /api/talents/stats
// @access Admin
export const getTalentStats = async (req, res) => {
  try {
    const total = await Talent.countDocuments();
    const active = await Talent.countDocuments({ status: "active" });
    const pending = await Talent.countDocuments({ status: "pending" });
    const inactive = await Talent.countDocuments({ status: "inactive" });

    // Get distribution of primary skills
    const skillStats = await Talent.aggregate([
      { $group: { _id: "$primarySkill", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        total,
        active,
        pending,
        inactive,
        skillStats
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
