const {
	PHASE_DEVELOPMENT_SERVER,
	PHASE_PRODUCTION_BUILD,
	PHASE_PRODUCTION_SERVER,
} = require('next/constants');

const { findAuthSecretProblems } = require('./authSecrets');

const sessionSecretOfLength = (length) => 's'.repeat(length);

const keycloakSecrets = {
	KEYCLOAK_CLIENT_SECRET: 'client-secret',
	SESSION_ENCRYPTION_SECRET: sessionSecretOfLength(32),
};

describe('findAuthSecretProblems', () => {
	it('names both secrets as required when Keycloak sign-in has neither', () => {
		expect(findAuthSecretProblems({ NEXT_PUBLIC_AUTH_PROVIDER: 'keycloak' })).toEqual([
			'KEYCLOAK_CLIENT_SECRET is required',
			'SESSION_ENCRYPTION_SECRET is required',
		]);
	});

	it('names the client secret when only it is missing', () => {
		expect(
			findAuthSecretProblems({
				NEXT_PUBLIC_AUTH_PROVIDER: 'keycloak',
				SESSION_ENCRYPTION_SECRET: keycloakSecrets.SESSION_ENCRYPTION_SECRET,
			}),
		).toEqual(['KEYCLOAK_CLIENT_SECRET is required']);
	});

	it('treats an empty value as missing', () => {
		expect(
			findAuthSecretProblems({ ...keycloakSecrets, NEXT_PUBLIC_AUTH_PROVIDER: 'keycloak', SESSION_ENCRYPTION_SECRET: '' }),
		).toEqual(['SESSION_ENCRYPTION_SECRET is required']);
	});

	it('refuses a session secret shorter than 32 characters, naming the requirement', () => {
		expect(
			findAuthSecretProblems({
				...keycloakSecrets,
				NEXT_PUBLIC_AUTH_PROVIDER: 'keycloak',
				SESSION_ENCRYPTION_SECRET: sessionSecretOfLength(31),
			}),
		).toEqual(['SESSION_ENCRYPTION_SECRET must be at least 32 characters']);
	});

	it('accepts a session secret of exactly 32 characters', () => {
		expect(
			findAuthSecretProblems({
				...keycloakSecrets,
				NEXT_PUBLIC_AUTH_PROVIDER: 'keycloak',
				SESSION_ENCRYPTION_SECRET: sessionSecretOfLength(32),
			}),
		).toEqual([]);
	});

	it('names nothing when Keycloak sign-in has both secrets', () => {
		expect(findAuthSecretProblems({ ...keycloakSecrets, NEXT_PUBLIC_AUTH_PROVIDER: 'keycloak' })).toEqual([]);
	});

	it('reads the provider name in any letter case', () => {
		expect(findAuthSecretProblems({ NEXT_PUBLIC_AUTH_PROVIDER: 'Keycloak' })).toHaveLength(2);
	});

	it('requires neither secret when Keycloak sign-in is not configured', () => {
		expect(findAuthSecretProblems({ NEXT_PUBLIC_AUTH_PROVIDER: 'ego' })).toEqual([]);
		expect(findAuthSecretProblems({})).toEqual([]);
	});
});

describe('Stage startup with Keycloak sign-in', () => {
	const managedVariables = ['NEXT_PUBLIC_AUTH_PROVIDER', 'KEYCLOAK_CLIENT_SECRET', 'SESSION_ENCRYPTION_SECRET'];
	const saved = Object.fromEntries(managedVariables.map((name) => [name, process.env[name]]));

	const loadConfigFor = (phase) => require('../../next.config.js')(phase, { defaultConfig: {} });

	beforeEach(() => {
		managedVariables.forEach((name) => delete process.env[name]);
		process.env.NEXT_PUBLIC_AUTH_PROVIDER = 'keycloak';
	});

	afterAll(() => {
		managedVariables.forEach((name) =>
			saved[name] === undefined ? delete process.env[name] : (process.env[name] = saved[name]),
		);
	});

	it('refuses to start the production server without its secrets, naming them', () => {
		expect(() => loadConfigFor(PHASE_PRODUCTION_SERVER)).toThrow(
			/KEYCLOAK_CLIENT_SECRET is required; SESSION_ENCRYPTION_SECRET is required/,
		);
	});

	it('refuses to start the development server without its secrets', () => {
		expect(() => loadConfigFor(PHASE_DEVELOPMENT_SERVER)).toThrow(/KEYCLOAK_CLIENT_SECRET/);
	});

	it('refuses to start the production server with a placeholder session secret', () => {
		Object.assign(process.env, keycloakSecrets, { SESSION_ENCRYPTION_SECRET: 'abc' });

		expect(() => loadConfigFor(PHASE_PRODUCTION_SERVER)).toThrow(/at least 32 characters/);
	});

	it('starts the production server when both secrets are set', () => {
		Object.assign(process.env, keycloakSecrets);

		expect(() => loadConfigFor(PHASE_PRODUCTION_SERVER)).not.toThrow();
	});

	it('builds without the secrets, since images are built before secrets are injected', () => {
		expect(() => loadConfigFor(PHASE_PRODUCTION_BUILD)).not.toThrow();
	});
});
