/**
 * @jest-environment node
 */

const { makeClient, gql, setFakeClientMode } = require('@core/keystone/test.utils')
const conf = require('@core/config')
if (conf.TESTS_FAKE_CLIENT_MODE) setFakeClientMode(require.resolve('../index'))
const faker = require('faker')
const { makeLoggedInClient } = require('@core/keystone/test.utils')
const { makeLoggedInAdminClient } = require('@core/keystone/test.utils')
const { isMongo } = require('@core/keystone/test.utils')

const DATETIME_RE = /^[0-9]{4}-[01][0-9]-[0123][0-9]T[012][0-9]:[0-5][0-9]:[0-5][0-9][.][0-9]{3}Z$/i
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function genGetAllGQL (MODEL, MODELs, MODEL_FIELDS) {
    return gql`
        query getAll${MODELs}($where: ${MODEL}WhereInput, $first: Int, $skip: Int) {
            objs: all${MODELs}(where: $where, first: $first, skip: $skip) ${MODEL_FIELDS}
        }
    `
}

function genCreateGQL (MODEL, MODELs, MODEL_FIELDS) {
    return gql`
        mutation create${MODEL}($data: ${MODEL}CreateInput) {
            obj: create${MODEL}(data: $data) ${MODEL_FIELDS}
        }
    `
}

function genUpdateGQL (MODEL, MODELs, MODEL_FIELDS) {
    return gql`
        mutation update${MODEL}($id: ID!, $data: ${MODEL}UpdateInput) {
            obj: update${MODEL}(id: $id, data: $data) ${MODEL_FIELDS}
        }
    `
}

function genDeleteGQL (MODEL, MODELs, MODEL_FIELDS) {
    return gql`
        mutation delete${MODEL}($id: ID!) {
            obj: delete${MODEL}(id: $id) ${MODEL_FIELDS}
        }
    `
}

function genTestGQLUtils (MODEL, MODELs, MODEL_FIELDS) {
    const GET_ALL_OBJS_QUERY = genGetAllGQL(MODEL, MODELs, MODEL_FIELDS)
    const CREATE_OBJ_MUTATION = genCreateGQL(MODEL, MODELs, MODEL_FIELDS)
    const UPDATE_OBJ_MUTATION = genUpdateGQL(MODEL, MODELs, MODEL_FIELDS)
    const DELETE_OBJ_MUTATION = genDeleteGQL(MODEL, MODELs, MODEL_FIELDS)

    async function getAll (client, where, { raw = false } = {}) {
        const { data, errors } = await client.query(GET_ALL_OBJS_QUERY, { where: where })
        if (raw) return { data, errors }
        expect(errors).toEqual(undefined)
        return data.objs
    }

    async function create (client, attrs = {}, { raw = false } = {}) {
        const { data, errors } = await client.mutate(CREATE_OBJ_MUTATION, {
            data: { ...attrs },
        })
        if (raw) return { data, errors }
        expect(errors).toEqual(undefined)
        return data.obj
    }

    async function update (client, id, attrs = {}, { raw = false } = {}) {
        const { data, errors } = await client.mutate(UPDATE_OBJ_MUTATION, {
            id, data: { ...attrs },
        })
        if (raw) return { data, errors }
        expect(errors).toEqual(undefined)
        return data.obj
    }

    async function delete_ (client, id, { raw = false } = {}) {
        const { data, errors } = await client.mutate(DELETE_OBJ_MUTATION, { id })
        if (raw) return { data, errors }
        expect(errors).toEqual(undefined)
        return data.obj
    }

    return {
        MODEL_FIELDS,
        GET_ALL_OBJS_QUERY,
        CREATE_OBJ_MUTATION,
        UPDATE_OBJ_MUTATION,
        DELETE_OBJ_MUTATION,
        getAll, create, update,
        delete: delete_,
    }
}

