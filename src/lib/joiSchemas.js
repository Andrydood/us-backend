const Joi = require('@hapi/joi');

const email = Joi.string().email().max(50);

const shortestString = Joi.string().max(30);

const shortString = Joi.string().max(100);

const mediumString = Joi.string().max(500);

const longString = Joi.string().max(5000);

const locationIdSchema = Joi.number();

const projectIdSchema = Joi.string().max(50);

const conversationIdSchema = Joi.string().max(50);

const skillIdsSchema = Joi.array().items(Joi.number());

const createUserSchema = Joi.object({
  email: email.required(),
  username: Joi.string().alphanum().max(20).min(3)
    .required(),
  password: shortestString.min(3).required(),
  bio: mediumString.optional().allow('').allow(null),
  locationId: locationIdSchema.optional().allow('').allow(null),
  skillIds: skillIdsSchema.optional().allow('').allow(null),
});

const loginUserSchema = Joi.object({
  email: email.min(3).required(),
  password: mediumString.min(3).required(),
});

const createProjectSchema = Joi.object({
  name: shortString.min(3).required(),
  description: longString.min(3).required(),
  skillsNeeded: skillIdsSchema.required(),
  locationId: locationIdSchema.optional().allow('').allow(null),
  inspiredBy: longString.optional().allow('').allow(null),
  assets: longString.optional().allow('').allow(null),
  contact: Joi.object().optional().allow('').allow(null),
});

const addFavoriteSchema = Joi.object({
  projectId: projectIdSchema.required(),
});

const createChatSchema = Joi.object({
  projectId: projectIdSchema.required(),
});

const sendMessageSchema = Joi.object({
  conversationId: conversationIdSchema.required(),
  message: Joi.string().required(),
});

module.exports = {
  createUserSchema,
  loginUserSchema,
  createProjectSchema,
  addFavoriteSchema,
  createChatSchema,
  sendMessageSchema,
};
