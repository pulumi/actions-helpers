import * as core from "@actions/core";
import { type OidcLoginConfig } from "./config";
import { exchangeIdToken, buildPulumiAudience } from "./oauth2";
import { fetchOIDCToken } from "./gh";

export * from "./config";

export async function ensureAccessToken(config: OidcLoginConfig): Promise<string> {
    const audience = buildPulumiAudience(config.organizationName);

    core.debug(`Fetching OIDC Token for ${audience}`);
    const idToken = await fetchOIDCToken(audience);

    core.debug("Exchanging oidc token for pulumi token");
    const accessToken = await exchangeIdToken(config, audience, idToken);

    return accessToken;
}
