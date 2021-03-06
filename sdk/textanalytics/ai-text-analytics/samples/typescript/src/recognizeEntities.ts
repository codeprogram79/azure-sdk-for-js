// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * detects entites in a piece of text and prints them along with the entity type
 */

import {
  TextAnalyticsClient,
  TextAnalyticsApiKeyCredential
} from "@azure/ai-text-analytics";

// Load the .env file if it exists
import * as dotenv from "dotenv";
dotenv.config();

export async function main() {
  console.log(`Running recognizeEntities sample`);

  // You will need to set these environment variables or edit the following values
  const endpoint = process.env["ENDPOINT"] || "<cognitive services endpoint>";
  const apiKey = process.env["TEXT_ANALYTICS_API_KEY"] || "<api key>";

  const client = new TextAnalyticsClient(endpoint, new TextAnalyticsApiKeyCredential(apiKey));

  const [result] = await client.recognizeEntities(["I love living in Seattle."]);

  if (!result.error) {
    for (const entity of result.entities) {
      console.log(`Found entity ${entity.text} of type ${entity.type}`);
    }
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});
