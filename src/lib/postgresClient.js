const { Pool } = require('pg');
const config = require('config');
const _ = require('lodash');

const PROJECTS_PER_PAGE = 10;

class PostgresClient {
  constructor() {
    this.pool = new Pool(config.get('postgres'));
  }

  async createUser({
    email,
    username,
    hashedPassword,
    firstName,
    lastName,
    bio,
    locationId,
  }) {
    const insertQuery = `
      INSERT INTO users(email, username, passwordhash, first_name, last_name, bio, location_id)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;
    const dbResponse = await this.pool.query(
      insertQuery,
      [email, username, hashedPassword, firstName, lastName, bio, locationId],
    );
    return _.get(dbResponse, 'rows.0');
  }

  async addUserSkills(userId, skillIds) {
    const insertQuery = `
      INSERT INTO user_skills (user_id, skill_id)
      SELECT * FROM UNNEST ($1::text[], $2::integer[])
    `;
    return this.pool.query(
      insertQuery,
      [Array(skillIds.length).fill(userId), skillIds],
    );
  }

  async getUserCredentialsByEmail(email) {
    const selectQuery = `
      SELECT passwordhash, username, id
      FROM users
      WHERE email=$1
    `;
    const dbResponse = await this.pool.query(selectQuery, [email]);
    return _.get(dbResponse, 'rows.0');
  }

  async getUserDataByUsername(username) {
    const selectQuery = `
      SELECT users.id, users.username, users.first_name, users.last_name, users.bio, locations.name AS location, skill_groups.skills
      FROM users
      LEFT JOIN locations ON users.location_id = locations.id
      LEFT JOIN (
        SELECT user_skills.user_id user_id, array_to_json(array_agg(json_build_object('name', skills.name, 'id', skills.id))) skills
        FROM user_skills
        INNER JOIN skills ON skills.id = user_skills.skill_id
        GROUP BY user_skills.user_id
      )skill_groups on skill_groups.user_id = users.id
      WHERE users.username=$1;
    `;
    const dbResponse = await this.pool.query(selectQuery, [username]);
    return _.get(dbResponse, 'rows.0');
  }

  async createProject({
    ownerId,
    name,
    description,
    locationId,
    inspiredBy,
    assets,
    contact,
  }) {
    const insertQuery = `
      INSERT INTO projects (owner_id, name, description, location_id, inspired_by, assets, contact )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;
    const dbResponse = await this.pool.query(
      insertQuery,
      [ownerId, name, description, locationId, inspiredBy, assets, contact],
    );
    return _.get(dbResponse, 'rows.0');
  }

  async addProjectSkills(projectId, skillIds) {
    const insertQuery = `
      INSERT INTO project_seeking_skills (project_id, skill_id)
      SELECT * FROM UNNEST ($1::text[], $2::integer[])
    `;
    return this.pool.query(
      insertQuery,
      [Array(skillIds.length).fill(projectId), skillIds],
    );
  }

  async getProjectOwner(projectId) {
    const selectQuery = `
      SELECT owner_id
      FROM projects
      WHERE id=$1
    `;
    const dbResponse = await this.pool.query(selectQuery, [projectId]);
    return _.get(dbResponse, 'rows.0');
  }

  deleteProject(ownerId, projectId) {
    const deleteQuery = `
      DELETE FROM projects
      WHERE id=$1
      AND owner_id=$2
    `;

    return this.pool.query(deleteQuery, [projectId, ownerId]);
  }

  async getProjectById(projectId) {
    const selectQuery = `
      SELECT users.username as owner, projects.id, projects.name, projects.description, projects.inspired_by, projects.assets, projects.contact, locations.name AS location, skill_groups.skills AS needed_skills
      FROM projects
      LEFT JOIN locations ON projects.location_id = locations.id
      LEFT JOIN (
        SELECT project_seeking_skills.project_id project_id, array_to_json(array_agg(json_build_object('name', skills.name, 'id', skills.id))) skills
        FROM project_seeking_skills
        INNER JOIN skills ON skills.id = project_seeking_skills.skill_id
        GROUP BY project_seeking_skills.project_id
      )skill_groups ON skill_groups.project_id = projects.id
      JOIN users ON projects.owner_id = users.id
      WHERE projects.id = $1;
    `;
    const dbResponse = await this.pool.query(selectQuery, [projectId]);
    return _.get(dbResponse, 'rows.0');
  }

