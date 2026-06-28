import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { ORIGIN, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$app/env/private';

/**
 * Minimal OAuth handler - exchanges GitHub code for user profile
 * No database required - user data is returned to client for storage
 */
export const GET: RequestHandler = async ({ url }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');

	if (!code) {
		return json({ error: 'No authorization code provided' }, { status: 400 });
	}

	try {
		// Exchange code for access token with GitHub
		const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({
				client_id: GITHUB_CLIENT_ID,
				client_secret: GITHUB_CLIENT_SECRET,
				code,
				redirect_uri: `${ORIGIN}/auth/github/callback`
			})
		});

		const tokenData = await tokenResponse.json();

		if (tokenData.error) {
			return json({ error: tokenData.error_description }, { status: 400 });
		}

		const accessToken = tokenData.access_token;

		// Fetch user profile from GitHub
		const userResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/vnd.github.v3+json'
			}
		});

		const userData = await userResponse.json();

		if (!userResponse.ok) {
			return json({ error: 'Failed to fetch user profile' }, { status: 400 });
		}

		// Return user data and token to client
		// Client will store this in localStorage/cookies
		return json({
			user: {
				id: userData.id.toString(),
				email: userData.email,
				name: userData.name || userData.login,
				image: userData.avatar_url,
				login: userData.login
			},
			accessToken
		});
	} catch (error) {
		console.error('OAuth callback error:', error);
		return json({ error: 'Authentication failed' }, { status: 500 });
	}
};
