const Joi = require('@hapi/joi');

const emailSchema = Joi.string().email()
  .min(3)
  .max(100);

const usernameSchema = Joi.string().alphanum()
  .min(3)
  .max(100);

const passwordSchema = Joi.string()
  .min(3)
  .max(100);

const passwordHashSchema = Joi.string()
  .min(3)
  .max(100);

const projectIdSchema = Joi.string()
  .min(3)
  .max(50)
  .required();

const createUserSchema = Joi.object({
  email: emailSchema.required(),
  username: usernameSchema.required(),
  password: passwordSchema.required(),
});

const loginUserSchema = Joi.object({
  email: emailSchema.required(),
  password: passwordHashSchema.required(),
});

const createProjectSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(140)
    .required(),
  description: Joi.string()
    .max(5000),
});

const addFavoriteSchema = Joi.object({
  projectId: projectIdSchema,
});

const deleteFavoriteSchema = Joi.object({
  projectId: projectIdSchema,
});

module.exports = {
  createUserSchema,
  loginUserSchema,
  createProjectSchema,
  addFavoriteSchema,
  deleteFavoriteSchema,
};
