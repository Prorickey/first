import CONSTANTS from "./constants.js"
import { Season } from "./season.js"

/**
 * Client class for interacting with the FTC API.
 * @example
 * const client = new Client(createToken('your_username', 'your_key'));
 * const result = await client.getIndex();
 * console.log(result.season); // Outputs the current season
 * @param token - The token to authenticate the client.
 * @throws {Error} If the token is not provided.
 */
export class FirstFTCAPI {
	/**
	 * Creates a new Client instance.
	 * @param token - The token to authenticate the client.
	 * @throws {Error} If the token is not provided.
	 */
	constructor(
		private token: string,
		private season: Season = Season.IntoTheDeep
	) {
		if (!this.token) throw new Error("Token is required")
		if (!this.season) throw new Error("Season is required")
	}

	/**
	 * Gets the API index information.
	 * This is a root level call with no parameters.
	 * @returns API index information including version, status and available seasons
	 */
	async getIndex() {
		const response = await fetch(
			`${CONSTANTS.ftc.baseURL}/${CONSTANTS.ftc.version}`,
			{
				method: "GET",
				headers: {
					Authorization: `Basic ${this.token}`,
					Accept: "application/json"
				}
			}
		)

		if (!response.ok) {
			throw new Error(
				`API request failed: ${response.status} ${response.statusText}`
			)
		}

		return await response.json()
	}