const FIELDS = '{ id v text meta createdAt updatedAt createdBy { id } updatedBy { id } }'
const ITEM_FIELDS = `{ id v meta test ${FIELDS} }`
const Test = genTestGQLUtils('Test', 'Tests', FIELDS)
const TestItem = genTestGQLUtils('TestItem', 'TestItems', ITEM_FIELDS)

const HISTORY_FIELDS = '{ id v text history_id history_action history_date }'
const ITEM_HISTORY_FIELDS = '{ id v meta test history_id history_action history_date }'
const GET_ALL_TEST_HISTORY_OBJS_QUERY = genGetAllGQL('TestHistoryRecord', 'TestHistoryRecords', HISTORY_FIELDS)
const GET_ALL_TEST_ITEM_HISTORY_OBJS_QUERY = genGetAllGQL('TestItemHistoryRecord', 'TestItemHistoryRecords', ITEM_HISTORY_FIELDS)

async function getTestHistoryObjs (client, history_id) {
    const { data, errors } = await client.query(GET_ALL_TEST_HISTORY_OBJS_QUERY, { where: { history_id } })
    expect(errors).toEqual(undefined)
    return data.objs
}

async function getTestItemHistoryObjs (client, history_id) {
    const { data, errors } = await client.query(GET_ALL_TEST_ITEM_HISTORY_OBJS_QUERY, { where: { history_id } })
    expect(errors).toEqual(undefined)
    return data.objs
}

describe('Json field', () => {
    async function testJsonValue (value) {
        const client = await makeClient()
        let obj = await Test.create(client, { meta: value })
        expect(obj.meta).toStrictEqual(value)
    }

    test('object as value', async () => {
        await testJsonValue({ foo: 'foo', bar: 2, buz: false, no: null, yes: true })
    })
    test('object with array as value', async () => {
        if (isMongo()) return console.error('SKIP() Mongo: {} === null!')

        await testJsonValue({
            foo: ['foo', 1, 33.3],
            bar: 2,
            buz: false,
            no: [null, false],
            yes: true,
            e1: [],
            e2: {},
        })
    })
    test('{} as value', async () => {
        if (isMongo()) return console.error('SKIP() Mongo: {} === null!')
        await testJsonValue({})
    })
    test('null as value', async () => {
        await testJsonValue(null)
    })
    test('true as value', async () => {
        await testJsonValue(true)
    })
    test('false as value', async () => {
        await testJsonValue(false)
    })
    test('"" as value', async () => {
        await testJsonValue('')
    })
    test('[] as value', async () => {
        await testJsonValue([])
    })
    test('0 as value', async () => {
        await testJsonValue(0)
    })
    test('{"":[{}]} as value', async () => {
        await testJsonValue({ '': [{}] })
        await testJsonValue({ '': [{ '': [{}] }] })
    })
    test('number as value', async () => {
        await testJsonValue(faker.random.number())
        await testJsonValue(faker.random.float())
    })
    test('string as value', async () => {
        await testJsonValue(faker.internet.email())
        await testJsonValue(JSON.stringify(JSON.stringify(faker.internet.email())))
        await testJsonValue('\'')
        await testJsonValue('"')
        await testJsonValue('--')
        await testJsonValue('%')
        await testJsonValue('~')
        await testJsonValue('~~')
    })
    test('array as value', async () => {
        await testJsonValue(faker.random.arrayElements())
    })
})

