const { RESTDataSource } = require('apollo-datasource-rest')
const get = require('lodash/get')

class LaunchAPI extends RESTDataSource {
    constructor() {
        super()
        this.baseURL = 'https://api.spacexdata.com/v2/'
    }

    async getAllLaunches() {
        const response = await this.get('launches')
        return Array.isArray(response)
            ? response.map(launch => this.launchReducer(launch))
            : []
    }

    async getLaunchById({ launchId }) {
        const response = await this.get('launches', { flight_number: launchId })
        return  this.launchReducer(response[0])
    }

    launchReducer(launch) {
        const { launch_site, links, rocket } = launch
        return {
          id: launch.flight_number || 0,
          cursor: `${launch.launch_date_unix}`,
          site: get(launch_site, 'site_name', ''),
          mission: {
            name: launch.mission_name,
            missionPatchSmall: links.mission_patch_small,
            missionPatchLarge: links.mission_patch,
          },
          rocket: {
            id: rocket.rocket_id,
            name: rocket.rocket_name,
            type: rocket.rocket_type,
          },
        };
    }

    getLaunchesByIds({ launchIds }) {
        return Promise.all(
            launchIds.map(launchId => this.getLaunchById({ launchId }))
        )
    }
}

module.exports = LaunchAPI
