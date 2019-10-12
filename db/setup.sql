create sequence seq maxvalue 2147483647;

CREATE OR REPLACE FUNCTION pseudo_encrypt(VALUE int) returns int AS $$
DECLARE
l1 int;
l2 int;
r1 int;
r2 int;
i int:=0;
BEGIN
 l1:= (VALUE >> 16) & 65535;
 r1:= VALUE & 65535;
 WHILE i < 3 LOOP
   l2 := r1;
   r2 := l1 # ((((1366 * r1 + 150889) % 714025) / 714025.0) * 32767)::int;
   l1 := l2;
   r1 := r2;
   i := i + 1;
 END LOOP;
 RETURN ((r1 << 16) + l1);
END;
$$ LANGUAGE plpgsql strict immutable;

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

create table users (
	username TEXT
		UNIQUE
		PRIMARY KEY
		NOT NULL,
	email TEXT
		UNIQUE
		NOT NULL,
	passwordhash TEXT
		NOT NULL,
  	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

create table projects (
	id BIGINT
		DEFAULT pseudo_encrypt(nextval('seq')::int)
		PRIMARY KEY,
	owner TEXT
		REFERENCES users(username)
		NOT NULL,
	name TEXT
		NOT NULL,
  	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	description TEXT
		NOT NULL,
	location TEXT,
	inspired_by TEXT,
	seeking_skills TEXT,
	assets TEXT,
	contact TEXT
);

create table favorites (
	username TEXT
		REFERENCES users(username)
		ON DELETE CASCADE
		NOT NULL,
	project_id BIGINT
		REFERENCES projects(id)
		ON DELETE CASCADE
		NOT NULL,
	UNIQUE (username, project_id)
);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();