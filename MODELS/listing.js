const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reviews = require("./reviews.js");

const listingschema = new Schema({

    title: {
        type: String,
        required: true
    },

    description: String,

    image: {
        url: String,
        filename: String,
    },

    price: Number,
    location: String,
    country: String,

    // ADD THIS
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },

    ccategory: {
    type: String,
    enum: [
        "mountains",
        "snow",
        "tropical",
        "farms",
        "boats",
        "deserts",
        "cities",
        "forest",
        "wildlife"
    ]
},

    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reviews"
        }
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

listingschema.post("findOneAndDelete", async (Listing) => {
    await reviews.deleteMany({
        _id: { $in: Listing.reviews }
    });
});

const Listing = mongoose.model("Listing", listingschema);
module.exports = Listing;