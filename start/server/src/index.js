const { ApolloServer } = require('apollo-server')
const typeDefs = require('./schema')
const { createStore } = require('./utils')
const resolvers = require('./resolvers')

const LaunchAPI = require('./datasources/launch')
const UserAPI = require('./datasources/user')

const store = createStore()

// const axios = require('axios')s
// axios.get('https://api.spacexdata.com/v2/launches')
//     .then(({ data: launches }) => Array.isArray(launches) && launches.map((launch, index) => console.log(typeof launch, index)))

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        launchAPI: new LaunchAPI(),
        userAPI: new UserAPI({ store }),
    }),
})

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
})