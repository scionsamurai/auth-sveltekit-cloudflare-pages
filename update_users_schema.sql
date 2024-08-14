DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS "sessions";
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS verification_tokens;

CREATE TABLE IF NOT EXISTS "accounts" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL DEFAULT NULL,
  "type" TEXT NOT NULL DEFAULT NULL,
  "provider" TEXT NOT NULL DEFAULT NULL,
  "providerAccountId" TEXT NOT NULL DEFAULT NULL,
  "refresh_token" TEXT DEFAULT NULL,
  "access_token" TEXT DEFAULT NULL,
  "expires_at" INTEGER DEFAULT NULL,
  "token_type" TEXT DEFAULT NULL,
  "scope" TEXT DEFAULT NULL,
  "id_token" TEXT DEFAULT NULL,
  "session_state" TEXT DEFAULT NULL,
  "oauth_token_secret" TEXT DEFAULT NULL,
  "oauth_token" TEXT DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS "sessions" (
  "id" TEXT NOT NULL,
  "sessionToken" TEXT NOT NULL,
  "userId" TEXT NOT NULL DEFAULT NULL,
  "expires" DATETIME NOT NULL DEFAULT NULL, 
  PRIMARY KEY (sessionToken)
);

CREATE TABLE IF NOT EXISTS "users" (
  "id" TEXT NOT NULL DEFAULT '',
  "name" TEXT DEFAULT NULL,
  "email" TEXT DEFAULT NULL,
  "emailVerified" DATETIME DEFAULT NULL,
  "image" TEXT DEFAULT NULL, 
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS "verification_tokens" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL DEFAULT NULL,
  "expires" DATETIME NOT NULL DEFAULT NULL, 
  PRIMARY KEY (token)
);