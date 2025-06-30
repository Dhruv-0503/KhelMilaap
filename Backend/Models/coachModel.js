const mongoose = require('mongoose');

const CoachSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
        },
        name: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            default: "defaultCoach.png"
        },
        
        sport: {
            type: String,
            required: true
        },
        
        status: {
            type: Boolean,  // Yes : Available & No : Not Available
            default: true
        },
        players: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users'
            }
        ],

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Coach', CoachSchema);
