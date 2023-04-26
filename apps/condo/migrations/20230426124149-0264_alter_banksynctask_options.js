// auto generated by kmigrator
// KMIGRATOR:0264_alter_banksynctask_options:IyBHZW5lcmF0ZWQgYnkgRGphbmdvIDQuMS43IG9uIDIwMjMtMDQtMjYgMDk6NDIKCmZyb20gZGphbmdvLmRiIGltcG9ydCBtaWdyYXRpb25zLCBtb2RlbHMKCgpjbGFzcyBNaWdyYXRpb24obWlncmF0aW9ucy5NaWdyYXRpb24pOgoKICAgIGRlcGVuZGVuY2llcyA9IFsKICAgICAgICAoJ19kamFuZ29fc2NoZW1hJywgJzAyNjNfYmFua2ludGVncmF0aW9ub3JnYW5pemF0aW9uY29udGV4dF9lbmFibGVkX2FuZF9tb3JlJyksCiAgICBdCgogICAgb3BlcmF0aW9ucyA9IFsKICAgICAgICBtaWdyYXRpb25zLkFsdGVyRmllbGQoCiAgICAgICAgICAgIG1vZGVsX25hbWU9J2JhbmtzeW5jdGFzaycsCiAgICAgICAgICAgIG5hbWU9J29wdGlvbnMnLAogICAgICAgICAgICBmaWVsZD1tb2RlbHMuSlNPTkZpZWxkKGRlZmF1bHQ9e30pLAogICAgICAgICAgICBwcmVzZXJ2ZV9kZWZhdWx0PUZhbHNlLAogICAgICAgICksCiAgICBdCg==

exports.up = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Alter field options on banksynctask
--
ALTER TABLE "BankSyncTask" ALTER COLUMN "options" SET DEFAULT '{}';
UPDATE "BankSyncTask" SET "options" = '{}' WHERE "options" IS NULL; SET CONSTRAINTS ALL IMMEDIATE;
ALTER TABLE "BankSyncTask" ALTER COLUMN "options" SET NOT NULL;
ALTER TABLE "BankSyncTask" ALTER COLUMN "options" DROP DEFAULT;
COMMIT;

    `)
}

exports.down = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Alter field options on banksynctask
--
ALTER TABLE "BankSyncTask" ALTER COLUMN "options" DROP NOT NULL;
COMMIT;

    `)
}