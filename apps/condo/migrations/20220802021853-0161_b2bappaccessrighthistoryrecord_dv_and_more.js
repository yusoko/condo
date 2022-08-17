// auto generated by kmigrator
// KMIGRATOR:0161_b2bappaccessrighthistoryrecord_dv_and_more:IyBHZW5lcmF0ZWQgYnkgRGphbmdvIDQuMC40IG9uIDIwMjItMDgtMDEgMjE6MTgKCmZyb20gZGphbmdvLmRiIGltcG9ydCBtaWdyYXRpb25zLCBtb2RlbHMKCgpjbGFzcyBNaWdyYXRpb24obWlncmF0aW9ucy5NaWdyYXRpb24pOgoKICAgIGRlcGVuZGVuY2llcyA9IFsKICAgICAgICAoJ19kamFuZ29fc2NoZW1hJywgJzAxNjBfcmVuYW1lX2NsYXNzaWZpZXJydWxlZGlzcGxheW5hbWVmcm9tX3RpY2tldGNoYW5nZV9jbGFzc2lmaWVyZGlzcGxheW5hbWVmcm9tX2FuZF9tb3JlJyksCiAgICBdCgogICAgb3BlcmF0aW9ucyA9IFsKICAgICAgICBtaWdyYXRpb25zLkFkZEZpZWxkKAogICAgICAgICAgICBtb2RlbF9uYW1lPSdiMmJhcHBhY2Nlc3NyaWdodGhpc3RvcnlyZWNvcmQnLAogICAgICAgICAgICBuYW1lPSdkdicsCiAgICAgICAgICAgIGZpZWxkPW1vZGVscy5JbnRlZ2VyRmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSwKICAgICAgICApLAogICAgICAgIG1pZ3JhdGlvbnMuQWRkRmllbGQoCiAgICAgICAgICAgIG1vZGVsX25hbWU9J2IyYmFwcGFjY2Vzc3JpZ2h0aGlzdG9yeXJlY29yZCcsCiAgICAgICAgICAgIG5hbWU9J3NlbmRlcicsCiAgICAgICAgICAgIGZpZWxkPW1vZGVscy5KU09ORmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSwKICAgICAgICApLAogICAgICAgIG1pZ3JhdGlvbnMuQWRkRmllbGQoCiAgICAgICAgICAgIG1vZGVsX25hbWU9J2IyYmFwcGNvbnRleHRoaXN0b3J5cmVjb3JkJywKICAgICAgICAgICAgbmFtZT0nZHYnLAogICAgICAgICAgICBmaWVsZD1tb2RlbHMuSW50ZWdlckZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSksCiAgICAgICAgKSwKICAgICAgICBtaWdyYXRpb25zLkFkZEZpZWxkKAogICAgICAgICAgICBtb2RlbF9uYW1lPSdiMmJhcHBjb250ZXh0aGlzdG9yeXJlY29yZCcsCiAgICAgICAgICAgIG5hbWU9J3NlbmRlcicsCiAgICAgICAgICAgIGZpZWxkPW1vZGVscy5KU09ORmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSwKICAgICAgICApLAogICAgICAgIG1pZ3JhdGlvbnMuQWRkRmllbGQoCiAgICAgICAgICAgIG1vZGVsX25hbWU9J2IyYmFwcGhpc3RvcnlyZWNvcmQnLAogICAgICAgICAgICBuYW1lPSdkdicsCiAgICAgICAgICAgIGZpZWxkPW1vZGVscy5JbnRlZ2VyRmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSwKICAgICAgICApLAogICAgICAgIG1pZ3JhdGlvbnMuQWRkRmllbGQoCiAgICAgICAgICAgIG1vZGVsX25hbWU9J2IyYmFwcGhpc3RvcnlyZWNvcmQnLAogICAgICAgICAgICBuYW1lPSdzZW5kZXInLAogICAgICAgICAgICBmaWVsZD1tb2RlbHMuSlNPTkZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSksCiAgICAgICAgKSwKICAgIF0K

exports.up = async (knex) => {
    await knex.raw(`
    BEGIN;

--
-- [CUSTOM] Set Statement Timeout to some large amount - 25 min (25 * 60 => 1500 sec)
--
SET statement_timeout = '1500s';   

--
-- Add field dv to b2bappaccessrighthistoryrecord
--
ALTER TABLE "B2BAppAccessRightHistoryRecord" ADD COLUMN IF NOT EXISTS "dv" integer NULL;
--
-- Add field sender to b2bappaccessrighthistoryrecord
--
ALTER TABLE "B2BAppAccessRightHistoryRecord" ADD COLUMN IF NOT EXISTS "sender" jsonb NULL;
--
-- Add field dv to b2bappcontexthistoryrecord
--
ALTER TABLE "B2BAppContextHistoryRecord" ADD COLUMN IF NOT EXISTS "dv" integer NULL;
--
-- Add field sender to b2bappcontexthistoryrecord
--
ALTER TABLE "B2BAppContextHistoryRecord" ADD COLUMN IF NOT EXISTS "sender" jsonb NULL;
--
-- Add field dv to b2bapphistoryrecord
--
ALTER TABLE "B2BAppHistoryRecord" ADD COLUMN IF NOT EXISTS "dv" integer NULL;
--
-- Add field sender to b2bapphistoryrecord
--
ALTER TABLE "B2BAppHistoryRecord" ADD COLUMN IF NOT EXISTS "sender" jsonb NULL;

--
-- [CUSTOM] Revert Statement Timeout to default amount - 10 secs
--
SET statement_timeout = '10s';

COMMIT;

    `)
}

exports.down = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Add field sender to b2bapphistoryrecord
--
ALTER TABLE "B2BAppHistoryRecord" DROP COLUMN "sender" CASCADE;
--
-- Add field dv to b2bapphistoryrecord
--
ALTER TABLE "B2BAppHistoryRecord" DROP COLUMN "dv" CASCADE;
--
-- Add field sender to b2bappcontexthistoryrecord
--
ALTER TABLE "B2BAppContextHistoryRecord" DROP COLUMN "sender" CASCADE;
--
-- Add field dv to b2bappcontexthistoryrecord
--
ALTER TABLE "B2BAppContextHistoryRecord" DROP COLUMN "dv" CASCADE;
--
-- Add field sender to b2bappaccessrighthistoryrecord
--
ALTER TABLE "B2BAppAccessRightHistoryRecord" DROP COLUMN "sender" CASCADE;
--
-- Add field dv to b2bappaccessrighthistoryrecord
--
ALTER TABLE "B2BAppAccessRightHistoryRecord" DROP COLUMN "dv" CASCADE;
COMMIT;

    `)
}
