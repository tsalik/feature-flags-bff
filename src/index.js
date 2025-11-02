/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import * as configcat from "@configcat/sdk/cloudflare-worker";

export default {
	async fetch(request, env, ctx) {
        const url = new URL(request.url);

        if (url.pathname != "/api/features/") {
            return new Response(
                JSON.stringify({ "error": "Invalid endpoint" }),
                { status: 400, headers : { "Content-Type": "application/json" } }
            );
        }

        const country = url.searchParams.get("country");
        if (!country) {
            return new Response(
                JSON.stringify({ error: "Missing required query parameter: country" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const buildNumber = request.headers.get("X-Build-Number");

        if (!buildNumber) {
            return new Response(
                JSON.stringify({ error: "Missing required header: X-Build-Number" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }
        const configCatClient = configcat.getClient(env.CONFIGCAT_SDK_KEY);

        const showWelcomeMessage = await configCatClient.getValueAsync("showwelcomemessage", false, { country });
        const showCountryFlag = await configCatClient.getValueAsync("showCountryFlag", false, { country });

        return Response.json(
            {
                showWelcomeMessage,
                showCountryFlag
            }
        );
	}
};
