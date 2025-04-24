# first

An open-source TypeScript library to interact with the FIRST APIs.

[![npm version](https://img.shields.io/npm/v/first.svg)](https://www.npmjs.com/package/first)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Features

- Fully typed API client for FIRST Tech Challenge (FTC) API
- Support for all FTC API endpoints
- Easy authentication with token generation
- Season selection with enum support
- Comprehensive error handling and input validation

## Installation

```bash
npm install first
```

## Usage

### Basic Setup

```typescript
import { FirstFTCAPI, createToken, Season } from 'first';

// Create an authentication token
const token = createToken('your_username', 'your_key');

// Create a client for the current season
const client = new FirstFTCAPI(token);

// Or specify a different season
const client2023 = new FirstFTCAPI(token, Season.CenterStage);
```

### API Examples

#### Get API Information

```typescript
async function getApiInfo() {
  try {
    const info = await client.getIndex();
    console.log(`API Version: ${info.apiVersion}`);
    console.log(`Current Season: ${info.currentSeason}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

#### Get Teams

```typescript
// Get all teams
const allTeams = await client.getTeams();

// Get a specific team
const team = await client.getTeams({ teamNumber: 12345 });

// Get teams from a specific state
const stateTeams = await client.getTeams({ state: 'CA' });

// Get teams attending a specific event
const eventTeams = await client.getTeams({ eventCode: 'USACMP' });
```

#### Get Events

```typescript
// Get all events
const allEvents = await client.getEvents();

// Get a specific event
const event = await client.getEvents({ eventCode: 'USACMP' });

// Get events for a specific team
const teamEvents = await client.getEvents({ teamNumber: 12345 });
```

#### Get Match Results

```typescript
// Get all matches for an event
const matches = await client.getMatches('USACMP');

// Get matches with specific filters
const qualificationMatches = await client.getMatches('USACMP', {
  tournamentLevel: 'qual'
});

// Get matches for a specific team
const teamMatches = await client.getMatches('USACMP', {
  teamNumber: 12345
});
```

## Available Endpoints

The library currently supports the following FTC API endpoints:

- `getIndex()` - Get API information
- `getTeams(options?)` - Get team listings
- `getEvents(options?)` - Get event listings
- `getMatches(eventCode, options?)` - Get match results
- `getRankings(eventCode, options?)` - Get rankings
- `getSeasonSummary()` - Get season summary
- `getAwardListings()` - Get award listings
- `getAwards(options)` - Get awards for events or teams
- `getAlliances(eventCode)` - Get alliance information
- `getAllianceSelections(eventCode)` - Get alliance selection details
- `getScores(eventCode, tournamentLevel, options?)` - Get score details
- `getSchedule(eventCode, options)` - Get event schedule
- `getHybridSchedule(eventCode, tournamentLevel, options?)` - Get hybrid schedule

## Supported Seasons

The library includes an enum for easy season selection:

```typescript
enum Season {
  SkyStone = 2019,
  UltimateGoal = 2020,
  FreightFrenzy = 2021,
  PowerPlay = 2022,
  CenterStage = 2023,
  IntoTheDeep = 2024
}
```

## Authentication

To use this library, you need to have valid FIRST API credentials. You can create a token using:

```typescript
import { createToken } from 'first';
const token = createToken('username', 'key');
```

For testing, create a `.env` file in your test directory with:

```
TOKEN=username:key
```

## Roadmap

- FRC (FIRST Robotics Competition) API support coming soon
- Extended documentation and examples
- Additional utility functions for common operations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details.