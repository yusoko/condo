const { AbstractSuggestionProvider } = require('@address-service/domains/common/utils/services/suggest/AbstractSuggestionProvider')
const conf = require('@open-condo/config')
const get = require('lodash/get')
const fetch = require('node-fetch')
const { DADATA_PROVIDER } = require('@address-service/domains/common/constants/providers')

/**
 * @typedef {Object} DadataObjectData
 * @link https://dadata.ru/api/suggest/address/
 * @property {string} postal_code null
 * @property {string} country "Россия"
 * @property {string} country_iso_code "RU"
 * @property {string} federal_district null
 * @property {string} region_fias_id "0c5b2444-70a0-4932-980c-b4dc0d3f02b5"
 * @property {string} region_kladr_id "7700000000000"
 * @property {string} region_iso_code "RU-MOW"
 * @property {string} region_with_type "г Москва"
 * @property {string} region_type "г"
 * @property {string} region_type_full "город"
 * @property {string} region "Москва"
 * @property {string} area_fias_id null
 * @property {string} area_kladr_id null
 * @property {string} area_with_type null
 * @property {string} area_type null
 * @property {string} area_type_full null
 * @property {string} area null
 * @property {string} city_fias_id "0c5b2444-70a0-4932-980c-b4dc0d3f02b5"
 * @property {string} city_kladr_id "7700000000000"
 * @property {string} city_with_type "г Москва"
 * @property {string} city_type "г"
 * @property {string} city_type_full "город"
 * @property {string} city "Москва"
 * @property {string} city_area null
 * @property {string} city_district_fias_id null
 * @property {string} city_district_kladr_id null
 * @property {string} city_district_with_type null
 * @property {string} city_district_type null
 * @property {string} city_district_type_full null
 * @property {string} city_district null
 * @property {string} settlement_fias_id null
 * @property {string} settlement_kladr_id null
 * @property {string} settlement_with_type null
 * @property {string} settlement_type null
 * @property {string} settlement_type_full null
 * @property {string} settlement null
 * @property {string} street_fias_id "32fcb102-2a50-44c9-a00e-806420f448ea"
 * @property {string} street_kladr_id "77000000000713400"
 * @property {string} street_with_type "ул Хабаровская"
 * @property {string} street_type "ул"
 * @property {string} street_type_full "улица"
 * @property {string} street "Хабаровская"
 * @property {string} stead_fias_id null
 * @property {string} stead_cadnum null
 * @property {string} stead_type null
 * @property {string} stead_type_full null
 * @property {string} stead null
 * @property {string} house_fias_id null
 * @property {string} house_kladr_id null
 * @property {string} house_cadnum null
 * @property {string} house_type null
 * @property {string} house_type_full null
 * @property {string} house null
 * @property {string} block_type null
 * @property {string} block_type_full null
 * @property {string} block null
 * @property {string} entrance null
 * @property {string} floor null
 * @property {string} flat_fias_id null
 * @property {string} flat_cadnum null
 * @property {string} flat_type null
 * @property {string} flat_type_full null
 * @property {string} flat null
 * @property {string} flat_area null
 * @property {string} square_meter_price null
 * @property {string} flat_price null
 * @property {string} postal_box null
 * @property {string} fias_id "32fcb102-2a50-44c9-a00e-806420f448ea"
 * @property {string} fias_code null
 * @property {string} fias_level "7"
 * @property {string} fias_actuality_state "0"
 * @property {string} kladr_id "77000000000713400"
 * @property {string} geoname_id "524901"
 * @property {string} capital_marker "0"
 * @property {string} okato "45263564000"
 * @property {string} oktmo "45305000"
 * @property {string} tax_office "7718"
 * @property {string} tax_office_legal "7718"
 * @property {string} timezone null
 * @property {string} geo_lat "55.821168"
 * @property {string} geo_lon "37.82608"
 * @property {string} beltway_hit null
 * @property {string} beltway_distance null
 * @property {string} metro null
 * @property {string} divisions null
 * @property {string} qc_geo "2"
 * @property {string} qc_complete null
 * @property {string} qc_house null
 * @property {Array<string>} history_values: ["ул Черненко"]
 * @property {string} unparsed_parts null
 * @property {string} source null
 * @property {string} qc null
 */

/**
 * @typedef {Object} DadataObject
 * @property {string} value "г Москва, ул Хабаровская"
 * @property {string} unrestricted_value "г Москва, ул Хабаровская"
 * @property {DadataObjectData} data
 */

