import Joi from 'joi'

const username = Joi.string().alphanum().min(5).max(20).required()
const email = Joi.string().email({minDomainSegments: 2, tlds: {allow: ["com", "net"]}}).required()
const password = Joi.string().min(5).max(30).required()
const passwordConfirmation = Joi.ref('password')

// Sign in input validation
export const signInValidation = Joi.object().keys({
    email,
    password
})

// Sign up input validation
export const signUpValidation = Joi.object().keys({
    username,
    email,
    password,
    passwordConfirmation
})