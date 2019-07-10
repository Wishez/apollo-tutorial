import React, { Fragment } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import { Loading, Header, LaunchTile } from '../components'
import { LAUNCH_TILE_DATA } from './launches'
import _ from '../lib/lodash'

const GET_MY_TRIPS = gql`
    query GetMyTrips {
        me {
            id
            email
            trips {
                ...LaunchTile
            }
        }
    }

    ${LAUNCH_TILE_DATA}
`

export default function Profile() {
    return (
        <Query query={GET_MY_TRIPS}>
            {({ data, loading, error }) => {
                if (loading) return <Loading />
                if (error) return <p>ERROR: {error.message}</p>
                const { me } = data
                const trips = _.get(me, 'trips', [])
                return (
                    <Fragment>
                        <Header>My Trips</Header>
                        {trips.length > 0 ? (
                            trips.map((launch, index) => <LaunchTile key={index} launch={launch} />)
                        ) : (
                            <p>You havn't booked any trips</p>
                        )}

                    </Fragment>
                )
            }}
        </Query>
    )
}