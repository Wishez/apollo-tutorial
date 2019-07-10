const { paginateResults } = require('./utils')
const get = require('lodash/get')

module.exports = {
    Query: {
        launches: async (_, { after, pageSize = 20, isReversed }, { dataSources }) => {
            const allLaunches = await dataSources.launchAPI.getAllLaunches()
            if (isReversed) allLaunches.reverse()
            const launches = paginateResults({
                after,
                pageSize,
                results: allLaunches,
            })
            const launchesLength = launches.length
            let cursor, hasMore = [null, false]
            if (launchesLength) {
                const lastLaunchCursor = launches[launchesLength - 1].cursor
                cursor = lastLaunchCursor
                hasMore = Boolean(lastLaunchCursor)
            }
            return {
                launches,
                cursor,
                hasMore,
            }
        },
        launch: (_, { id }, { dataSources }) => dataSources.launchAPI.getLaunchById({ launchId: id }),
        me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
    },

    Mission: {
        missionPatch: (mission, { size } = { size: 'LARGE' }) => {
            return size === 'SMALL'
                ? mission.missionPatchSmall
                : mission.missionPatchLarge
        }
    },

    Launch: {
        isBooked: async ({ id }, _, { dataSources }) => dataSources.userAPI.isBookedOnLaunch({ launchId: id })
    },

    User: {
        trips: async (_, __, { dataSources }) => {
            const launchIds = await dataSources.userAPI.getLaunchIdsByUser()
            if (!launchIds.length) return []
            return dataSources.launchAPI.getLaunchesByIds({ launchIds }) || []
        }
    },

    Mutation: {
        login: async (_, { email }, { dataSources }) => {
            const user = await dataSources.userAPI.findOrCreateUser({ email })
            if (user) return Buffer.from(email).toString('base64')
        },

        bookTrips: async (_, { launchIds }, { dataSources }) => {
            const results = await dataSources.userAPI.bookTrips({ launchIds })
            const launches = await dataSources.launchAPI.getLaunchesByIds({ launchIds })
            const resultsLength = get(results, 'length')
            const launchesLength = get(launches, 'length')
            const isSuccess = resultsLength === launchesLength
            return {
                success: isSuccess,
                message: isSuccess
                    ? 'tips booked successfully'
                    : `the following launches couldn't be booked: ${launchIds.filter(id => !results.includes(id))}`,
                launches,
            }
        },

        cancelTrip: async (_, { launchId }, { dataSources }) => {
            const result = await dataSources.userAPI.cancelTrip({ launchId })
            if (!result) {
                return {
                    success: false,
                    message: 'failed to cancel trip'
                }
            }

            const launch = await dataSources.launchAPI.getLaunchById({ launchId })
            return {
                success: true,
                message: 'trip cancelled',
                launches: [launch]
            }
        }
    }
}
