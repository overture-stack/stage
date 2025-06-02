import { getConfig } from '@/global/config';
import urlJoin from 'url-join';

const {
	NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
	KEYCLOAK_CLIENT_SECRET,
	NEXT_PUBLIC_KEYCLOAK_PERMISSION_AUDIENCE,
	NEXT_PUBLIC_KEYCLOAK_HOST,
	NEXT_PUBLIC_KEYCLOAK_REALM,
} = getConfig();

export const permissionBodyParams = () => {
	return new URLSearchParams({
		grant_type: 'urn:ietf:params:oauth:grant-type:uma-ticket',
		audience: NEXT_PUBLIC_KEYCLOAK_PERMISSION_AUDIENCE,
		response_mode: 'permissions',
	});
};

export type Permission = {
	rsid: string;
	rsname: string;
	scopes: string[];
};

export const scopesFromPermissions = (permissions: Permission[]) => {
	return permissions
		.filter(({ scopes }) => scopes)
		.flatMap(({ rsname, scopes }) => scopes.flatMap((scope) => [rsname + '.' + scope]));
};

export const refreshAccessToken = async (refreshToken: string) => {
	try {
		const url = urlJoin(
			NEXT_PUBLIC_KEYCLOAK_HOST,
			`realms`,
			NEXT_PUBLIC_KEYCLOAK_REALM,
			'protocol/openid-connect/token',
		);

		const formData = new URLSearchParams({
			client_id: NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
			client_secret: KEYCLOAK_CLIENT_SECRET,
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
		});

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
			},
			body: formData,
		});

		// Parse the response and return the result
		if (response.ok) {
			return await response.json();
		}
	} catch (error) {
		console.error('Error during token refresh:', error);
	}
};
