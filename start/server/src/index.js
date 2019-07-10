const { ApolloServer } = require('apollo-server')
const typeDefs = require('./schema')
const { createStore } = require('./utils')
const resolvers = require('./resolvers')

const LaunchAPI = require('./datasources/launch')
const UserAPI = require('./datasources/user')

const store = createStore()

const isEmail = require('isemail')
const get = require('lodash/get')

// const axios = require('axios')s
// axios.get('https://api.spacexdata.com/v2/launches')
//     .then(({ data: launches }) => Array.isArray(launches) && launches.map((launch, index) => console.log(typeof launch, index)))

const server = new ApolloServer({
    typeDefs,
    resolvers,
    engin: {
        apiKey: process.env.ENGINE_API_KEY,
    },
    dataSources: () => ({
        launchAPI: new LaunchAPI(),
        userAPI: new UserAPI({ store }),
    }),
    context: async ({ req }) => {
        const auth = get(req.headers, 'authorization', '') || ''
        const email = Buffer.from(auth, 'base64').toString('ascii')
        if (!isEmail.validate(email)) return { user: null }

        const users = await store.users.findOrCreate({ where: { email }})
        const user = get(users, '0', null)
        return { user: { ...user.dataValues }}
    }
})

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
})