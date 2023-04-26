// auto generated by kmigrator
// KMIGRATOR:0263_bankintegrationorganizationcontext_enabled_and_more:IyBHZW5lcmF0ZWQgYnkgRGphbmdvIDQuMS43IG9uIDIwMjMtMDQtMjQgMTQ6NDEKCmZyb20gZGphbmdvLmRiIGltcG9ydCBtaWdyYXRpb25zLCBtb2RlbHMKCgpjbGFzcyBNaWdyYXRpb24obWlncmF0aW9ucy5NaWdyYXRpb24pOgoKICAgIGRlcGVuZGVuY2llcyA9IFsKICAgICAgICAoJ19kamFuZ29fc2NoZW1hJywgJzAyNjJfYmFua3RyYW5zYWN0aW9uX2JhbmtfdHJhbnNhY3Rpb25fdW5pcXVlX251bWJlcl9kYXRlX29yZ2FuaXphdGlvbl9hbmRfbW9yZScpLAogICAgXQoKICAgIG9wZXJhdGlvbnMgPSBbCiAgICAgICAgbWlncmF0aW9ucy5BZGRGaWVsZCgKICAgICAgICAgICAgbW9kZWxfbmFtZT0nYmFua2ludGVncmF0aW9ub3JnYW5pemF0aW9uY29udGV4dCcsCiAgICAgICAgICAgIG5hbWU9J2VuYWJsZWQnLAogICAgICAgICAgICBmaWVsZD1tb2RlbHMuQm9vbGVhbkZpZWxkKGRlZmF1bHQ9VHJ1ZSksCiAgICAgICAgICAgIHByZXNlcnZlX2RlZmF1bHQ9RmFsc2UsCiAgICAgICAgKSwKICAgICAgICBtaWdyYXRpb25zLkFkZEZpZWxkKAogICAgICAgICAgICBtb2RlbF9uYW1lPSdiYW5raW50ZWdyYXRpb25vcmdhbml6YXRpb25jb250ZXh0aGlzdG9yeXJlY29yZCcsCiAgICAgICAgICAgIG5hbWU9J2VuYWJsZWQnLAogICAgICAgICAgICBmaWVsZD1tb2RlbHMuQm9vbGVhbkZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSksCiAgICAgICAgKSwKICAgIF0K

exports.up = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Add field enabled to bankintegrationorganizationcontext
--
ALTER TABLE "BankIntegrationOrganizationContext" ADD COLUMN "enabled" boolean DEFAULT true NOT NULL;
ALTER TABLE "BankIntegrationOrganizationContext" ALTER COLUMN "enabled" DROP DEFAULT;
--
-- Add field enabled to bankintegrationorganizationcontexthistoryrecord
--
ALTER TABLE "BankIntegrationOrganizationContextHistoryRecord" ADD COLUMN "enabled" boolean NULL;
COMMIT;

    `)
}

exports.down = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Add field enabled to bankintegrationorganizationcontexthistoryrecord
--
ALTER TABLE "BankIntegrationOrganizationContextHistoryRecord" DROP COLUMN "enabled" CASCADE;
--
-- Add field enabled to bankintegrationorganizationcontext
--
ALTER TABLE "BankIntegrationOrganizationContext" DROP COLUMN "enabled" CASCADE;
COMMIT;

    `)
}