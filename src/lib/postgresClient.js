const { Pool } = require('pg');
const config = require('config');
const _ = require('lodash');

const PROJECTS_PER_PAGE = 10;

class PostgresClient {
  constructor() {
    this.pool = new Pool(config.get('postgres'));
  }

  insertUser(email, username, hashedPassword) {
    const insertQuery = `
      INSERT INTO users(email, username, passwordhash)
      VALUES($1, $2, $3)
    `;
    return this.pool.query(insertQuery, [email, username, hashedPassword]);
  }

  async getUserByEmail(email) {
    const selectQuery = `
      SELECT passwordhash, username
      FROM users
      WHERE email=$1
    `;
    const dbResponse = await this.pool.query(selectQuery, [email]);
    return _.get(dbResponse, 'rows.0');
  }

  createProject(owner, name, description) {
    const insertQuery = `
      INSERT INTO projects (owner, name, description)
      VALUES ($1, $2, $3)
    `;
    return this.pool.query(insertQuery, [owner, name, description]);
  }

  async getAllProjects(page = 0) {
    const selectQuery = `
      SELECT id, name, description
      FROM projects
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const dbResponse = await this.pool.query(
      selectQuery,
      [PROJECTS_PER_PAGE, PROJECTS_PER_PAGE * page],
    );
    return _.get(dbResponse, 'rows');
  }

  async getProjectById(projectId) {
    const selectQuery = `
      SELECT *
      FROM projects
      WHERE id=$1
    `;
    const dbResponse = await this.pool.query(selectQuery, [projectId]);
    return _.get(dbResponse, 'rows.0');
  }

  async getProjectsByOwner(username, page = 0) {
    const selectQuery = `
      SELECT id, name, description
      FROM projects
      WHERE owner=$1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const dbResponse = await this.pool.query(
      selectQuery,
      [username, PROJECTS_PER_PAGE, PROJECTS_PER_PAGE * page],
    );
    return _.get(dbResponse, 'rows');
  }

  deleteProject(username, projectId) {
    const deleteQuery = `
      DELETE FROM projects
      WHERE id=$1
      AND owner=$2
    `;

    return this.pool.query(deleteQuery, [projectId, username]);
  }

  addToFavorites(username, projectId) {
    const insertQuery = `
      INSERT INTO favorites (username, project_id)
      VALUES ($1,$2)
    `;

    return this.pool.query(insertQuery, [username, projectId]);
  }

  deleteFromFavorites(username, projectId) {
    const insertQuery = `
      DELETE FROM favorites
      WHERE username=$1
      AND project_id=$2
    `;

    return this.pool.query(insertQuery, [username, projectId]);
  }

  async getFavoritesByUser(username, page = 0) {
    const selectQuery = `
      SELECT projects.id, projects.name, projects.description
      FROM users, projects, favorites
      WHERE favorites.username = $1
      AND favorites.username = users.username
      AND favorites.project_id = projects.id
      ORDER BY projects.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const dbResponse = await this.pool.query(
      selectQuery,
      [username, PROJECTS_PER_PAGE, PROJECTS_PER_PAGE * page],
    );
    return _.get(dbResponse, 'rows');
  }
}

module.exports = PostgresClient;
