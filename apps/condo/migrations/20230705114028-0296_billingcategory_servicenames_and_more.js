// auto generated by kmigrator
// KMIGRATOR:0296_billingcategory_servicenames_and_more:IyBHZW5lcmF0ZWQgYnkgRGphbmdvIDQuMS4zIG9uIDIwMjMtMDctMDUgMDY6NDAKCmZyb20gZGphbmdvLmRiIGltcG9ydCBtaWdyYXRpb25zLCBtb2RlbHMKCgpjbGFzcyBNaWdyYXRpb24obWlncmF0aW9ucy5NaWdyYXRpb24pOgoKICAgIGRlcGVuZGVuY2llcyA9IFsKICAgICAgICAoJ19kamFuZ29fc2NoZW1hJywgJzAyOTVfcmVuYW1lX2ZpbGVfYmlsbGluZ3JlY2VpcHRmaWxlX3NlbnNpdGl2ZWRhdGFmaWxlX2FuZF9tb3JlJyksCiAgICBdCgogICAgb3BlcmF0aW9ucyA9IFsKICAgICAgICBtaWdyYXRpb25zLkFkZEZpZWxkKAogICAgICAgICAgICBtb2RlbF9uYW1lPSdiaWxsaW5nY2F0ZWdvcnknLAogICAgICAgICAgICBuYW1lPSdzZXJ2aWNlTmFtZXMnLAogICAgICAgICAgICBmaWVsZD1tb2RlbHMuSlNPTkZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSksCiAgICAgICAgKSwKICAgICAgICBtaWdyYXRpb25zLkFkZEZpZWxkKAogICAgICAgICAgICBtb2RlbF9uYW1lPSdiaWxsaW5nY2F0ZWdvcnloaXN0b3J5cmVjb3JkJywKICAgICAgICAgICAgbmFtZT0nc2VydmljZU5hbWVzJywKICAgICAgICAgICAgZmllbGQ9bW9kZWxzLkpTT05GaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpLAogICAgICAgICksCiAgICBdCg==

exports.up = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Add field serviceNames to billingcategory
--
ALTER TABLE "BillingCategory" ADD COLUMN "serviceNames" jsonb NULL;
  
INSERT INTO public."BillingCategory" (dv, sender, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy")
VALUES (1::integer, '{"dv": 1, "fingerprint":"sql-migration"}'::jsonb, 'billing.category.heating.name'::text,
        '1b2371e0-8dc6-497a-bab2-de7421c622a5'::uuid, 1::integer, null::timestamp with time zone,
        null::timestamp with time zone, null::timestamp with time zone, null::uuid, null::uuid, null::uuid);
  
INSERT INTO public."BillingCategory" (dv, sender, name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", "createdBy", "updatedBy")
VALUES (1::integer, '{"dv": 1, "fingerprint":"sql-migration"}'::jsonb, 'billing.category.membership_fee.name'::text,
        'ceede926-055d-417b-b6ef-b2161ed7b684'::uuid, 1::integer, null::timestamp with time zone,
        null::timestamp with time zone, null::timestamp with time zone, null::uuid, null::uuid, null::uuid);
                
--
-- Add field serviceNames to billingcategoryhistoryrecord
--
ALTER TABLE "BillingCategoryHistoryRecord" ADD COLUMN "serviceNames" jsonb NULL;
COMMIT;

    `)
}

exports.down = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Add field serviceNames to billingcategoryhistoryrecord
--
DELETE FROM public."BillingCategory" WHERE id='1b2371e0-8dc6-497a-bab2-de7421c622a5';
DELETE FROM public."BillingCategory" WHERE id='ceede926-055d-417b-b6ef-b2161ed7b684';
COMMIT;
ALTER TABLE "BillingCategoryHistoryRecord" DROP COLUMN "serviceNames" CASCADE;

--
-- Add field serviceNames to billingcategory
--
ALTER TABLE "BillingCategory" DROP COLUMN "serviceNames" CASCADE;
COMMIT;

    `)
}
