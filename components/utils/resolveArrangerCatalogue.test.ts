import { resolveArrangerCatalogue } from './resolveArrangerCatalogue';

describe('resolveArrangerCatalogue', () => {
	it('resolves the single available catalogue', () => {
		const introspection = { catalogs: { 'catalogue-a': { status: 'available' } } };

		expect(resolveArrangerCatalogue(introspection)).toEqual({
			status: 'resolved',
			catalogueId: 'catalogue-a',
		});
	});

	it('returns none when the only registered catalogue has failed', () => {
		const introspection = { catalogs: { 'catalogue-a': { status: 'failed' } } };

		expect(resolveArrangerCatalogue(introspection)).toEqual({ status: 'none' });
	});

	it('returns none when the introspection response has no catalogs', () => {
		expect(resolveArrangerCatalogue({})).toEqual({ status: 'none' });
	});

	it('returns none when the introspection response is undefined', () => {
		expect(resolveArrangerCatalogue(undefined)).toEqual({ status: 'none' });
	});

	it('returns ambiguous with every available catalogue id when more than one is available', () => {
		const introspection = {
			catalogs: {
				'catalogue-a': { status: 'available' },
				'catalogue-b': { status: 'available' },
				'catalogue-c': { status: 'failed' },
			},
		};

		expect(resolveArrangerCatalogue(introspection)).toEqual({
			status: 'ambiguous',
			catalogueIds: ['catalogue-a', 'catalogue-b'],
		});
	});

	describe('with allowedCatalogueIdentifiers', () => {
		const introspection = {
			catalogs: {
				'catalogue-a': { documentType: 'participant', status: 'available' },
				'catalogue-b': { documentType: 'biosample', status: 'available' },
				'catalogue-c': { documentType: 'biosample', status: 'available' },
			},
		};

		it('matches by catalogue id', () => {
			expect(resolveArrangerCatalogue(introspection, ['catalogue-a'])).toEqual({
				status: 'resolved',
				catalogueId: 'catalogue-a',
			});
		});

		it('matches by document type', () => {
			expect(resolveArrangerCatalogue(introspection, ['participant'])).toEqual({
				status: 'resolved',
				catalogueId: 'catalogue-a',
			});
		});

		it('stays ambiguous when a document type matches more than one catalogue', () => {
			expect(resolveArrangerCatalogue(introspection, ['biosample'])).toEqual({
				status: 'ambiguous',
				catalogueIds: ['catalogue-b', 'catalogue-c'],
			});
		});

		it('mixes catalogue ids and document types in the same allowlist', () => {
			expect(resolveArrangerCatalogue(introspection, ['catalogue-a', 'biosample'])).toEqual({
				status: 'ambiguous',
				catalogueIds: ['catalogue-a', 'catalogue-b', 'catalogue-c'],
			});
		});

		it('returns none when nothing available matches any allowed value', () => {
			expect(resolveArrangerCatalogue(introspection, ['no-such-catalogue'])).toEqual({
				status: 'none',
			});
		});

		it('behaves exactly as the unrestricted case when given an empty list', () => {
			expect(resolveArrangerCatalogue(introspection, [])).toEqual(resolveArrangerCatalogue(introspection));
		});
	});
});
