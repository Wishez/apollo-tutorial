import React from 'react'
import { Mutation, ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'

import { LoginForm, Loading } from '../components'
import TokenStorage from '../utils/tokenStorage'

const LOGIN_USER = gql`
    mutation login($email: String!) {
        login(email: $email)
    }
`

export default function Login() {
    return (
        <ApolloConsumer>
            {client => (
                <Mutation
                    mutation={LOGIN_USER}
                    onCompleted={({ login }) => {
                        TokenStorage.set(login)
                        client.writeData({ data: { isLoggedIn: true }})
                    }}
                >
                    {(login, { loading, error }) => {
                        if (loading) return <Loading />
                        if (error) return <p>Error: {error.message}</p>

                        return <LoginForm login={login} />
                    }}
                </Mutation>
            )}
        </ApolloConsumer>
    )
}