  async getAllProjects(page = 0) {
    const selectQuery = `
      SELECT users.username as owner, projects.id, projects.name, projects.description, projects.inspired_by, projects.assets, projects.contact, locations.name AS location, skill_groups.skills AS needed_skills
      FROM projects
      LEFT JOIN locations ON projects.location_id = locations.id
      LEFT JOIN (
        SELECT project_seeking_skills.project_id project_id, array_to_json(array_agg(json_build_object('name', skills.name, 'id', skills.id))) skills
        FROM project_seeking_skills
        INNER JOIN skills ON skills.id = project_seeking_skills.skill_id
        GROUP BY project_seeking_skills.project_id
      )skill_groups ON skill_groups.project_id = projects.id
      JOIN users ON projects.owner_id = users.id
      ORDER BY projects.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const dbResponse = await this.pool.query(
      selectQuery,
      [PROJECTS_PER_PAGE, PROJECTS_PER_PAGE * page],
    );
    return _.get(dbResponse, 'rows');
  }

  async getUserProjects(username, page = 0) {
    const selectQuery = `
      SELECT users.username as owner, projects.id, projects.name, projects.description, projects.inspired_by, projects.assets, projects.contact, locations.name AS location, skill_groups.skills AS needed_skills
      FROM projects
      LEFT JOIN locations ON projects.location_id = locations.id
      LEFT JOIN (
        SELECT project_seeking_skills.project_id project_id, array_to_json(array_agg(json_build_object('name', skills.name, 'id', skills.id))) skills
        FROM project_seeking_skills
        INNER JOIN skills ON skills.id = project_seeking_skills.skill_id
        GROUP BY project_seeking_skills.project_id
      )skill_groups ON skill_groups.project_id = projects.id
      JOIN users ON projects.owner_id = users.id
      WHERE users.username=$1
      ORDER BY projects.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const dbResponse = await this.pool.query(
      selectQuery,
      [username, PROJECTS_PER_PAGE, PROJECTS_PER_PAGE * page],
    );
    return _.get(dbResponse, 'rows');
  }

  async checkIfFavorite(userId, projectId) {
    const selectQuery = `
      SELECT EXISTS(
        SELECT
        FROM favorites
        WHERE project_id=$1
        AND user_id=$2
      )
    `;

    const dbResponse = await this.pool.query(selectQuery, [projectId, userId]);
    return { isFavorite: _.get(dbResponse, 'rows.0.exists') };
  }

  addToFavorites(userId, projectId) {
    const insertQuery = `
      INSERT INTO favorites (user_id, project_id)
      VALUES ($1,$2)
    `;

    return this.pool.query(insertQuery, [userId, projectId]);
  }

  deleteFromFavorites(userId, projectId) {
    const insertQuery = `
      DELETE FROM favorites
      WHERE user_id=$1
      AND project_id=$2
    `;

    return this.pool.query(insertQuery, [userId, projectId]);
  }

  async getFavoritesByUser(userId, page = 0) {
    const selectQuery = `
      SELECT users.username as owner, projects.id, projects.name, projects.description, projects.inspired_by, projects.assets, projects.contact, locations.name AS location, skill_groups.skills AS needed_skills
      FROM projects
      LEFT JOIN locations ON projects.location_id = locations.id
      LEFT JOIN (
        SELECT project_seeking_skills.project_id project_id, array_to_json(array_agg(json_build_object('name', skills.name, 'id', skills.id))) skills
        FROM project_seeking_skills
        INNER JOIN skills ON skills.id = project_seeking_skills.skill_id
        GROUP BY project_seeking_skills.project_id
      )skill_groups ON skill_groups.project_id = projects.id
      JOIN users ON projects.owner_id = users.id
      JOIN favorites ON favorites.project_id = projects.id
      WHERE favorites.user_id = $1
      ORDER BY projects.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const dbResponse = await this.pool.query(
      selectQuery,
      [userId, PROJECTS_PER_PAGE, PROJECTS_PER_PAGE * page],
    );
    return _.get(dbResponse, 'rows');
  }

  async getAllSkills() {
    const selectQuery = `
      SELECT id, name
      FROM skills
    `;
    const dbResponse = await this.pool.query(selectQuery);
    return _.get(dbResponse, 'rows');
  }

  async getAllLocations() {
    const selectQuery = `
      SELECT id, name
      FROM locations
    `;
    const dbResponse = await this.pool.query(selectQuery);
    return _.get(dbResponse, 'rows');
  }
}

module.exports = PostgresClient;
