const { paginateResults } = require('./utils')

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
    }
}
