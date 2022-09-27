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

const validatePostCommentDetail=(cmnt)=>{
    const schema = Joi.object({
    user:Joi.string(),
    text:Joi.string().required(),
    name:Joi.string(),
    avatar:Joi.string(),
    date:Joi.date()})

return schema.validate(cmnt);
}

module.exports={validatePostDetail,validatePostCommentDetail}