describe('Json field exact match filter', () => {
    async function testFilterByValue (value, metaSuffix = '') {
        const client = await makeClient()
        const obj = await Test.create(client, { meta: value })
        const objs = await Test.getAll(client, { ['meta' + metaSuffix]: value })
        const objsIds = objs.map(x => x.id)
        const objsMetas = [...(new Set(objs.map(x => JSON.stringify(x.meta))))].map(JSON.parse)
        expect(objsIds).toContain(obj.id)
        expect(objsMetas).toStrictEqual([value])
    }

    test('object as value', async () => {
        if (isMongo()) return console.error('SKIP() Mongo: need a custom query parser!')

        await testFilterByValue({ foo: 'foo', bar: 2, buz: false, no: null, yes: true })
        // await testFilterByValue({ foo: 'foo', bar: 2, buz: false, no: null, yes: true }, '_in') // ok
    })
    test('object with array as value', async () => {
        if (isMongo()) return console.error('SKIP() Mongo: need a custom query parser!')

        await testFilterByValue({
            foo: ['foo', 1, 33.3],
            bar: 2,
            buz: false,
            no: [null, false],
            yes: true,
            e1: [],
            e2: {},
        })
        // await testFilterByValue({
        //         foo: ['foo', 1, 33.3],
        //         bar: 2,
        //         buz: false,
        //         no: [null, false],
        //         yes: true,
        //         e1: [],
        //         e2: {},
        //     },
        //     '_in',
        // ) // ok
    })
    test('{} as value', async () => {
        if (isMongo()) return console.error('SKIP() Mongo: {} === null!')

        await testFilterByValue({})
        // await testFilterByValue({}, '_in') // ok
    })
    test('null as value', async () => {
        await testFilterByValue(null)
        // await testFilterByValue(null, '_in') // err
    })
    test('true as value', async () => {
        await testFilterByValue(true)
        // await testFilterByValue(true, '_in') // err
    })
    test('false as value', async () => {
        await testFilterByValue(false)
        // await testFilterByValue(false, '_in') // ok
    })
    test('by ""', async () => {
        await testFilterByValue('')
        // await testFilterByValue('', '_in') // ok
    })
    test('by []', async () => {
        await testFilterByValue([])
        // await testFilterByValue([], '_in') // err
    })
    test('by 0', async () => {
        await testFilterByValue(0)
    })
    test('by {"":[{}]}', async () => {
        if (isMongo()) return console.error('SKIP() Mongo: {} === null!')

        await testFilterByValue({ '': [{}] })
        await testFilterByValue({ '': [{ '': [{}] }] })
    })
    test('by number', async () => {
        await testFilterByValue(faker.random.number())
        await testFilterByValue(faker.random.float())
    })
    test('by string', async () => {
        await testFilterByValue(faker.internet.email())
        await testFilterByValue(JSON.stringify(JSON.stringify(faker.internet.email())))
        await testFilterByValue('\'')
        await testFilterByValue('"')
        await testFilterByValue('--')
        await testFilterByValue('%')
        await testFilterByValue('~')
        await testFilterByValue('~~')
    })
    test('by array', async () => {
        await testFilterByValue(faker.random.arrayElements())
    })
})

describe('historical()', () => {
    test('create/update/delete history', async () => {
        const client = await makeClient()
        let obj = await Test.create(client, {})
        await Test.update(client, obj.id, { text: 'hello' })
        await Test.update(client, obj.id, { text: 'no' })
        await Test.delete(client, obj.id)

        let histObjs = await getTestHistoryObjs(client, obj.id)
        expect(histObjs).toEqual([
            expect.objectContaining({ history_action: 'c', history_id: obj.id, text: null, v: 1 }),
            expect.objectContaining({ history_action: 'u', history_id: obj.id, text: 'hello', v: 2 }),
            expect.objectContaining({ history_action: 'u', history_id: obj.id, text: 'no', v: 3 }),
            expect.objectContaining({ history_action: 'd', history_id: obj.id, text: 'no', v: 3 }),
        ])
    })

    test('delete related object and set FK null without history update', async () => {
        if (isMongo()) return console.error('SKIP() Mongo: doesn\'t support UUID fk!')
        const client = await makeClient()
        let obj = await TestItem.create(client, { test: { create: { text: 'new1' } }, meta: { foo: 1 } })
        await TestItem.update(client, obj.id, { meta: { foo: 2 } })
        await Test.update(client, obj.test.id, { text: 'new2' })
        await Test.delete(client, obj.test.id)
        await TestItem.delete(client, obj.id)

        let histObjs = await getTestHistoryObjs(client, obj.test.id)
        expect(histObjs).toEqual([
            expect.objectContaining({ history_action: 'c', history_id: obj.test.id, text: 'new1', v: 1 }),
            expect.objectContaining({ history_action: 'u', history_id: obj.test.id, text: 'new2', v: 2 }),
            expect.objectContaining({ history_action: 'd', history_id: obj.test.id, text: 'new2', v: 2 }),
        ])

        histObjs = await getTestItemHistoryObjs(client, obj.id)
        expect(histObjs).toEqual([
            expect.objectContaining({
                history_action: 'c',
                history_id: obj.id,
                meta: { foo: 1 },
                v: 1,
                test: String(obj.test.id),
            }),
            expect.objectContaining({
                history_action: 'u',
                history_id: obj.id,
                meta: { foo: 2 },
                v: 2,
                test: String(obj.test.id),
            }),
            expect.objectContaining({
                history_action: 'd',
                history_id: obj.id,
                meta: { foo: 2 },
                v: 2,
                test: null,
            }),
        ])
    })
})

