import { body } from 'express-validator'

export const loginValidation = [
    body('email', "Enter correct email").isEmail(),
    body('password', "Password too short (<5)").isLength({ min: 5}),
];

export const registerValidation = [
    body('email', "Enter correct email").isEmail(),
    body('password', "Password too short (<5)").isLength({ min: 5}),
    body('fullName', "Full name to short (<3)").isLength({ min: 3}),
    body('avatar', "Enter correct link").optional().isURL(),
];

export const postCreateValidation = [
    body('title', 'Enter post title').isLength({min: 3}).isString(),
    body('text', 'Enter post text').isLength({min: 10}).isString(),
    body('tags', 'Enter array of tags').optional().isArray(),
    body('imageUrl', 'Incorrect image link').optional().isString(),
];

export const postUpdateValidation = [
    body('title', 'Enter post title').optional().isLength({min: 3}).isString(),
    body('text', 'Enter post text').optional().isLength({min: 10}).isString(),
    body('tags', 'Enter array of tags').optional().isArray(),
    body('imageUrl', 'Incorrect image link').optional().isString(),
    body('user', 'Incorrect user').optional()
];