const CONFIG_KEY = 'DADATA_SUGGESTIONS'
const CONFIG_KEY_URL = 'url'
const CONFIG_KEY_TOKEN = 'token'

/**
 * The dadata suggestions provider
 * @link https://dadata.ru/api/suggest/address/
 */
class DadataSuggestionProvider extends AbstractSuggestionProvider {
    constructor () {
        super()

        const dadataConfigStr = get(conf, CONFIG_KEY)
        if (!dadataConfigStr) {
            throw new Error(`There is no '${CONFIG_KEY}' in config.`)
        }

        /**
         * @type {{url:string, token:string} | null}
         */
        const dadataConfigJson = JSON.parse(dadataConfigStr)

        const url = get(dadataConfigJson, CONFIG_KEY_URL)
        if (!url) {
            throw new Error(`There is no '${CONFIG_KEY_URL}' in '${CONFIG_KEY}'.`)
        }

        const token = get(dadataConfigJson, CONFIG_KEY_TOKEN)
        if (!token) {
            throw new Error(`There is no '${CONFIG_KEY_TOKEN}' in '${CONFIG_KEY}'.`)
        }

        this.url = url
        this.token = token
    }

    getProviderName () {
        return DADATA_PROVIDER
    }

    /**
     * @returns {Promise<DadataObject[]>}
     */
    async get ({ query, context = null, count = 20 }) {
        const result = await fetch(
            this.url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Token ${this.token}`,
                },
                body: JSON.stringify(
                    {
                        query,
                        ...this.getContext(context),
                        ...(isNaN(count) ? {} : { count }),
                    },
                ),
            },
        )

        //TODO?(nas): add some calls counter (maybe datadog)

        const status = result.status
        if (status === 200) {
            const response = await result.json()
            return get(response, 'suggestions', [])
        } else if (status === 403) {
            /**
             * See all cases for 403 error
             * @link https://dadata.ru/api/suggest/address/#return
             */

            /**
             * In the case of 403, we may check if our limit exceeded
             * If yes, we should create a separate token rotator for dadata provider (search & suggest)
             * @link https://dadata.ru/api/stat/
             */
        } else {
            //TODO(AleX83Xpert) maybe need to log erroneous status
            return []
        }
    }

    /**
     * @param {DadataObject[]} data
     * @returns {NormalizedBuilding[]}
     */
    normalize (data) {
        // I wanna to decrease a dependency from possible data changes got from dadata
        // So, transform data field-by-field
        // Yes, at the beginning it will be 1-to-1 copying
        return data.map((item) => (
            {
                value: get(item, 'value'),
                unrestricted_value: get(item, 'unrestricted_value'),
                data: {
                    postal_code: get(item, ['data', 'postal_code']),
                    country: get(item, ['data', 'country']),
                    country_iso_code: get(item, ['data', 'country_iso_code']),
                    federal_district: get(item, ['data', 'federal_district']),
                    region_fias_id: get(item, ['data', 'region_fias_id']),
                    region_kladr_id: get(item, ['data', 'region_kladr_id']),
                    region_iso_code: get(item, ['data', 'region_iso_code']),
                    region_with_type: get(item, ['data', 'region_with_type']),
                    region_type: get(item, ['data', 'region_type']),
                    region_type_full: get(item, ['data', 'region_type_full']),
                    region: get(item, ['data', 'region']),
                    area_fias_id: get(item, ['data', 'area_fias_id']),
                    area_kladr_id: get(item, ['data', 'area_kladr_id']),
                    area_with_type: get(item, ['data', 'area_with_type']),
                    area_type: get(item, ['data', 'area_type']),
                    area_type_full: get(item, ['data', 'area_type_full']),
                    area: get(item, ['data', 'area']),
                    city_fias_id: get(item, ['data', 'city_fias_id']),
                    city_kladr_id: get(item, ['data', 'city_kladr_id']),
                    city_with_type: get(item, ['data', 'city_with_type']),
                    city_type: get(item, ['data', 'city_type']),
                    city_type_full: get(item, ['data', 'city_type_full']),
                    city: get(item, ['data', 'city']),
                    city_area: get(item, ['data', 'city_area']),
                    city_district_fias_id: get(item, ['data', 'city_district_fias_id']),
                    city_district_kladr_id: get(item, ['data', 'city_district_kladr_id']),
                    city_district_with_type: get(item, ['data', 'city_district_with_type']),
                    city_district_type: get(item, ['data', 'city_district_type']),
                    city_district_type_full: get(item, ['data', 'city_district_type_full']),
                    city_district: get(item, ['data', 'city_district']),
                    settlement_fias_id: get(item, ['data', 'settlement_fias_id']),
                    settlement_kladr_id: get(item, ['data', 'settlement_kladr_id']),
                    settlement_with_type: get(item, ['data', 'settlement_with_type']),
                    settlement_type: get(item, ['data', 'settlement_type']),
                    settlement_type_full: get(item, ['data', 'settlement_type_full']),
                    settlement: get(item, ['data', 'settlement']),
                    street_fias_id: get(item, ['data', 'street_fias_id']),
                    street_kladr_id: get(item, ['data', 'street_kladr_id']),
                    street_with_type: get(item, ['data', 'street_with_type']),
                    street_type: get(item, ['data', 'street_type']),
                    street_type_full: get(item, ['data', 'street_type_full']),
                    street: get(item, ['data', 'street']),
                    stead_fias_id: get(item, ['data', 'stead_fias_id']),
                    stead_cadnum: get(item, ['data', 'stead_cadnum']),
                    stead_type: get(item, ['data', 'stead_type']),
                    stead_type_full: get(item, ['data', 'stead_type_full']),
                    stead: get(item, ['data', 'stead']),
                    house_fias_id: get(item, ['data', 'house_fias_id']),
                    house_kladr_id: get(item, ['data', 'house_kladr_id']),
                    house_cadnum: get(item, ['data', 'house_cadnum']),
                    house_type: get(item, ['data', 'house_type']),
                    house_type_full: get(item, ['data', 'house_type_full']),
                    house: get(item, ['data', 'house']),
                    block_type: get(item, ['data', 'block_type']),
                    block_type_full: get(item, ['data', 'block_type_full']),
                    block: get(item, ['data', 'block']),
                    entrance: get(item, ['data', 'entrance']),
                    floor: get(item, ['data', 'floor']),
                    flat_fias_id: get(item, ['data', 'flat_fias_id']),
                    flat_cadnum: get(item, ['data', 'flat_cadnum']),
                    flat_type: get(item, ['data', 'flat_type']),
                    flat_type_full: get(item, ['data', 'flat_type_full']),
                    flat: get(item, ['data', 'flat']),
                    flat_area: get(item, ['data', 'flat_area']),
                    square_meter_price: get(item, ['data', 'square_meter_price']),
                    flat_price: get(item, ['data', 'flat_price']),
                    postal_box: get(item, ['data', 'postal_box']),
                    fias_id: get(item, ['data', 'fias_id']),
                    fias_code: get(item, ['data', 'fias_code']),
                    fias_level: get(item, ['data', 'fias_level']),
                    fias_actuality_state: get(item, ['data', 'fias_actuality_state']),
                    kladr_id: get(item, ['data', 'kladr_id']),
                    geoname_id: get(item, ['data', 'geoname_id']),
                    capital_marker: get(item, ['data', 'capital_marker']),
                    okato: get(item, ['data', 'okato']),
                    oktmo: get(item, ['data', 'oktmo']),
                    tax_office: get(item, ['data', 'tax_office']),
                    tax_office_legal: get(item, ['data', 'tax_office_legal']),
                    timezone: get(item, ['data', 'timezone']),
                    geo_lat: get(item, ['data', 'geo_lat']),
                    geo_lon: get(item, ['data', 'geo_lon']),
                    beltway_hit: get(item, ['data', 'beltway_hit']),
                    beltway_distance: get(item, ['data', 'beltway_distance']),
                    metro: get(item, ['data', 'metro']),
                    divisions: get(item, ['data', 'divisions']),
                    qc_geo: get(item, ['data', 'qc_geo']),
                    qc_complete: get(item, ['data', 'qc_complete']),
                    qc_house: get(item, ['data', 'qc_house']),
                    history_values: get(item, ['data', 'history_values']),
                    unparsed_parts: get(item, ['data', 'unparsed_parts']),
                    source: get(item, ['data', 'source']),
                    qc: get(item, ['data', 'qc']),
                },
                provider: {
                    name: DADATA_PROVIDER,
                    rawData: item,
                },
            }
        ))
    }
}

module.exports = { DadataSuggestionProvider }
