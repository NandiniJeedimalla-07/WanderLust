const Joi=require("joi");

module.exports.listingSchema=Joi.object({//this joi object checks whether req.body is object or not .if req.body=100 validation fails
    listing:Joi.object({//this joi object checks if listing is an object or not and checks its defined validation 
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required().min(0),
        location:Joi.string().required(),
        country:Joi.string().required(),
    }).required(),
});