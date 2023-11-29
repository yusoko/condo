// auto generated by kmigrator
// KMIGRATOR:0346_marketcategory_order_and_more:IyBHZW5lcmF0ZWQgYnkgRGphbmdvIDQuMi40IG9uIDIwMjMtMTEtMjggMTE6MTgKCmZyb20gZGphbmdvLmRiIGltcG9ydCBtaWdyYXRpb25zLCBtb2RlbHMKCgpjbGFzcyBNaWdyYXRpb24obWlncmF0aW9ucy5NaWdyYXRpb24pOgoKICAgIGRlcGVuZGVuY2llcyA9IFsKICAgICAgICAoJ19kamFuZ29fc2NoZW1hJywgJzAzNDVfYWx0ZXJfbm90aWZpY2F0aW9udXNlcnNldHRpbmdfbWVzc2FnZXR5cGUnKSwKICAgIF0KCiAgICBvcGVyYXRpb25zID0gWwogICAgICAgIG1pZ3JhdGlvbnMuQWRkRmllbGQoCiAgICAgICAgICAgIG1vZGVsX25hbWU9J21hcmtldGNhdGVnb3J5JywKICAgICAgICAgICAgbmFtZT0nb3JkZXInLAogICAgICAgICAgICBmaWVsZD1tb2RlbHMuSW50ZWdlckZpZWxkKGRlZmF1bHQ9MCksCiAgICAgICAgICAgIHByZXNlcnZlX2RlZmF1bHQ9RmFsc2UsCiAgICAgICAgKSwKICAgICAgICBtaWdyYXRpb25zLkFkZEZpZWxkKAogICAgICAgICAgICBtb2RlbF9uYW1lPSdtYXJrZXRjYXRlZ29yeWhpc3RvcnlyZWNvcmQnLAogICAgICAgICAgICBuYW1lPSdvcmRlcicsCiAgICAgICAgICAgIGZpZWxkPW1vZGVscy5JbnRlZ2VyRmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSwKICAgICAgICApLAogICAgXQo=

exports.up = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Add field order to marketcategory
--
ALTER TABLE "MarketCategory" ADD COLUMN "order" integer DEFAULT 0 NOT NULL;
ALTER TABLE "MarketCategory" ALTER COLUMN "order" DROP DEFAULT;
--
-- Add field order to marketcategoryhistoryrecord
--
ALTER TABLE "MarketCategoryHistoryRecord" ADD COLUMN "order" integer NULL;
COMMIT;

    `)
}

exports.down = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Add field order to marketcategoryhistoryrecord
--
ALTER TABLE "MarketCategoryHistoryRecord" DROP COLUMN "order" CASCADE;
--
-- Add field order to marketcategory
--
ALTER TABLE "MarketCategory" DROP COLUMN "order" CASCADE;
COMMIT;

    `)
}
