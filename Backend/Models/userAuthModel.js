const mongoose = require('mongoose');

const userAuthSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true
        },
        password: {
            type: String,
            type: String,
            minlength: 6,
            required: function () {
                return !this.googleId;  // Only required if not using Google login
            },
            minlength: 6
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true
        },
        profileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserProfiles',
            required: true
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Users', userAuthSchema, "Users");
