/**
 * Generated by `createschema address.Address 'source:Text; address:Text; key:Text; meta:Json'`
 * In most cases you should not change it by hands
 * Please, don't remove `AUTOGENERATE MARKER`s
 */
const conf = require('@open-condo/config')
const faker = require('faker')

const {
    generateGQLTestUtils,
} = require('@open-condo/codegen/generate.test.utils')

const { Address: AddressGQL } = require('@address-service/domains/address/gql')
const { AddressInjection: AddressInjectionGQL } = require('@address-service/domains/address/gql')
const { InjectionsSeeker } = require('@address-service/domains/common/utils/services/InjectionsSeeker')
const { AddressSource: AddressSourceGQL } = require('@address-service/domains/address/gql')
/* AUTOGENERATE MARKER <IMPORT> */

if (conf.DEFAULT_LOCALE) {
    faker.locale = conf.DEFAULT_LOCALE
}

const Address = generateGQLTestUtils(AddressGQL)
const AddressInjection = generateGQLTestUtils(AddressInjectionGQL)

const AddressSource = generateGQLTestUtils(AddressSourceGQL)

/* AUTOGENERATE MARKER <CONST> */

async function createTestAddress (client, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const address = `${faker.address.city()}, ${faker.address.streetName()}`

    const attrs = {
        dv: 1,
        sender,
        address,
        key: faker.random.alpha(10),
        meta: {},
        ...extraAttrs,
    }
    const obj = await Address.create(client, attrs)
    return [obj, attrs]
}

async function updateTestAddress (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await Address.update(client, id, attrs)
    return [obj, attrs]
}

/**
 * Creates emulation of address part type (ex.: sq., square, st., street, ...)
 * @param {number} length
 * @returns {string}
 */
function createAddressPartType (length = 2) {
    const stringLettersCodes = { min: 97, max: 122 }
    const capitalLettersCodes = { min: 65, max: 90 }
    let returnString = ''

    for (let i = 0; i < length; i++) {
        const newChar = String.fromCharCode(faker.datatype.number(faker.datatype.boolean() ? stringLettersCodes : capitalLettersCodes))
        returnString = `${returnString}${newChar}`
    }

    return returnString
}

/**
 * @param {String} name
 * @returns {{typeFull: String, typeShort: String, name: String}}
 */
function createTestAddressPartWithType (name) {
    return { name, typeShort: `${createAddressPartType(2)}.`, typeFull: createAddressPartType(8) }
}

async function createTestAddressInjection (client, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        country: faker.address.country(),
        region: createTestAddressPartWithType(faker.address.state()),
        area: createTestAddressPartWithType(faker.address.state()),
        city: createTestAddressPartWithType(faker.address.city()),
        cityDistrict: createTestAddressPartWithType(faker.address.state()),
        settlement: createTestAddressPartWithType(faker.address.city()),
        street: createTestAddressPartWithType(faker.address.streetName()),
        house: createTestAddressPartWithType(`${faker.datatype.number()}${faker.datatype.string(1)}`),
        block: createTestAddressPartWithType(faker.datatype.number()),
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await AddressInjection.create(client, attrs)
    return [obj, attrs]
}

async function updateTestAddressInjection (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await AddressInjection.update(client, id, attrs)
    return [obj, attrs]
}

/**
 * @param client
 * @param {String} s
 * @param {Boolean} doNormalization
 * @returns {Promise<NormalizedBuilding[]|AddressInjection[]>}
 */
async function getTestInjections (client, s, doNormalization = false) {
    if (!client) throw new Error('no client')
    if (!s) throw new Error('no string to search')

    const injectionsSeeker = new InjectionsSeeker(s)

    /**
     * @type {AddressInjection[]}
     */
    const denormalizedInjections = await AddressInjection.getAll(client, injectionsSeeker.buildWhere())

    return doNormalization ? injectionsSeeker.normalize(denormalizedInjections) : denormalizedInjections
}

async function createTestAddressSource (client, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const source = `${faker.address.city()}${faker.random.alphaNumeric(8)}, ${faker.address.streetName()}, ${faker.random.alphaNumeric(8)}`

    const attrs = {
        dv: 1,
        sender,
        source,
        ...extraAttrs,
    }
    const obj = await AddressSource.create(client, attrs)
    return [obj, attrs]
}

async function updateTestAddressSource (client, id, extraAttrs = {}) {
    if (!client) throw new Error('no client')
    if (!id) throw new Error('no id')
    const sender = { dv: 1, fingerprint: faker.random.alphaNumeric(8) }

    const attrs = {
        dv: 1,
        sender,
        ...extraAttrs,
    }
    const obj = await AddressSource.update(client, id, attrs)
    return [obj, attrs]
}

/* AUTOGENERATE MARKER <FACTORY> */

module.exports = {
    Address,
    createTestAddress,
    updateTestAddress,
    AddressInjection,
    createTestAddressInjection,
    updateTestAddressInjection,
    getTestInjections,
    createTestAddressPartWithType,
    AddressSource, createTestAddressSource, updateTestAddressSource,
    /* AUTOGENERATE MARKER <EXPORTS> */
}
