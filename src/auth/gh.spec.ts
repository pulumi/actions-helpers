import http from "node:http";
import { type AddressInfo } from "node:net";
import { fetchOIDCToken } from "./gh.js";

// Each element is the response to one request: "reset" destroys the socket,
// and a number is an HTTP status code. A 200 returns the token "the_id_token".
async function withTokenServer(responses: ("reset" | number)[], fn: () => Promise<void>): Promise<number> {
    let requests = 0;
    const server = http.createServer((req, res) => {
        const response = responses[requests++];
        if (response === "reset") {
            req.socket.destroy();
            return;
        }
        res.writeHead(response, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response === 200 ? { value: "the_id_token" } : { message: "error" }));
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const { port } = server.address() as AddressInfo;
    process.env.ACTIONS_ID_TOKEN_REQUEST_URL = `http://127.0.0.1:${port}/token?api-version=2.0`;
    process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN = "the_request_token";
    try {
        await fn();
    } finally {
        server.close();
        delete process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
        delete process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
    }
    return requests;
}

describe("fetchOIDCToken", () => {
    it("should retry after dropped connections", async () => {
        const requests = await withTokenServer(["reset", "reset", 200], async () => {
            expect(await fetchOIDCToken("aud", 0)).toBe("the_id_token");
        });
        expect(requests).toBe(3);
    });

    it("should fail after three attempts", async () => {
        const requests = await withTokenServer([403, 403, 403, 200], async () => {
            await expect(fetchOIDCToken("aud", 0)).rejects.toThrow(/Error Code : 403/);
        });
        expect(requests).toBe(3);
    });
});
