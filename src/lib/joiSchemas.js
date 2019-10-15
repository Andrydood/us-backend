const Joi = require('@hapi/joi');

const email = Joi.string().email().min(3).max(100);

const shortString = Joi.string().min(3).max(30);

const mediumString = Joi.string().min(3).max(500);

const longString = Joi.string().min(3).max(5000);

const locationIdSchema = Joi.number();

const projectIdSchema = Joi.string().min(3).max(50);

const skillIdsSchema = Joi.array().items(Joi.number());

const createUserSchema = Joi.object({
  email: email.required(),
  username: shortString.required(),
  password: shortString.required(),
  firstName: shortString,
  lastName: shortString,
  bio: mediumString,
  locationId: locationIdSchema,
  skillIds: skillIdsSchema,
});

const loginUserSchema = Joi.object({
  email: email.required(),
  password: mediumString.required(),
});

const createProjectSchema = Joi.object({
  name: mediumString.required(),
  description: longString.required(),
  skillsNeeded: skillIdsSchema.required(),
  locationId: locationIdSchema,
  inspiredBy: longString,
  assets: longString,
  contact: Joi.object(),
});

const addFavoriteSchema = Joi.object({
  projectId: projectIdSchema.required(),
});

module.exports = {
  createUserSchema,
  loginUserSchema,
  createProjectSchema,
  addFavoriteSchema,
};
