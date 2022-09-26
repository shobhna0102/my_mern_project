const Joi = require("joi");

const validatePostDetail=(post)=>{
    const schema = Joi.object({
    user:Joi.string(),
    text:Joi.string().required(),
    name:Joi.string(),
    date:Joi.date(),
    avatar:Joi.string(),
   likes:Joi.array(),
comments:Joi.array()})

return schema.validate(post);
}
module.exports={validatePostDetail}
