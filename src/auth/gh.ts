import * as core from "@actions/core";

export async function fetchOIDCToken(audience: string) {
    return core.getIDToken(audience);
}
