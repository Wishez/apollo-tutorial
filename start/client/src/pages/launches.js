import React, { Fragment } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { LaunchTile, Header, Button, Loading } from '../components';
import _ from '../lib/lodash'

export const LAUNCH_TILE_DATA = gql`
    fragment LaunchTile on Launch {
        id
        isBooked
        rocket {
            id
            name
        }
        mission {
            name
            missionPatch
        }
    }
`

export const GET_LAUNCHES = gql`
  query launchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

const Launches = (props) =>  {
    return (
        <Query query={GET_LAUNCHES}>
            {({ data, loading, error, fetchMore }) => {
                if (loading) return <Loading />
                if (error) return <p>ERROR: {error.message}</p>

                const launchesResponse = _.get(data, 'launches') 
                const launches = _.get(launchesResponse, 'launches')
                const hasMore = _.get(launchesResponse, 'hasMore')
                return (
                    <Fragment>
                        <Header />
                        {launches && launches.map((launch, index) => (
                            <LaunchTile
                                key={index}
                                launch={launch}
                            />
                        ))}

                        {hasMore && (
                            <Button
                                onClick={() => fetchMore({
                                    variables: {
                                        after: launchesResponse.cursor
                                    },
                                    updateQuery: (prev, { fetchMoreResult }) => {
                                        if (!fetchMoreResult) return prev
                                        return {
                                            ...fetchMoreResult,
                                            launches: {
                                                ...fetchMoreResult.launches,
                                                launches: [
                                                    ...prev.launches.launches,
                                                    ...fetchMoreResult.launches.launches,
                                                ],
                                            },
                                        }
                                    }
                                })}
                            >
                                Load More
                            </Button>
                        )}
                    </Fragment>
                )
            }}
        </Query>
    )
}

export default Launches