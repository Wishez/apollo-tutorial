import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'
import { ApolloProvider, Query } from 'react-apollo'
import Pages from './pages'
import TokenStorage from './utils/tokenStorage'
import { typeDefs, resolvers } from './resolvers'
import Login from './pages/login'
import injectStyles from './styles';

const cache = new InMemoryCache()
const link = new HttpLink({
    uri: 'http://localhost:4000/',
    headers: {
        authorization: TokenStorage.get(),
    },
})

const client = new ApolloClient({
    cache,
    link,
    typeDefs,
    resolvers,
})

cache.writeData({
    data: {
        isLoggedIn: TokenStorage.isLoggedIn(),
        cartItems: [],
    }
})

const IS_LOGGED_IN = gql`
    query IsUserLoggedIn {
        isLoggedIn @client
    }
`
injectStyles()
ReactDOM.render(
    <ApolloProvider client={client}>
        <Query query={IS_LOGGED_IN}>
            {({ data }) => (data.isLoggedIn ? (
                    <Pages />
                ) : (
                    <Login />
                )
            )}
        </Query>
    </ApolloProvider>, document.getElementById('root')
)
