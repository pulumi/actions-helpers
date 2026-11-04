import * as core from "@actions/core";
import { setTimeout } from "node:timers/promises";

const maxAttempts = 3;

// `core.getIDToken` throws a plain `Error` for every failure, so a transient
// network error cannot be told apart from an HTTP error. Retry on every failure.
// See https://github.com/actions/toolkit/issues/2565.
export async function fetchOIDCToken(audience: string, retryDelayMs = 1000): Promise<string> {
    for (let attempt = 1; ; attempt++) {
        try {
            return await core.getIDToken(audience);
        } catch (error) {
            if (attempt >= maxAttempts) {
                throw error;
            }
            const delay = retryDelayMs * 2 ** (attempt - 1);
            core.warning(
                `Attempt ${attempt} of ${maxAttempts} to fetch the OIDC token failed, retrying in ${delay}ms: ${(error as Error).message}`,
            );
            await setTimeout(delay);
        }
    }
}
