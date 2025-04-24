/**
 * Creates a token from a username and key.
 * @param username Username given to you by the api
 * @param key Key given to you by the api
 * @returns Authorization token that can be used in the client
 */
export function createToken(username: string, key: string): string {
	if (!username || !key)
		throw new Error("Username and key are required to create a token")
	return Buffer.from(`${username}:${key}`).toString("base64")
}

import { Season } from "./season.js"
import { FirstFTCAPI } from "./ftc.js"

export { Season, FirstFTCAPI }
