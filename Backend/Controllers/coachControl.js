const userProfiles = require('../Models/profileModel');

const coachControl = {
    getCoaches: async (req, res) => {
        try {
            const userId = req.query.userId;
            const coachDetails = await userProfiles.find({ role: "Coach" }).select('name avatar experience fees status sports userId players')

            const formattedCoaches = coachDetails.map(coach => {
                const isHired = coach.players.includes(userId); // ✅ Check if userId is in members array

                return {
                    coachId: coach.userId.toString(), 
                    name: coach.name,
                    avatar: coach.avatar,
                    experience: coach.experience,
                    fees: coach.fees,
                    status: coach.status,
                    sport: coach.sports,
                    isHired: isHired
                };
            });

            res.json({coaches: formattedCoaches});
        }
        catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    hireCoach: async (req, res) => {
        try {
            const userId = req.user.id; // Logged-in user
            const { coachId } = req.body; // Coach to be hired

            if (!coachId) {
                return res.status(400).json({ message: 'Coach ID is required' });
            }
            if (coachId === userId) return res.status(400).json({ msg: 'Same Ids Are Not Allowed !!' });

            const userProfile = await userProfiles.findOne({ userId: userId });
            const coachProfile = await userProfiles.findOne({ userId: coachId });

            if (!userProfile || !coachProfile) {
                return res.status(404).json({ message: 'User or Coach not found' });
            }

            // Check if the coach is already in the user's coach list
            if (userProfile.coaches.includes(coachId)) {
                return res.status(400).json({ message: 'You have already hired this coach' });
            }

            // Add coach to user's coach list
            userProfile.coaches.push(coachId);
            await userProfile.save();

            // Add user to coach's player list
            coachProfile.players.push(userId);
            await coachProfile.save();

            res.status(200).json({ message: 'Coach hired successfully' });
        }
        catch (err) {
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    }
}

module.exports = coachControl;