const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
    {
        chatType: {
            type: String,
            enum: ['Personal', 'Community', 'Coach'],
            required: true
        },
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'UserProfiles', 
                required: true
            }
        ],
        communityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Community',
            default: null
        },
        coachId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coach',
            default: null
        },
        messages: [
            {
                sender: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'UserProfiles',
                    required: true
                },
                text: {
                    type: String
                },
                image: {
                    type: String
                },
                timestamp: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Message', MessageSchema);
