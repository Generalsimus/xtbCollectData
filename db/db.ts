import { DB } from "./types";
import SQLite from "better-sqlite3";
import { url } from "inspector";
import { Kysely, ParseJSONResultsPlugin, SqliteDialect } from "kysely";

export const db = new Kysely<DB>({
  dialect: new SqliteDialect({
    database: new SQLite("./db.sqlite"),
  }),
  plugins: [new ParseJSONResultsPlugin()],
});
