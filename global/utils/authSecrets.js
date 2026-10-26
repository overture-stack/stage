// CommonJS, because next.config.js requires it.

const KEYCLOAK_SECRETS = ['KEYCLOAK_CLIENT_SECRET', 'SESSION_ENCRYPTION_SECRET'];

// The session secret keys Stage's session cookie, so a short value is a guessable key.
const MINIMUM_SESSION_SECRET_LENGTH = 32;

/**
 * Describes each way `env` falls short of what Keycloak sign-in needs: a required secret missing or empty,
 * or a session secret shorter than 32 characters. Nothing is required when Keycloak sign-in is not configured.
 *
 * @param {Record<string, string | undefined>} env
 * @returns {string[]}
 */
const keycloakSecretProblems = (env) => {
	const missing = KEYCLOAK_SECRETS.filter((name) => !env[name]).map((name) => `${name} is required`);
	const sessionSecret = env.SESSION_ENCRYPTION_SECRET;
	const isSessionSecretTooShort = Boolean(sessionSecret) && sessionSecret.length < MINIMUM_SESSION_SECRET_LENGTH;
	return isSessionSecretTooShort
		? [...missing, `SESSION_ENCRYPTION_SECRET must be at least ${MINIMUM_SESSION_SECRET_LENGTH} characters`]
		: missing;
};

const findAuthSecretProblems = (env) =>
	(env.NEXT_PUBLIC_AUTH_PROVIDER || '').toLowerCase() === 'keycloak' ? keycloakSecretProblems(env) : [];

/**
 * Stops Stage from starting when Keycloak sign-in is configured without the secrets it needs.
 *
 * @param {Record<string, string | undefined>} env
 */
const assertAuthSecrets = (env) => {
	const problems = findAuthSecretProblems(env);
	if (problems.length > 0) {
		throw new Error(`Stage cannot start with Keycloak sign-in: ${problems.join('; ')}`);
	}
};

module.exports = { assertAuthSecrets, findAuthSecretProblems };
