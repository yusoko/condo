// auto generated by kmigrator
// KMIGRATOR:0254_bankaccountreporttaskhistoryrecord_and_more:IyBHZW5lcmF0ZWQgYnkgRGphbmdvIDQuMSBvbiAyMDIzLTA0LTExIDEwOjQ2Cgpmcm9tIGRqYW5nby5kYiBpbXBvcnQgbWlncmF0aW9ucywgbW9kZWxzCmltcG9ydCBkamFuZ28uZGIubW9kZWxzLmRlbGV0aW9uCgoKY2xhc3MgTWlncmF0aW9uKG1pZ3JhdGlvbnMuTWlncmF0aW9uKToKCiAgICBkZXBlbmRlbmNpZXMgPSBbCiAgICAgICAgKCdfZGphbmdvX3NjaGVtYScsICcwMjUzX2F1dG9fMjAyMzA0MTFfMDYwOScpLAogICAgXQoKICAgIG9wZXJhdGlvbnMgPSBbCiAgICAgICAgbWlncmF0aW9ucy5DcmVhdGVNb2RlbCgKICAgICAgICAgICAgbmFtZT0nYmFua2FjY291bnRyZXBvcnR0YXNraGlzdG9yeXJlY29yZCcsCiAgICAgICAgICAgIGZpZWxkcz1bCiAgICAgICAgICAgICAgICAoJ2FjY291bnQnLCBtb2RlbHMuVVVJREZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdvcmdhbml6YXRpb24nLCBtb2RlbHMuVVVJREZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdzdGF0dXMnLCBtb2RlbHMuVGV4dEZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdwcm9ncmVzcycsIG1vZGVscy5JbnRlZ2VyRmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ3VzZXInLCBtb2RlbHMuVVVJREZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdtZXRhJywgbW9kZWxzLkpTT05GaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnaWQnLCBtb2RlbHMuVVVJREZpZWxkKHByaW1hcnlfa2V5PVRydWUsIHNlcmlhbGl6ZT1GYWxzZSkpLAogICAgICAgICAgICAgICAgKCd2JywgbW9kZWxzLkludGVnZXJGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnY3JlYXRlZEF0JywgbW9kZWxzLkRhdGVUaW1lRmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ3VwZGF0ZWRBdCcsIG1vZGVscy5EYXRlVGltZUZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdjcmVhdGVkQnknLCBtb2RlbHMuVVVJREZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCd1cGRhdGVkQnknLCBtb2RlbHMuVVVJREZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdkZWxldGVkQXQnLCBtb2RlbHMuRGF0ZVRpbWVGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnbmV3SWQnLCBtb2RlbHMuSlNPTkZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdkdicsIG1vZGVscy5JbnRlZ2VyRmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ3NlbmRlcicsIG1vZGVscy5KU09ORmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2hpc3RvcnlfZGF0ZScsIG1vZGVscy5EYXRlVGltZUZpZWxkKCkpLAogICAgICAgICAgICAgICAgKCdoaXN0b3J5X2FjdGlvbicsIG1vZGVscy5DaGFyRmllbGQoY2hvaWNlcz1bKCdjJywgJ2MnKSwgKCd1JywgJ3UnKSwgKCdkJywgJ2QnKV0sIG1heF9sZW5ndGg9NTApKSwKICAgICAgICAgICAgICAgICgnaGlzdG9yeV9pZCcsIG1vZGVscy5VVUlERmllbGQoZGJfaW5kZXg9VHJ1ZSkpLAogICAgICAgICAgICBdLAogICAgICAgICAgICBvcHRpb25zPXsKICAgICAgICAgICAgICAgICdkYl90YWJsZSc6ICdCYW5rQWNjb3VudFJlcG9ydFRhc2tIaXN0b3J5UmVjb3JkJywKICAgICAgICAgICAgfSwKICAgICAgICApLAogICAgICAgIG1pZ3JhdGlvbnMuQWRkRmllbGQoCiAgICAgICAgICAgIG1vZGVsX25hbWU9J2JhbmthY2NvdW50cmVwb3J0JywKICAgICAgICAgICAgbmFtZT0naXNMYXRlc3QnLAogICAgICAgICAgICBmaWVsZD1tb2RlbHMuQm9vbGVhbkZpZWxkKGRlZmF1bHQ9RmFsc2UpLAogICAgICAgICAgICBwcmVzZXJ2ZV9kZWZhdWx0PUZhbHNlLAogICAgICAgICksCiAgICAgICAgbWlncmF0aW9ucy5BZGRGaWVsZCgKICAgICAgICAgICAgbW9kZWxfbmFtZT0nYmFua2FjY291bnRyZXBvcnRoaXN0b3J5cmVjb3JkJywKICAgICAgICAgICAgbmFtZT0naXNMYXRlc3QnLAogICAgICAgICAgICBmaWVsZD1tb2RlbHMuQm9vbGVhbkZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSksCiAgICAgICAgKSwKICAgICAgICBtaWdyYXRpb25zLkFkZEZpZWxkKAogICAgICAgICAgICBtb2RlbF9uYW1lPSdvcmdhbml6YXRpb25lbXBsb3llZXJvbGUnLAogICAgICAgICAgICBuYW1lPSdjYW5NYW5hZ2VCYW5rQWNjb3VudFJlcG9ydFRhc2tzJywKICAgICAgICAgICAgZmllbGQ9bW9kZWxzLkJvb2xlYW5GaWVsZChkZWZhdWx0PUZhbHNlKSwKICAgICAgICAgICAgcHJlc2VydmVfZGVmYXVsdD1GYWxzZSwKICAgICAgICApLAogICAgICAgIG1pZ3JhdGlvbnMuQWRkRmllbGQoCiAgICAgICAgICAgIG1vZGVsX25hbWU9J29yZ2FuaXphdGlvbmVtcGxveWVlcm9sZWhpc3RvcnlyZWNvcmQnLAogICAgICAgICAgICBuYW1lPSdjYW5NYW5hZ2VCYW5rQWNjb3VudFJlcG9ydFRhc2tzJywKICAgICAgICAgICAgZmllbGQ9bW9kZWxzLkJvb2xlYW5GaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpLAogICAgICAgICksCiAgICAgICAgbWlncmF0aW9ucy5DcmVhdGVNb2RlbCgKICAgICAgICAgICAgbmFtZT0nYmFua2FjY291bnRyZXBvcnR0YXNrJywKICAgICAgICAgICAgZmllbGRzPVsKICAgICAgICAgICAgICAgICgnc3RhdHVzJywgbW9kZWxzLkNoYXJGaWVsZChjaG9pY2VzPVsoJ3Byb2Nlc3NpbmcnLCAncHJvY2Vzc2luZycpLCAoJ2NvbXBsZXRlZCcsICdjb21wbGV0ZWQnKSwgKCdlcnJvcicsICdlcnJvcicpLCAoJ2NhbmNlbGxlZCcsICdjYW5jZWxsZWQnKV0sIG1heF9sZW5ndGg9NTApKSwKICAgICAgICAgICAgICAgICgncHJvZ3Jlc3MnLCBtb2RlbHMuSW50ZWdlckZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdtZXRhJywgbW9kZWxzLkpTT05GaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnaWQnLCBtb2RlbHMuVVVJREZpZWxkKHByaW1hcnlfa2V5PVRydWUsIHNlcmlhbGl6ZT1GYWxzZSkpLAogICAgICAgICAgICAgICAgKCd2JywgbW9kZWxzLkludGVnZXJGaWVsZChkZWZhdWx0PTEpKSwKICAgICAgICAgICAgICAgICgnY3JlYXRlZEF0JywgbW9kZWxzLkRhdGVUaW1lRmllbGQoYmxhbms9VHJ1ZSwgZGJfaW5kZXg9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ3VwZGF0ZWRBdCcsIG1vZGVscy5EYXRlVGltZUZpZWxkKGJsYW5rPVRydWUsIGRiX2luZGV4PVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdkZWxldGVkQXQnLCBtb2RlbHMuRGF0ZVRpbWVGaWVsZChibGFuaz1UcnVlLCBkYl9pbmRleD1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnbmV3SWQnLCBtb2RlbHMuVVVJREZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdkdicsIG1vZGVscy5JbnRlZ2VyRmllbGQoKSksCiAgICAgICAgICAgICAgICAoJ3NlbmRlcicsIG1vZGVscy5KU09ORmllbGQoKSksCiAgICAgICAgICAgICAgICAoJ2FjY291bnQnLCBtb2RlbHMuRm9yZWlnbktleShkYl9jb2x1bW49J2FjY291bnQnLCBvbl9kZWxldGU9ZGphbmdvLmRiLm1vZGVscy5kZWxldGlvbi5DQVNDQURFLCByZWxhdGVkX25hbWU9JysnLCB0bz0nX2RqYW5nb19zY2hlbWEuYmFua2FjY291bnQnKSksCiAgICAgICAgICAgICAgICAoJ2NyZWF0ZWRCeScsIG1vZGVscy5Gb3JlaWduS2V5KGJsYW5rPVRydWUsIGRiX2NvbHVtbj0nY3JlYXRlZEJ5JywgbnVsbD1UcnVlLCBvbl9kZWxldGU9ZGphbmdvLmRiLm1vZGVscy5kZWxldGlvbi5TRVRfTlVMTCwgcmVsYXRlZF9uYW1lPScrJywgdG89J19kamFuZ29fc2NoZW1hLnVzZXInKSksCiAgICAgICAgICAgICAgICAoJ29yZ2FuaXphdGlvbicsIG1vZGVscy5Gb3JlaWduS2V5KGRiX2NvbHVtbj0nb3JnYW5pemF0aW9uJywgb25fZGVsZXRlPWRqYW5nby5kYi5tb2RlbHMuZGVsZXRpb24uQ0FTQ0FERSwgcmVsYXRlZF9uYW1lPScrJywgdG89J19kamFuZ29fc2NoZW1hLm9yZ2FuaXphdGlvbicpKSwKICAgICAgICAgICAgICAgICgndXBkYXRlZEJ5JywgbW9kZWxzLkZvcmVpZ25LZXkoYmxhbms9VHJ1ZSwgZGJfY29sdW1uPSd1cGRhdGVkQnknLCBudWxsPVRydWUsIG9uX2RlbGV0ZT1kamFuZ28uZGIubW9kZWxzLmRlbGV0aW9uLlNFVF9OVUxMLCByZWxhdGVkX25hbWU9JysnLCB0bz0nX2RqYW5nb19zY2hlbWEudXNlcicpKSwKICAgICAgICAgICAgICAgICgndXNlcicsIG1vZGVscy5Gb3JlaWduS2V5KGRiX2NvbHVtbj0ndXNlcicsIG9uX2RlbGV0ZT1kamFuZ28uZGIubW9kZWxzLmRlbGV0aW9uLkNBU0NBREUsIHJlbGF0ZWRfbmFtZT0nKycsIHRvPSdfZGphbmdvX3NjaGVtYS51c2VyJykpLAogICAgICAgICAgICBdLAogICAgICAgICAgICBvcHRpb25zPXsKICAgICAgICAgICAgICAgICdkYl90YWJsZSc6ICdCYW5rQWNjb3VudFJlcG9ydFRhc2snLAogICAgICAgICAgICB9LAogICAgICAgICksCiAgICBdCg==

