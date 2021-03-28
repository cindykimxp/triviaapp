create table answer(
    id serial primary key,
    answer text,
    category text
);
create table question(
    id serial primary key,
    question text,
    category text,
    answer integer references answer(id) 
);
create table standard_score(
    id text,
    score numeric(7, 5),
    category text,
    primary key (id, category)
);
create table burst_score(
    id text,
    score numeric(7, 5),
    category text,
    primary key (id, category)
);
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");