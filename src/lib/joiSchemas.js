const Joi = require('@hapi/joi');

const email = Joi.string().email().min(3).max(50);

const shortestString = Joi.string().min(3).max(30);

const shortString = Joi.string().min(3).max(100);

const mediumString = Joi.string().max(500);

const longString = Joi.string().min(3).max(5000);

const locationIdSchema = Joi.number();

const projectIdSchema = Joi.string().min(3).max(50);

const skillIdsSchema = Joi.array().items(Joi.number());

const createUserSchema = Joi.object({
  email: email.required(),
  username: shortestString.required(),
  password: shortestString.required(),
  firstName: shortestString.optional().allow('').allow(null),
  lastName: shortestString.optional().allow('').allow(null),
  bio: mediumString.optional().allow('').allow(null),
  locationId: locationIdSchema.optional().allow('').allow(null),
  skillIds: skillIdsSchema.optional().allow('').allow(null),
});

const loginUserSchema = Joi.object({
  email: email.required(),
  password: mediumString.required(),
});

const createProjectSchema = Joi.object({
  name: shortString.required(),
  description: longString.required(),
  skillsNeeded: skillIdsSchema.required(),
  locationId: locationIdSchema.optional().allow('').allow(null),
  inspiredBy: longString.optional().allow('').allow(null),
  assets: longString.optional().allow('').allow(null),
  contact: Joi.object().optional().allow('').allow(null),
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
