// usage: node main.js source.json ../documents

const { promises: fs } = require('fs');
const path = require('path');

const csv2json = require('./csv2json');

const generateHashFromStr = async (string, isRandom) => {
	const multiplier = isRandom ? Math.floor(Math.random() * 8) + 1 : 1; // gives random number between 1 and 9, or multiplication modulo.

	const newHash = string.split('').reduce(function (a, b) {
		a = (a << 5) - a + b.charCodeAt(0);
		return Math.abs(a & a) * multiplier;
	}, 0);

	// reverse logic here. if the file exists, then retry, otherwise use the hash
	try {
		await fs.stat(`${newHash}.json`);
		return generateHashFromStr(string);
	} catch (error) {
		return newHash;
	}
};

const manipulateFields = (records) =>
	records.map((record) => ({
		...record,
		// studySample: record?.studySample?.replace(/,/g, '').split?.(' ')?.[0],
		// comparisonGroups: record?.comparisonGroups
		// 	?.toLowerCase?.()
		// 	.split(/vs\.?/)
		// 	.map((group) => group?.trim?.()),
	}));

const readFile = async (filePath) => {
	const content = await fs.readFile(filePath, 'utf-8');
	if (content.length > 0) {
		return content;
	}

	throw 'could not read source file, or it was empty';
};

const saveFile = async (filePath, randomFilenames) => {
	await fs.mkdir(filePath, { recursive: true });

	return async (content, rowNumber) => {
		const filename = [`${rowNumber}` || '']
			.filter(Boolean)
			.concat([content['DP'], content['AF'], content['minAD'], content['NonsynOI']])
			.join('_')
			.replace(/\*|\./g, '-');

		const hash = await generateHashFromStr(filename, randomFilenames);

		if (hash) {
			return fs.writeFile(path.join(path.resolve(filePath), `${hash}.json`), JSON.stringify(content, null, 2));
		}

		throw 'No Object ID to work with';
	};
};

const docMaker = async (sourceFilePath, destinationFilePath = './documents', separator = ',') => {
	try {
		const sourceData = await readFile(sourceFilePath);
		const saveFileToPath = await saveFile(destinationFilePath, 'make random filenames');

		const jsonFromCSV = await csv2json(sourceData, manipulateFields, separator);

		console.log('jsonFromCSV', jsonFromCSV.slice(0, 10));

		if (Array.isArray(jsonFromCSV) && jsonFromCSV.length > 0) {
			jsonFromCSV
				.slice(0, 10) // test data
				.forEach(saveFileToPath);
		} else {
			saveFileToPath(jsonFromCSV);
		}
	} catch (err) {
		console.error('found error', err);
	}
};

// node main.js source_file destination_folder optional_separator
// destination_folder defaults to "./documents"
// optional_separator could be "\t", etc. Defaults to ","

if (process.argv.length > 2) {
	// takes "source files path", "destination path"
	docMaker(process.argv[2], process.argv[3], process.argv[4]);
} else {
	console.error('missing parameters');
}
