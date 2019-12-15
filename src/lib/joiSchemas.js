const Joi = require('@hapi/joi');

const email = Joi.string().email().max(50);

const longString = Joi.string().max(5000);

const projectIdSchema = Joi.string().max(50);

const conversationIdSchema = Joi.string().max(50);

const skillIdsSchema = Joi.array().items(Joi.number());

const locationSchema = Joi.object();

const createUserSchema = Joi.object({
  email: email.required(),
  username: Joi.string().alphanum().max(20).min(3)
    .required(),
  password: Joi.string().max(30).min(3).required(),
});

const loginUserSchema = Joi.object({
  email: email.min(3).required(),
  password: Joi.string().max(100).min(3).required(),
});

const createProjectSchema = Joi.object({
  name: Joi.string().max(100).min(3).required(),
  description: longString.min(3).required(),
  skillsNeeded: skillIdsSchema.required(),
  location: locationSchema,
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

const setupSchema = Joi.object({
  bio: Joi.string().max(150),
  location: locationSchema,
  skillIds: skillIdsSchema,
});

module.exports = {
  createUserSchema,
  loginUserSchema,
  createProjectSchema,
  addFavoriteSchema,
  createChatSchema,
  sendMessageSchema,
  setupSchema,
};
