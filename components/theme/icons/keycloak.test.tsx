import { renderToStaticMarkup } from 'react-dom/server';

import KeycloakLogo from './keycloak';

describe('KeycloakLogo', () => {
	it('draws at the size it is given', () => {
		const markup = renderToStaticMarkup(<KeycloakLogo width={20} height={20} />);

		expect(markup).toMatch(/<svg[^>]* width="20"/);
		expect(markup).toMatch(/<svg[^>]* height="20"/);
	});

	it('frames the square Keycloak mark rather than the wide wordmark, so it stays legible in an icon slot', () => {
		const markup = renderToStaticMarkup(<KeycloakLogo width={20} height={20} />);

		expect(markup).toContain('viewBox="17 236 142 128"');
	});
});
