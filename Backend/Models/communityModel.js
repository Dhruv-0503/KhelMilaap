const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        avatar: {
            type: String,
            default: "default-Community.png"
        },
        description: {
            type: String
        },
        sport: {
            type: String
        },
        leader: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Users',
            required: true
        },
        members: [
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

module.exports = mongoose.model('Community', CommunitySchema);
