import type { NextApiRequest, NextApiResponse } from 'next';
import * as lectern from '@overture-stack/lectern-client';

const lecternUrl = 'http://lectern.example.com'; //Replace with your actual lectern URL
const dictionaryName = 'dictionary-name'; //Replace with your actual dictionary name
const version = 'latest'; //Replace with your actual version

export default async function lecternHandler(req: NextApiRequest, res: NextApiResponse) {
	try {
		// add any complex logic here for the actual dictionary
		const dictionary = await lectern.rest.fetchSchema(lecternUrl, dictionaryName, version);
		res.status(200).json({ dictionary });
	} catch (error: any) {
		res.status(500).json({ error: 'Failed to fetch lectern schema' });
	}
}
