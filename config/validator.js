const joi = require("joi");

const getDynamicPasswordSchema = (source) => {
    if (source === 'google') {
        return joi.string().min(8).max(60);
    }
    return joi.string().min(8).max(30).pattern(new RegExp(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/));
};

const userValidator = {

    validatorSignUp: (req, res, next) => {
        const schema = joi.object({
            fullName: joi.string().required(),
            email: joi.string()
                .email({ minDomainSegments: 2 })
                .required()
                .messages({
                    'string.email': 'Wrong Email format'
                }),
            password: getDynamicPasswordSchema(req.body.userData.from)
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
    },

    validatorSignIn: (req, res, next) => {
        const schema = joi.object({
            email: joi.string()
                .email({ minDomainSegments: 2 })
                .required()
                .messages({
                    'string.email': 'Wrong Email format'
                }),
            password: getDynamicPasswordSchema(req.body.formData.from)
                .required()
                .messages({
                    'string.min': 'The password must have at least 8 characters.',
                    'string.max': 'The password must have a maximum of 30 characters',
                    'string.pattern.base': 'The password must contain at least one uppercase character, one lowercase character, and a number'
                }),
            from: joi.string().required(),
            application: joi.string().required()
        });

        const validation = schema.validate(req.body.formData, { abortEarly: false })

        if (validation.error) {
            return res.json({
                success: false,
                from: "validator",
                message: validation.error.details
            })
        }
        next()
    }
}
module.exports = userValidator