describe('versioned()', () => {
    test('check v field autoincrement', async () => {
        const client = await makeClient()

        let obj = await Test.create(client, {})
        expect(obj.v).toBe(1)

        obj = await Test.update(client, obj.id, { text: 'hello' })
        expect(obj.v).toBe(2)
    })
    test('try to set v', async () => {
        const admin = await makeLoggedInAdminClient()
        const { data, errors } = await Test.create(admin, { v: 5 }, { raw: true })
        expect(data).toEqual(undefined)
        expect(JSON.stringify(errors)).toMatch(/Field [\\"']+v[\\"']+ is not defined by type [\\"']+TestCreateInput[\\"']+/i)
    })
})

describe('uuided()', () => {
    test('chek id field is uuid', async () => {
        const client = await makeClient()
        let obj = await TestItem.create(client, { test: { create: { text: 'autoGen' } } })
        expect(obj.id).toMatch(UUID_RE)
    })
})

describe('tracked()', () => {
    test('check createAt/updateAt for anonymous', async () => {
        const client = await makeClient()
        let { id, createdAt, updatedAt } = await Test.create(client, {})
        expect(createdAt).toMatch(DATETIME_RE)
        expect(updatedAt).toMatch(DATETIME_RE)
        expect(updatedAt).toEqual(createdAt)
        let obj = await Test.update(client, id, { text: 'new' })
        expect(obj.createdAt).toEqual(createdAt)
        expect(obj.updatedAt).toMatch(DATETIME_RE)
        expect(obj.updatedAt).not.toEqual(createdAt)
    })
    test('check createBy/updateBy for anonymous', async () => {
        const client = await makeClient()
        let { id, createdBy, updatedBy } = await Test.create(client, {})
        expect(createdBy).toBe(null)
        expect(updatedBy).toBe(null)
        let obj = await Test.update(client, id, { text: 'new' })
        expect(obj.createdBy).toBe(null)
        expect(obj.updatedBy).toBe(null)
    })
    test('check createBy/updateBy for user1/user2', async () => {
        const client = await makeLoggedInClient()
        const admin = await makeLoggedInAdminClient()
        let { id, createdBy, updatedBy } = await Test.create(client, {})
        expect(createdBy).toEqual({ id: client.user.id })
        expect(updatedBy).toEqual({ id: client.user.id })
        let obj = await Test.update(admin, id, { text: 'new' })
        expect(obj.createdBy).toEqual({ id: client.user.id })
        expect(obj.updatedBy).toEqual({ id: admin.user.id })
    })
    test('try to set createBy', async () => {
        const client = await makeLoggedInClient()
        const admin = await makeLoggedInAdminClient()
        const { data, errors } = await Test.create(client, { createdBy: { connect: { id: admin.user.id } } }, { raw: true })
        expect(data).toEqual(undefined)
        expect(JSON.stringify(errors)).toMatch(/Field [\\"']+createdBy[\\"']+ is not defined by type [\\"']+TestCreateInput[\\"']+/i)
    })
})

// describe('softDeleted()', () => {
//     test('check createAt/updateAt for anonymous', async () => {
//     })
// })
