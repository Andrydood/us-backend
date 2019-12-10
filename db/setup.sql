-- From: https://blog.andyet.com/2016/02/23/generating-shortids-in-postgres/
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION unique_short_id()
RETURNS TRIGGER AS $$

DECLARE
  key TEXT;
  qry TEXT;
  found TEXT;

BEGIN

  qry := 'SELECT id FROM ' || quote_ident(TG_TABLE_NAME) || ' WHERE id=';

  LOOP

    key := encode(gen_random_bytes(6), 'base64');

    key := replace(key, '/', '_'); -- url safe replacement
    key := replace(key, '+', '-'); -- url safe replacement

    EXECUTE qry || quote_literal(key) INTO found;

    IF found IS NULL THEN

      EXIT;
    END IF;

  END LOOP;

  NEW.id = key;

  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

create table locations (
	id SERIAL
		UNIQUE
		PRIMARY KEY
		NOT NULL,
	name TEXT
		UNIQUE
		NOT NULL
);

create table skills (
	id SERIAL
		UNIQUE
		PRIMARY KEY
		NOT NULL,
	name TEXT
		UNIQUE
		NOT NULL
);

create table users (
	id TEXT
		UNIQUE
		NOT NULL
		PRIMARY KEY,
	username TEXT
		UNIQUE
		NOT NULL,
	email TEXT
		UNIQUE
		NOT NULL,
	passwordhash TEXT
		NOT NULL,
	first_name TEXT,
	last_name TEXT,
	bio TEXT,
	location_id INTEGER
		REFERENCES locations(id),
  	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trigger_users_genid BEFORE INSERT ON users FOR EACH ROW EXECUTE PROCEDURE unique_short_id();

CREATE TRIGGER set_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

create table projects (
	id TEXT
		UNIQUE
		NOT NULL
		PRIMARY KEY,
	owner_id TEXT
		REFERENCES users(id)
		NOT NULL,
	name TEXT
		NOT NULL,
	description TEXT
		NOT NULL,
	location_id INTEGER
		REFERENCES locations(id),
	inspired_by TEXT,
	assets TEXT,
	contact JSON,
  	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trigger_projects_genid BEFORE INSERT ON projects FOR EACH ROW EXECUTE PROCEDURE unique_short_id();

CREATE TRIGGER set_projects_timestamp
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

create table favorites (
	user_id TEXT
		REFERENCES users(id)
		ON DELETE CASCADE
		NOT NULL,
	project_id TEXT
		REFERENCES projects(id)
		ON DELETE CASCADE
		NOT NULL,
	UNIQUE (user_id, project_id)
);

create table user_skills (
	user_id TEXT
		REFERENCES users(id)
		ON DELETE CASCADE
		NOT NULL,
	skill_id INTEGER
		REFERENCES skills(id)
		ON DELETE CASCADE
		NOT NULL,
	UNIQUE (user_id, skill_id)
);

create table project_seeking_skills (
	project_id TEXT
		REFERENCES projects(id)
		ON DELETE CASCADE
		NOT NULL,
	skill_id INTEGER
		REFERENCES skills(id)
		ON DELETE CASCADE
		NOT NULL,
	UNIQUE (project_id, skill_id)
);

create table conversations (
	id TEXT
		UNIQUE
		NOT NULL
		PRIMARY KEY,
	project_id TEXT
		REFERENCES projects(id)
		ON DELETE CASCADE
		NOT NULL,
	interested_user_id TEXT
		REFERENCES users(id)
		ON DELETE CASCADE
		NOT NULL,
	UNIQUE (project_id, interested_user_id),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trigger_conversations_genid BEFORE INSERT ON conversations FOR EACH ROW EXECUTE PROCEDURE unique_short_id();

create table messages (
	conversation_id TEXT
		REFERENCES conversations(id)
		ON DELETE CASCADE
		NOT NULL,
	sender_id TEXT
		REFERENCES users(id)
		ON DELETE CASCADE
		NOT NULL,
	content TEXT
		NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO locations (name)
VALUES  ('Anywhere'),
		('London');

INSERT INTO skills (name)
VALUES  ('Dancing'),
		('Singing'),
		('Drawing'),
		('Writing');