exports.up = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Create model bankaccountreporttaskhistoryrecord
--
CREATE TABLE "BankAccountReportTaskHistoryRecord" ("account" uuid NULL, "organization" uuid NULL, "status" text NULL, "progress" integer NULL, "user" uuid NULL, "meta" jsonb NULL, "id" uuid NOT NULL PRIMARY KEY, "v" integer NULL, "createdAt" timestamp with time zone NULL, "updatedAt" timestamp with time zone NULL, "createdBy" uuid NULL, "updatedBy" uuid NULL, "deletedAt" timestamp with time zone NULL, "newId" jsonb NULL, "dv" integer NULL, "sender" jsonb NULL, "history_date" timestamp with time zone NOT NULL, "history_action" varchar(50) NOT NULL, "history_id" uuid NOT NULL);
--
-- Add field isLatest to bankaccountreport
--
ALTER TABLE "BankAccountReport" ADD COLUMN "isLatest" boolean DEFAULT false NOT NULL;
ALTER TABLE "BankAccountReport" ALTER COLUMN "isLatest" DROP DEFAULT;
--
-- Add field isLatest to bankaccountreporthistoryrecord
--
ALTER TABLE "BankAccountReportHistoryRecord" ADD COLUMN "isLatest" boolean NULL;
--
-- Add field canManageBankAccountReportTasks to organizationemployeerole
--
ALTER TABLE "OrganizationEmployeeRole" ADD COLUMN "canManageBankAccountReportTasks" boolean DEFAULT false NOT NULL;
ALTER TABLE "OrganizationEmployeeRole" ALTER COLUMN "canManageBankAccountReportTasks" DROP DEFAULT;
--
-- Add field canManageBankAccountReportTasks to organizationemployeerolehistoryrecord
--
ALTER TABLE "OrganizationEmployeeRoleHistoryRecord" ADD COLUMN "canManageBankAccountReportTasks" boolean NULL;
--
-- Create model bankaccountreporttask
--
CREATE TABLE "BankAccountReportTask" ("status" varchar(50) NOT NULL, "progress" integer NULL, "meta" jsonb NULL, "id" uuid NOT NULL PRIMARY KEY, "v" integer NOT NULL, "createdAt" timestamp with time zone NULL, "updatedAt" timestamp with time zone NULL, "deletedAt" timestamp with time zone NULL, "newId" uuid NULL, "dv" integer NOT NULL, "sender" jsonb NOT NULL, "account" uuid NOT NULL, "createdBy" uuid NULL, "organization" uuid NOT NULL, "updatedBy" uuid NULL, "user" uuid NOT NULL);
CREATE INDEX "BankAccountReportTaskHistoryRecord_history_id_fb252944" ON "BankAccountReportTaskHistoryRecord" ("history_id");
ALTER TABLE "BankAccountReportTask" ADD CONSTRAINT "BankAccountReportTask_account_6993f56a_fk_BankAccount_id" FOREIGN KEY ("account") REFERENCES "BankAccount" ("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "BankAccountReportTask" ADD CONSTRAINT "BankAccountReportTask_createdBy_9b9c7695_fk_User_id" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "BankAccountReportTask" ADD CONSTRAINT "BankAccountReportTask_organization_1a8da159_fk_Organization_id" FOREIGN KEY ("organization") REFERENCES "Organization" ("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "BankAccountReportTask" ADD CONSTRAINT "BankAccountReportTask_updatedBy_d9ce4990_fk_User_id" FOREIGN KEY ("updatedBy") REFERENCES "User" ("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "BankAccountReportTask" ADD CONSTRAINT "BankAccountReportTask_user_f19ff288_fk_User_id" FOREIGN KEY ("user") REFERENCES "User" ("id") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX "BankAccountReportTask_createdAt_e7af5fb1" ON "BankAccountReportTask" ("createdAt");
CREATE INDEX "BankAccountReportTask_updatedAt_43dfbebd" ON "BankAccountReportTask" ("updatedAt");
CREATE INDEX "BankAccountReportTask_deletedAt_6f7153dd" ON "BankAccountReportTask" ("deletedAt");
CREATE INDEX "BankAccountReportTask_account_6993f56a" ON "BankAccountReportTask" ("account");
CREATE INDEX "BankAccountReportTask_createdBy_9b9c7695" ON "BankAccountReportTask" ("createdBy");
CREATE INDEX "BankAccountReportTask_organization_1a8da159" ON "BankAccountReportTask" ("organization");
CREATE INDEX "BankAccountReportTask_updatedBy_d9ce4990" ON "BankAccountReportTask" ("updatedBy");
CREATE INDEX "BankAccountReportTask_user_f19ff288" ON "BankAccountReportTask" ("user");
COMMIT;

    `)
}

exports.down = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Create model bankaccountreporttask
--
DROP TABLE "BankAccountReportTask" CASCADE;
--
-- Add field canManageBankAccountReportTasks to organizationemployeerolehistoryrecord
--
ALTER TABLE "OrganizationEmployeeRoleHistoryRecord" DROP COLUMN "canManageBankAccountReportTasks" CASCADE;
--
-- Add field canManageBankAccountReportTasks to organizationemployeerole
--
ALTER TABLE "OrganizationEmployeeRole" DROP COLUMN "canManageBankAccountReportTasks" CASCADE;
--
-- Add field isLatest to bankaccountreporthistoryrecord
--
ALTER TABLE "BankAccountReportHistoryRecord" DROP COLUMN "isLatest" CASCADE;
--
-- Add field isLatest to bankaccountreport
--
ALTER TABLE "BankAccountReport" DROP COLUMN "isLatest" CASCADE;
--
-- Create model bankaccountreporttaskhistoryrecord
--
DROP TABLE "BankAccountReportTaskHistoryRecord" CASCADE;
COMMIT;

    `)
}
