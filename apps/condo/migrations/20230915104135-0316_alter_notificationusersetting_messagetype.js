// auto generated by kmigrator
// KMIGRATOR:0316_alter_notificationusersetting_messagetype:IyBHZW5lcmF0ZWQgYnkgRGphbmdvIDQuMi4zIG9uIDIwMjMtMDktMTUgMDU6NDEKCmZyb20gZGphbmdvLmRiIGltcG9ydCBtaWdyYXRpb25zLCBtb2RlbHMKCgpjbGFzcyBNaWdyYXRpb24obWlncmF0aW9ucy5NaWdyYXRpb24pOgoKICAgIGRlcGVuZGVuY2llcyA9IFsKICAgICAgICAoJ19kamFuZ29fc2NoZW1hJywgJzAzMTVfYXV0b18yMDIzMDkxNF8wNjI0JyksCiAgICBdCgogICAgb3BlcmF0aW9ucyA9IFsKICAgICAgICBtaWdyYXRpb25zLkFsdGVyRmllbGQoCiAgICAgICAgICAgIG1vZGVsX25hbWU9J25vdGlmaWNhdGlvbnVzZXJzZXR0aW5nJywKICAgICAgICAgICAgbmFtZT0nbWVzc2FnZVR5cGUnLAogICAgICAgICAgICBmaWVsZD1tb2RlbHMuQ2hhckZpZWxkKGJsYW5rPVRydWUsIGNob2ljZXM9WygnSU5WSVRFX05FV19FTVBMT1lFRScsICdJTlZJVEVfTkVXX0VNUExPWUVFJyksICgnU0hBUkVfVElDS0VUJywgJ1NIQVJFX1RJQ0tFVCcpLCAoJ0JBTktfQUNDT1VOVF9DUkVBVElPTl9SRVFVRVNUJywgJ0JBTktfQUNDT1VOVF9DUkVBVElPTl9SRVFVRVNUJyksICgnRElSVFlfSU5WSVRFX05FV19FTVBMT1lFRV9TTVMnLCAnRElSVFlfSU5WSVRFX05FV19FTVBMT1lFRV9TTVMnKSwgKCdESVJUWV9JTlZJVEVfTkVXX0VNUExPWUVFX0VNQUlMJywgJ0RJUlRZX0lOVklURV9ORVdfRU1QTE9ZRUVfRU1BSUwnKSwgKCdSRUdJU1RFUl9ORVdfVVNFUicsICdSRUdJU1RFUl9ORVdfVVNFUicpLCAoJ1JFU0VUX1BBU1NXT1JEJywgJ1JFU0VUX1BBU1NXT1JEJyksICgnU01TX1ZFUklGWScsICdTTVNfVkVSSUZZJyksICgnREVWRUxPUEVSX0lNUE9SVEFOVF9OT1RFX1RZUEUnLCAnREVWRUxPUEVSX0lNUE9SVEFOVF9OT1RFX1RZUEUnKSwgKCdDVVNUT01FUl9JTVBPUlRBTlRfTk9URV9UWVBFJywgJ0NVU1RPTUVSX0lNUE9SVEFOVF9OT1RFX1RZUEUnKSwgKCdNRVNTQUdFX0ZPUldBUkRFRF9UT19TVVBQT1JUJywgJ01FU1NBR0VfRk9SV0FSREVEX1RPX1NVUFBPUlQnKSwgKCdUSUNLRVRfQVNTSUdORUVfQ09OTkVDVEVEJywgJ1RJQ0tFVF9BU1NJR05FRV9DT05ORUNURUQnKSwgKCdUSUNLRVRfRVhFQ1VUT1JfQ09OTkVDVEVEJywgJ1RJQ0tFVF9FWEVDVVRPUl9DT05ORUNURUQnKSwgKCdUUkFDS19USUNLRVRfSU5fRE9NQV9BUFAnLCAnVFJBQ0tfVElDS0VUX0lOX0RPTUFfQVBQJyksICgnVElDS0VUX1NUQVRVU19PUEVORUQnLCAnVElDS0VUX1NUQVRVU19PUEVORUQnKSwgKCdUSUNLRVRfU1RBVFVTX0lOX1BST0dSRVNTJywgJ1RJQ0tFVF9TVEFUVVNfSU5fUFJPR1JFU1MnKSwgKCdUSUNLRVRfU1RBVFVTX0NPTVBMRVRFRCcsICdUSUNLRVRfU1RBVFVTX0NPTVBMRVRFRCcpLCAoJ1RJQ0tFVF9TVEFUVVNfUkVUVVJORUQnLCAnVElDS0VUX1NUQVRVU19SRVRVUk5FRCcpLCAoJ1RJQ0tFVF9TVEFUVVNfREVDTElORUQnLCAnVElDS0VUX1NUQVRVU19ERUNMSU5FRCcpLCAoJ1RJQ0tFVF9DT01NRU5UX0FEREVEJywgJ1RJQ0tFVF9DT01NRU5UX0FEREVEJyksICgnTUVURVJfVkVSSUZJQ0FUSU9OX0RBVEVfUkVNSU5ERVInLCAnTUVURVJfVkVSSUZJQ0FUSU9OX0RBVEVfUkVNSU5ERVInKSwgKCdSRVNJREVOVF9BRERfQklMTElOR19BQ0NPVU5UJywgJ1JFU0lERU5UX0FERF9CSUxMSU5HX0FDQ09VTlQnKSwgKCdCSUxMSU5HX1JFQ0VJUFRfQVZBSUxBQkxFJywgJ0JJTExJTkdfUkVDRUlQVF9BVkFJTEFCTEUnKSwgKCdCSUxMSU5HX1JFQ0VJUFRfQVZBSUxBQkxFX05PX0FDQ09VTlQnLCAnQklMTElOR19SRUNFSVBUX0FWQUlMQUJMRV9OT19BQ0NPVU5UJyksICgnQklMTElOR19SRUNFSVBUX0NBVEVHT1JZX0FWQUlMQUJMRScsICdCSUxMSU5HX1JFQ0VJUFRfQ0FURUdPUllfQVZBSUxBQkxFJyksICgnQklMTElOR19SRUNFSVBUX0FEREVEJywgJ0JJTExJTkdfUkVDRUlQVF9BRERFRCcpLCAoJ0JJTExJTkdfUkVDRUlQVF9BRERFRF9XSVRIX0RFQlQnLCAnQklMTElOR19SRUNFSVBUX0FEREVEX1dJVEhfREVCVCcpLCAoJ0JJTExJTkdfUkVDRUlQVF9BRERFRF9XSVRIX05PX0RFQlQnLCAnQklMTElOR19SRUNFSVBUX0FEREVEX1dJVEhfTk9fREVCVCcpLCAoJ01FVEVSX1NVQk1JVF9SRUFESU5HU19SRU1JTkRFUicsICdNRVRFUl9TVUJNSVRfUkVBRElOR1NfUkVNSU5ERVInKSwgKCdNRVRFUl9TVUJNSVRfUkVBRElOR1NfUkVNSU5ERVJfU1RBUlRfUEVSSU9EJywgJ01FVEVSX1NVQk1JVF9SRUFESU5HU19SRU1JTkRFUl9TVEFSVF9QRVJJT0QnKSwgKCdNRVRFUl9TVUJNSVRfUkVBRElOR1NfUkVNSU5ERVJfRU5EX1BFUklPRCcsICdNRVRFUl9TVUJNSVRfUkVBRElOR1NfUkVNSU5ERVJfRU5EX1BFUklPRCcpLCAoJ01FVEVSX1ZFUklGSUNBVElPTl9EQVRFX0VYUElSRUQnLCAnTUVURVJfVkVSSUZJQ0FUSU9OX0RBVEVfRVhQSVJFRCcpLCAoJ1JFU0lERU5UX1VQR1JBREVfQVBQJywgJ1JFU0lERU5UX1VQR1JBREVfQVBQJyksICgnU1RBRkZfVVBHUkFERV9BUFAnLCAnU1RBRkZfVVBHUkFERV9BUFAnKSwgKCdDVVNUT01fQ09OVEVOVF9NRVNTQUdFX1BVU0gnLCAnQ1VTVE9NX0NPTlRFTlRfTUVTU0FHRV9QVVNIJyksICgnQ1VTVE9NX0NPTlRFTlRfTUVTU0FHRV9FTUFJTCcsICdDVVNUT01fQ09OVEVOVF9NRVNTQUdFX0VNQUlMJyksICgnQ1VTVE9NX0NPTlRFTlRfTUVTU0FHRV9TTVMnLCAnQ1VTVE9NX0NPTlRFTlRfTUVTU0FHRV9TTVMnKSwgKCdWT0lQX0lOQ09NSU5HX0NBTExfTUVTU0FHRScsICdWT0lQX0lOQ09NSU5HX0NBTExfTUVTU0FHRScpLCAoJ0IyQ19BUFBfTUVTU0FHRV9QVVNIJywgJ0IyQ19BUFBfTUVTU0FHRV9QVVNIJyksICgnUkVDVVJSRU5UX1BBWU1FTlRfUFJPQ0VFRElOR19TVUNDRVNTX1JFU1VMVF9NRVNTQUdFJywgJ1JFQ1VSUkVOVF9QQVlNRU5UX1BST0NFRURJTkdfU1VDQ0VTU19SRVNVTFRfTUVTU0FHRScpLCAoJ1JFQ1VSUkVOVF9QQVlNRU5UX1BST0NFRURJTkdfVU5LTk9XTl9FUlJPUl9NRVNTQUdFJywgJ1JFQ1VSUkVOVF9QQVlNRU5UX1BST0NFRURJTkdfVU5LTk9XTl9FUlJPUl9NRVNTQUdFJyksICgnUkVDVVJSRU5UX1BBWU1FTlRfUFJPQ0VFRElOR19BQ1FVSVJJTkdfUEFZTUVOVF9QUk9DRUVEX0VSUk9SX01FU1NBR0UnLCAnUkVDVVJSRU5UX1BBWU1FTlRfUFJPQ0VFRElOR19BQ1FVSVJJTkdfUEFZTUVOVF9QUk9DRUVEX0VSUk9SX01FU1NBR0UnKSwgKCdSRUNVUlJFTlRfUEFZTUVOVF9QUk9DRUVESU5HX1NFUlZJQ0VfQ09OU1VNRVJfTk9UX0ZPVU5EX0VSUk9SX01FU1NBR0UnLCAnUkVDVVJSRU5UX1BBWU1FTlRfUFJPQ0VFRElOR19TRVJWSUNFX0NPTlNVTUVSX05PVF9GT1VORF9FUlJPUl9NRVNTQUdFJyksICgnUkVDVVJSRU5UX1BBWU1FTlRfUFJPQ0VFRElOR19MSU1JVF9FWENFRURFRF9FUlJPUl9NRVNTQUdFJywgJ1JFQ1VSUkVOVF9QQVlNRU5UX1BST0NFRURJTkdfTElNSVRfRVhDRUVERURfRVJST1JfTUVTU0FHRScpLCAoJ1JFQ1VSUkVOVF9QQVlNRU5UX1BST0NFRURJTkdfQ09OVEVYVF9OT1RfRk9VTkRfRVJST1JfTUVTU0FHRScsICdSRUNVUlJFTlRfUEFZTUVOVF9QUk9DRUVESU5HX0NPTlRFWFRfTk9UX0ZPVU5EX0VSUk9SX01FU1NBR0UnKSwgKCdSRUNVUlJFTlRfUEFZTUVOVF9QUk9DRUVESU5HX0NPTlRFWFRfRElTQUJMRURfRVJST1JfTUVTU0FHRScsICdSRUNVUlJFTlRfUEFZTUVOVF9QUk9DRUVESU5HX0NPTlRFWFRfRElTQUJMRURfRVJST1JfTUVTU0FHRScpLCAoJ1JFQ1VSUkVOVF9QQVlNRU5UX1BST0NFRURJTkdfQ0FSRF9UT0tFTl9OT1RfVkFMSURfRVJST1JfTUVTU0FHRScsICdSRUNVUlJFTlRfUEFZTUVOVF9QUk9DRUVESU5HX0NBUkRfVE9LRU5fTk9UX1ZBTElEX0VSUk9SX01FU1NBR0UnKSwgKCdSRUNVUlJFTlRfUEFZTUVOVF9QUk9DRUVESU5HX0NBTl9OT1RfUkVHSVNURVJfTVVMVElfUEFZTUVOVF9FUlJPUl9NRVNTQUdFJywgJ1JFQ1VSUkVOVF9QQVlNRU5UX1BST0NFRURJTkdfQ0FOX05PVF9SRUdJU1RFUl9NVUxUSV9QQVlNRU5UX0VSUk9SX01FU1NBR0UnKSwgKCdSRUNVUlJFTlRfUEFZTUVOVF9QUk9DRUVESU5HX05PX1JFQ0VJUFRTX1RPX1BST0NFRURfRVJST1JfTUVTU0FHRScsICdSRUNVUlJFTlRfUEFZTUVOVF9QUk9DRUVESU5HX05PX1JFQ0VJUFRTX1RPX1BST0NFRURfRVJST1JfTUVTU0FHRScpLCAoJ1JFQ1VSUkVOVF9QQVlNRU5UX1RPTU9SUk9XX1BBWU1FTlRfTUVTU0FHRScsICdSRUNVUlJFTlRfUEFZTUVOVF9UT01PUlJPV19QQVlNRU5UX01FU1NBR0UnKSwgKCdSRUNVUlJFTlRfUEFZTUVOVF9UT01PUlJPV19QQVlNRU5UX05PX1JFQ0VJUFRTX01FU1NBR0UnLCAnUkVDVVJSRU5UX1BBWU1FTlRfVE9NT1JST1dfUEFZTUVOVF9OT19SRUNFSVBUU19NRVNTQUdFJyksICgnUkVDVVJSRU5UX1BBWU1FTlRfVE9NT1JST1dfUEFZTUVOVF9MSU1JVF9FWENFRURfTUVTU0FHRScsICdSRUNVUlJFTlRfUEFZTUVOVF9UT01PUlJPV19QQVlNRU5UX0xJTUlUX0VYQ0VFRF9NRVNTQUdFJyksICgnTkVXU19JVEVNX0NPTU1PTl9NRVNTQUdFX1RZUEUnLCAnTkVXU19JVEVNX0NPTU1PTl9NRVNTQUdFX1RZUEUnKSwgKCdORVdTX0lURU1fRU1FUkdFTkNZX01FU1NBR0VfVFlQRScsICdORVdTX0lURU1fRU1FUkdFTkNZX01FU1NBR0VfVFlQRScpLCAoJ0RFVl9QT1JUQUxfTUVTU0FHRScsICdERVZfUE9SVEFMX01FU1NBR0UnKSwgKCdTRU5EX0JJTExJTkdfUkVDRUlQVFNfT05fUEFZREFZX1JFTUlOREVSX01FU1NBR0UnLCAnU0VORF9CSUxMSU5HX1JFQ0VJUFRTX09OX1BBWURBWV9SRU1JTkRFUl9NRVNTQUdFJyldLCBtYXhfbGVuZ3RoPTEwMCwgbnVsbD1UcnVlKSwKICAgICAgICApLAogICAgXQo=

exports.up = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Alter field messageType on notificationusersetting
--
-- (no-op)
COMMIT;

    `)
}

exports.down = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Alter field messageType on notificationusersetting
--
-- (no-op)
COMMIT;

    `)
}