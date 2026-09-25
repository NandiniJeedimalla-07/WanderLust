const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    Listing: Joi.object({

        title: Joi.string().required(),

        description: Joi.string().required(),

        price: Joi.number().required().min(0),

        image: Joi.string().allow("", null),

        location: Joi.string().required(),

        country: Joi.string().required(),

        category: Joi.string()
            .valid(
                "mountains",
                "snow",
                "tropical",
                "farms",
                "boats",
                "deserts",
                "cities",
                "forest",
                "wildlife"
            )
            .required()

    }).required(),
});

module.exports.reviewSchema = Joi.object({

    reviews: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()

});