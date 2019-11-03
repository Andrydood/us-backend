const assert = require('assert');
const Joi = require('@hapi/joi');
const {createUserSchema} = require('../src/lib/joiSchemas');


describe('User creation', () => {
  describe('#indexOf()', () => {
    it('it should not allow non alphanumeric characters as username', () => {
      const user = {
        email: 'someuser@email.com',
        username: 'aaaay@',
        password: 'password'
      }
      const { error, value } = createUserSchema.validate(user);
      const alphaNumErr = error.details.findIndex(err => err.type === 'string.alphanum' && err.context.label === 'username') > -1;
      if (alphaNumErr) assert(true);
      else assert(false);
    });
    
    it('it should allow alphanumeric characters as username', () => {
      const user = {
        email: 'someuser@email.com',
        username: 'aaaay',
        password: 'password'
      }
      const { error, value } = createUserSchema.validate(user);
      if (error) assert(false);
      else assert(true);
    });
  });
});