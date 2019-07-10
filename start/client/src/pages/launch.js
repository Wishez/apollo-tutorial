import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { Loading, Header, LaunchDetail } from '../components'
import { ActionButton } from '../containers'
import { LAUNCH_TILE_DATA } from './launches'

export const GET_LAUNCH_DETAILS = gql`
    query launchDetails($launchId: ID!) {
        launch(id: $launchId) {
            isInCart @client
            site
            rocket {
                type
            }
            ...LaunchTile
        }
    }
    ${LAUNCH_TILE_DATA}
`

export default function Launch({ launchId }) {
    return (
        <Query query={GET_LAUNCH_DETAILS} variables={{ launchId }}>
            {({ data, loading, error }) => {
            if (loading) return <Loading />
                if (error) return <p>ERROR: {error.message}</p>

                const launch = data.launch
                return (
                    <React.Fragment>
                        <Header image={launch.missionPatch}>
                            {launch.mission.name}
                        </Header>

                        <LaunchDetail {...launch} />
                        <ActionButton {...launch} />
                    </React.Fragment>
                )
            }}
        </Query>
    )
}
