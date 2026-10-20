import * as core from "@actions/core";
import { type OidcLoginConfig } from "./config.js";
import { exchangeIdToken, buildPulumiAudience } from "./oauth2.js";
import { fetchOIDCToken } from "./gh.js";

export * from "./config.js";

export async function ensureAccessToken(config: OidcLoginConfig): Promise<string> {
    const audience = buildPulumiAudience(config.organizationName);

    core.debug(`Fetching OIDC Token for ${audience}`);
    const idToken = await fetchOIDCToken(audience);

    core.debug("Exchanging oidc token for pulumi token");
    const accessToken = await exchangeIdToken(config, audience, idToken);

    return accessToken;
}
