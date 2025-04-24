import { FirstFTCAPI, Season } from '../dist/index.js';
import { config } from 'dotenv';

config({ path: "./test/.env"});

const client = new FirstFTCAPI(Buffer.from(process.env.TOKEN).toString("base64"), Season.IntoTheDeep);

// Test the getIndex method
async function testGetIndex() {
  try {
    console.log('Testing getIndex method...');
    const result = await client.getIndex();
    console.log('API Information:');
    console.log(`- Name: ${result.name}`);
    console.log(`- API Version: ${result.apiVersion}`);
    console.log(`- Status: ${result.status}`);
    console.log(`- Current Season: ${result.currentSeason}`);
    console.log(`- Max Season: ${result.maxSeason}`);
  } catch (error) {
    console.error('Error getting API information:', error.message);
  }
}

testGetIndex();