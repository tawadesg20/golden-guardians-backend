import { seniorModel, volunteerModel } from "../../Database/Model.js";

const matchAlgorithm = {
    senior: async (req, res) => {
        const { email } = req.body;
        try {
            const senior = await seniorModel.findOne({ email: email });
            if (!senior) {
                return res.status(404).json({ status: "Not Ok", message: "Senior not found" });
            }

            const matches = await volunteerModel.aggregate([
                {
                    $match: {
                        city: senior.city,
                        skills: { $in: senior.interests }
                    }
                },
                {
                    $project: {
                        name: 1,
                        email: 1,
                        phone: 1,
                        skills: 1,
                        _id: 0 // Exclude _id from the result
                    }
                }
            ]);

            if (matches.length > 0) {
                return res.status(200).json({ status: "Ok", message: "Matches", matches: matches });
            } else {
                return res.status(200).json({ status: "Not Ok", message: "Match not found", matches: [] });
            }
        } catch (error) {
            console.error("Error in senior matching:", error);
            return res.status(500).json({ status: "Error", message: "Internal server error" });
        }
    },

    volunteer: async (req, res) => {
        const { email } = req.body;
        try {
            const volunteer = await volunteerModel.findOne({ email: email });
            if (!volunteer) {
                return res.status(404).json({ status: "Not Ok", message: "Volunteer not found" });
            }

            const matches = await seniorModel.aggregate([
                {
                    $match: {
                        city: volunteer.city,
                        interests: { $in: volunteer.skills }
                    }
                },
                {
                    $project: {
                        name: 1,
                        email: 1,
                        phone: 1,
                        interests: 1,
                        _id: 0 // Exclude _id from the result
                    }
                }
            ]);

            if (matches.length > 0) {
                return res.status(200).json({ status: "Ok", message: "Matches", matches: matches });
            } else {
                return res.status(200).json({ status: "Not Ok", message: "Match not found", matches: [] });
            }
        } catch (error) {
            console.error("Error in volunteer matching:", error);
            return res.status(500).json({ status: "Error", message: "Internal server error" });
        }
    }
};

export default matchAlgorithm;