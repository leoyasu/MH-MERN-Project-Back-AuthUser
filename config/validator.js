const joi = require("joi");

const validator = (req, res, next) => {
    const schema = joi.object({
        fullName: joi.string().required(),
        email: joi.string()
            .email({ minDomainSegments: 2 })
            .required()
            .messages({
                'string.email': 'Wrong Email format'
            }),
        password: joi.string()
            .min(8)
            .max(30)
            .pattern(new RegExp(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/))
            .required()
            .messages({
                'string.min': 'The password must have at least 8 characters.',
                'string.max': 'The password must have a maximum of 30 characters',
                'string.pattern.base': 'The password must contain at least one uppercase character, one lowercase character, and a number'
            }),
        from: joi.string().required(),
        application: joi.string().required()
    });

    const validation = schema.validate(req.body.userData, { abortEarly: false })
    
    if (validation.error) {
        return res.json({
            success: false,
            from: "validator",
            message: validation.error.details
        })
    }
    next()
}
module.exports = validator
