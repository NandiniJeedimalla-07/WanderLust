const Joi=require("joi");

module.exports.listingSchema=Joi.object({//this joi object checks whether req.body is object or not .if req.body=100 validation fails
    Listing:Joi.object({//this joi object checks if listing is an object or not and checks its defined validation 
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required().min(0),
         image: Joi.string().allow("", null), 
        location:Joi.string().required(),
        country:Joi.string().required(),
    }).required(),
});

module.exports.reviewSchema=Joi.object({
    reviews:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required()
})