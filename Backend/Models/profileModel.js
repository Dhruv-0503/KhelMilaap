const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
        },
        name: {
            type: String,
            required: true
        },
        role : {
            type : String,
            enum : ["Player", "Coach"],
            required : true,
            default : "Player"
        },
        avatar: {
            type: String,
            default: "/assets/images/testinomial1.jpg"
        },
        bio: {
            type: String,
            maxlength: 500,
            default : "Hello Everyone Nice to meet you!!"
        },
        images: [
            {
                type : String
            }
        ],
        sports:[
            {
                type : String
            }
        ],
        achievements: [
            {
              title: {
                type: String,
                required: true,
              },
              year: {
                type: Number,
                required: true,  
                min: 1900, 
                max: new Date().getFullYear(),
              }
            }
        ],
        isPublic: {
            type: Boolean,
            default: true
        },
        location: {
            type: String,
            default : "India"
        },
        socialLinks: {
            facebook: { type: String, default: "https://facebook.com/default" },
            instagram: { type: String, default: "https://instagram.com/default" },
            twitter: { type: String, default: "https://twitter.com/default" }
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Users'
            }
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Users'
            }
        ],
        communities: [
            {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Community'
            }
        ],
        coaches: [
            {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Users'
            }
        ],
        players: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref : 'Users'
            }
        ]
    },
    {
        timestamps: true
    });

module.exports = mongoose.model('UserProfiles', userProfileSchema, "Profiles");