	/**
	 * Gets team listings for the current season.
	 * @param options - Optional parameters for filtering teams
	 * @param options.teamNumber - Filter results to a specific team
	 * @param options.eventCode - Filter results to teams attending a specific event
	 * @param options.state - Filter results to teams from a specific state
	 * @returns Team listings matching the specified criteria
	 */
	async getTeams(options?: {
		teamNumber?: number
		eventCode?: string
		state?: string
	}) {
		// You can't specify both teamNumber and (eventCode or state) at the same time
		if (options?.teamNumber && (options.eventCode || options.state)) {
			throw new Error(
				"Cannot specify both teamNumber and (eventCode or state) in the same request"
			)
		}

		let url = `${CONSTANTS.ftc.baseURL}/${CONSTANTS.ftc.version}/${this.season}/teams`

		if (options) {
			const params = new URLSearchParams()

			if (options.teamNumber) {
				params.append("teamNumber", options.teamNumber.toString())
			}

			if (options.eventCode) {
				params.append("eventCode", options.eventCode)
			}

			if (options.state) {
				params.append("state", options.state)
			}

			const queryString = params.toString()
			if (queryString) {
				url += `?${queryString}`
			}
		}

		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Basic ${this.token}`,
				Accept: "application/json"
			}
		})

		if (!response.ok) {
			throw new Error(
				`API request failed: ${response.status} ${response.statusText}`
			)
		}

		return await response.json()
	}

	/**
	 * Gets event listings for the current season.
	 * @param options - Optional parameters for filtering events
	 * @param options.eventCode - Filter results to a specific event
	 * @param options.teamNumber - Filter results to events attended by a specific team
	 * @returns Event listings matching the specified criteria
	 */
	async getEvents(options?: { eventCode?: string; teamNumber?: number }) {
		// You can't specify both eventCode and teamNumber at the same time
		if (options?.eventCode && options?.teamNumber) {
			throw new Error(
				"Cannot specify both eventCode and teamNumber in the same request"
			)
		}

		let url = `${CONSTANTS.ftc.baseURL}/${CONSTANTS.ftc.version}/${this.season}/events`

		if (options) {
			const params = new URLSearchParams()

			if (options.eventCode) {
				params.append("eventCode", options.eventCode)
			}

			if (options.teamNumber) {
				params.append("teamNumber", options.teamNumber.toString())
			}

			const queryString = params.toString()
			if (queryString) {
				url += `?${queryString}`
			}
		}

		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Basic ${this.token}`,
				Accept: "application/json"
			}
		})

		if (!response.ok) {
			throw new Error(
				`API request failed: ${response.status} ${response.statusText}`
			)
		}

		return await response.json()
	}

	/**
	 * Gets match results for an event in the current season.
	 * @param eventCode - The event code to get match results for
	 * @param options - Optional parameters for filtering match results
	 * @param options.tournamentLevel - Filter results to a specific tournament level
	 * @param options.teamNumber - Filter results to matches including a specific team
	 * @param options.matchNumber - Filter results to a specific match number
	 * @param options.start - Filter results to matches starting at this match number
	 * @param options.end - Filter results to matches ending at this match number
	 * @returns Match results matching the specified criteria
	 */
	async getMatches(
		eventCode: string,
		options?: {
			tournamentLevel?: string
			teamNumber?: number
			matchNumber?: number
			start?: number
			end?: number
		}
	) {
		if (!eventCode) {
			throw new Error("Event code is required")
		}

		// You can't specify both teamNumber and matchNumber at the same time
		if (options?.teamNumber && options?.matchNumber) {
			throw new Error(
				"Cannot specify both teamNumber and matchNumber in the same request"
			)
		}

		// You need to specify tournamentLevel if you specify matchNumber, start, or end
		if (
			(options?.matchNumber || options?.start || options?.end) &&
			!options?.tournamentLevel
		) {
			throw new Error(
				"Must specify tournamentLevel when using matchNumber, start, or end"
			)
		}

		// You can't specify matchNumber with start or end
		if (options?.matchNumber && (options?.start || options?.end)) {
			throw new Error("Cannot specify matchNumber with start or end")
		}

		let url = `${CONSTANTS.ftc.baseURL}/${CONSTANTS.ftc.version}/${this.season}/matches/${eventCode}`

		if (options) {
			const params = new URLSearchParams()

			if (options.tournamentLevel) {
				params.append("tournamentLevel", options.tournamentLevel)
			}

			if (options.teamNumber) {
				params.append("teamNumber", options.teamNumber.toString())
			}

			if (options.matchNumber) {
				params.append("matchNumber", options.matchNumber.toString())
			}

			if (options.start) {
				params.append("start", options.start.toString())
			}

			if (options.end) {
				params.append("end", options.end.toString())
			}

			const queryString = params.toString()
			if (queryString) {
				url += `?${queryString}`
			}
		}

		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Basic ${this.token}`,
				Accept: "application/json"
			}
		})

		if (!response.ok) {
			throw new Error(
				`API request failed: ${response.status} ${response.statusText}`
			)
		}

		return await response.json()
	}

	/**
	 * Gets rankings for an event in the current season.
	 * @param eventCode - The event code to get rankings for
	 * @param options - Optional parameters for filtering rankings
	 * @param options.teamNumber - Filter results to a specific team's ranking
	 * @param options.top - Filter results to the top N teams
	 * @returns Event rankings matching the specified criteria
	 */
	async getRankings(
		eventCode: string,
		options?: { teamNumber?: number; top?: number }
	) {
		if (!eventCode) {
			throw new Error("Event code is required")
		}

		// You can't specify both teamNumber and top at the same time
		if (options?.teamNumber && options?.top) {
			throw new Error(
				"Cannot specify both teamNumber and top in the same request"
			)
		}

		let url = `${CONSTANTS.ftc.baseURL}/${CONSTANTS.ftc.version}/${this.season}/rankings/${eventCode}`

		if (options) {
			const params = new URLSearchParams()

			if (options.teamNumber) {
				params.append("teamNumber", options.teamNumber.toString())
			}

			if (options.top) {
				params.append("top", options.top.toString())
			}

			const queryString = params.toString()
			if (queryString) {
				url += `?${queryString}`
			}
		}

		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Basic ${this.token}`,
				Accept: "application/json"
			}
		})

		if (!response.ok) {
			throw new Error(
				`API request failed: ${response.status} ${response.statusText}`
			)
		}

		return await response.json()
	}

	/**
	 * Gets a summary of the current season.
	 * @returns Season summary information
	 */
	async getSeasonSummary() {
		const url = `${CONSTANTS.ftc.baseURL}/${CONSTANTS.ftc.version}/${this.season}`

		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Basic ${this.token}`,
				Accept: "application/json"
			}
		})

		if (!response.ok) {
			throw new Error(
				`API request failed: ${response.status} ${response.statusText}`
			)
		}

		return await response.json()
	}

	/**
	 * Gets award listings for the current season.
	 * @returns List of awards available in the current season
	 */
	async getAwardListings() {
		const url = `${CONSTANTS.ftc.baseURL}/${CONSTANTS.ftc.version}/${this.season}/awards/list`

		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Basic ${this.token}`,
				Accept: "application/json"
			}
		})

		if (!response.ok) {
			throw new Error(
				`API request failed: ${response.status} ${response.statusText}`
			)
		}

		return await response.json()
	}

	/**
	 * Gets awards for an event or team in the current season.
	 * @param options - Required parameters for filtering awards
	 * @param options.eventCode - Filter results to awards at a specific event
	 * @param options.teamNumber - Filter results to awards won by a specific team
	 * @returns Awards matching the specified criteria
	 */
	async getAwards(options: { eventCode?: string; teamNumber?: number }) {
		if (!options.eventCode && !options.teamNumber) {
			throw new Error(
				"Must specify at least one of eventCode or teamNumber"
			)
		}

		let url = `${CONSTANTS.ftc.baseURL}/${CONSTANTS.ftc.version}/${this.season}/awards`

		if (options.teamNumber && options.eventCode) {
			url += `/${options.eventCode}/${options.teamNumber}`
		} else if (options.eventCode) {
			url += `/${options.eventCode}`
		} else if (options.teamNumber) {
			url += `/${options.teamNumber}`
		}

		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Basic ${this.token}`,
				Accept: "application/json"
			}
		})

		if (!response.ok) {
			throw new Error(
				`API request failed: ${response.status} ${response.statusText}`
			)
		}

		return await response.json()
	}

	/**
	 * Gets alliance information for an event in the current season.
	 * @param eventCode - The event code to get alliance information for
	 * @returns Alliance information for the specified event
	 */
	async getAlliances(eventCode: string) {
		if (!eventCode) {
			throw new Error("Event code is required")
		}

		const url = `${CONSTANTS.ftc.baseURL}/${CONSTANTS.ftc.version}/${this.season}/alliances/${eventCode}`

		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Basic ${this.token}`,
				Accept: "application/json"
			}
		})

		if (!response.ok) {
			throw new Error(
				`API request failed: ${response.status} ${response.statusText}`
			)
		}

		return await response.json()
	}

	/**
	 * Gets alliance selection details for an event in the current season.
	 * @param eventCode - The event code to get alliance selection details for
	 * @returns Alliance selection details for the specified event
	 */
	async getAllianceSelections(eventCode: string) {
		if (!eventCode) {
			throw new Error("Event code is required")
		}

		const url = `${CONSTANTS.ftc.baseURL}/${CONSTANTS.ftc.version}/${this.season}/alliances/${eventCode}/selection`

		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Basic ${this.token}`,
				Accept: "application/json"
			}
		})

		if (!response.ok) {
			throw new Error(
				`API request failed: ${response.status} ${response.statusText}`
			)
		}

		return await response.json()
	}

	/**
	 * Gets score details for an event in the current season.
	 * @param eventCode - The event code to get score details for
	 * @param tournamentLevel - The tournament level to get score details for
	 * @param options - Optional parameters for filtering score details
	 * @param options.teamNumber - Filter results to scores for a specific team
	 * @param options.matchNumber - Filter results to scores for a specific match
	 * @param options.start - Filter results to scores starting at this match number
	 * @param options.end - Filter results to scores ending at this match number
	 * @returns Score details matching the specified criteria
	 */
	async getScores(
		eventCode: string,
		tournamentLevel: string,
		options?: {
			teamNumber?: number
			matchNumber?: number
			start?: number
			end?: number
		}
	) {
		if (!eventCode) {
			throw new Error("Event code is required")
		}

		if (!tournamentLevel) {
			throw new Error("Tournament level is required")
		}

		// You can't specify both teamNumber and matchNumber at the same time
		if (options?.teamNumber && options?.matchNumber) {
			throw new Error(
				"Cannot specify both teamNumber and matchNumber in the same request"
			)
		}

		// You can't specify matchNumber with start or end
		if (options?.matchNumber && (options?.start || options?.end)) {
			throw new Error("Cannot specify matchNumber with start or end")
		}

		let url = `${CONSTANTS.ftc.baseURL}/${CONSTANTS.ftc.version}/${this.season}/scores/${eventCode}/${tournamentLevel}`

		if (options) {
			const params = new URLSearchParams()

			if (options.teamNumber) {
				params.append("teamNumber", options.teamNumber.toString())
			}

			if (options.matchNumber) {
				params.append("matchNumber", options.matchNumber.toString())
			}

			if (options.start) {
				params.append("start", options.start.toString())
			}

			if (options.end) {
				params.append("end", options.end.toString())
			}

			const queryString = params.toString()
			if (queryString) {
				url += `?${queryString}`
			}
		}

		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Basic ${this.token}`,
				Accept: "application/json"
			}
		})

		if (!response.ok) {
			throw new Error(
				`API request failed: ${response.status} ${response.statusText}`
			)
		}

		return await response.json()
	}

	/**
	 * Gets the schedule for an event in the current season.
	 * @param eventCode - The event code to get the schedule for
	 * @param options - Required parameters for filtering schedule
	 * @param options.tournamentLevel - The tournament level to get schedule for
	 * @param options.teamNumber - Filter results to matches including a specific team
	 * @returns Schedule matching the specified criteria
	 */
	async getSchedule(
		eventCode: string,
		options: {
			tournamentLevel: string
			teamNumber?: number
		}
	) {
		if (!eventCode) {
			throw new Error("Event code is required")
		}

		if (!options.tournamentLevel) {
			throw new Error("Tournament level is required")
		}

		let url = `${CONSTANTS.ftc.baseURL}/${CONSTANTS.ftc.version}/${this.season}/schedule/${eventCode}`

		const params = new URLSearchParams()
		params.append("tournamentLevel", options.tournamentLevel)

		if (options.teamNumber) {
			params.append("teamNumber", options.teamNumber.toString())
		}

		const queryString = params.toString()
		if (queryString) {
			url += `?${queryString}`
		}

		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Basic ${this.token}`,
				Accept: "application/json"
			}
		})

		if (!response.ok) {
			throw new Error(
				`API request failed: ${response.status} ${response.statusText}`
			)
		}

		return await response.json()
	}

	/**
	 * Gets the hybrid schedule (both scheduled and played matches) for an event in the current season.
	 * @param eventCode - The event code to get the hybrid schedule for
	 * @param tournamentLevel - The tournament level to get the hybrid schedule for
	 * @param options - Optional parameters for filtering hybrid schedule
	 * @param options.start - Filter results to matches starting at this match number
	 * @param options.end - Filter results to matches ending at this match number
	 * @returns Hybrid schedule matching the specified criteria
	 */
	async getHybridSchedule(
		eventCode: string,
		tournamentLevel: string,
		options?: {
			start?: number
			end?: number
		}
	) {
		if (!eventCode) {
			throw new Error("Event code is required")
		}

		if (!tournamentLevel) {
			throw new Error("Tournament level is required")
		}

		let url = `${CONSTANTS.ftc.baseURL}/${CONSTANTS.ftc.version}/${this.season}/schedule/${eventCode}/${tournamentLevel}/hybrid`

		if (options) {
			const params = new URLSearchParams()

			if (options.start) {
				params.append("start", options.start.toString())
			}

			if (options.end) {
				params.append("end", options.end.toString())
			}

			const queryString = params.toString()
			if (queryString) {
				url += `?${queryString}`
			}
		}

		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Basic ${this.token}`,
				Accept: "application/json"
			}
		})

		if (!response.ok) {
			throw new Error(
				`API request failed: ${response.status} ${response.statusText}`
			)
		}

		return await response.json()
	}
}
