import { ClientSecretCredential } from "@azure/identity";
import { getKeyvaultName } from "./utils.common";
import { SecretClient } from "../../src";
import { env, record, RecorderEnvironmentSetup } from "@azure/test-utils-recorder";
import { uniqueString } from "./recorderUtils";
import TestClient from "./testClient";

export async function authenticate(that: any): Promise<any> {
  const secretSuffix = uniqueString();
  const recorderEnvSetup: RecorderEnvironmentSetup = {
    replaceableVariables: {
      AZURE_CLIENT_ID: "azure_client_id",
      AZURE_CLIENT_SECRET: "azure_client_secret",
      AZURE_TENANT_ID: "azure_tenant_id",
      KEYVAULT_NAME: "keyvault_name"
    },
    replaceInRecordings: [
      (recording: any): any =>
        recording.replace(/"access_token":"[^"]*"/g, `"access_token":"access_token"`),
      (recording: any): any =>
        secretSuffix === "" ? recording : recording.replace(new RegExp(secretSuffix, "g"), "")
    ],
    queryParametersToSkip: []
  };
  const recorder = record(that, recorderEnvSetup);
  const credential = await new ClientSecretCredential(
    env.AZURE_TENANT_ID,
    env.AZURE_CLIENT_ID,
    env.AZURE_CLIENT_SECRET
  );

  const keyVaultName = getKeyvaultName();
  const keyVaultUrl = `https://${keyVaultName}.vault.azure.net`;
  const client = new SecretClient(keyVaultUrl, credential);
  const testClient = new TestClient(client);

  return { recorder, client, testClient, secretSuffix };
}
