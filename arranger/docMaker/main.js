// usage: node main.js source.json ../documents

const { promises: fs } = require('fs');
const path = require('path');

const csv2json = require('./csv2json');

const generateHashFromStr = (str) =>
	str.split('').reduce(function (a, b) {
		a = (a << 5) - a + b.charCodeAt(0);
		return a & a;
	}, 0);

const manipulateFields = (records) =>
	records.map((record) => ({
		...record,
		studySample: record?.studySample?.replace(/,/g, '').split?.(' ')?.[0],
		comparisonGroups: record?.comparisonGroups
			?.toLowerCase?.()
			.split(/vs\.?/)
			.map((group) => group?.trim?.()),
	}));

const readFile = async (filePath) => {
	const content = await fs.readFile(filePath, 'utf-8');
	if (content.length > 0) {
		return content;
	}

	throw 'could not read source file, or it was empty';
};

const saveFile = (filePath) => (content) => {
	const hash = generateHashFromStr(content['studyURL']);

	if (hash) {
		return fs.writeFile(
			path.join(path.resolve(filePath), `${hash}.json`),
			JSON.stringify(content, null, 2),
		);
	}

	throw 'No Object ID to work with';
};

const docMaker = async (sourceFilePath, destinationFilePath) => {
	try {
		const sourceData = await readFile(sourceFilePath);
		const saveFileToPath = await saveFile(destinationFilePath);

		const jsonFromCSV = await csv2json(sourceData, manipulateFields);

		if (Array.isArray(jsonFromCSV) && jsonFromCSV.length > 0) {
			jsonFromCSV.forEach(saveFileToPath);
		} else {
			saveFileToPath(jsonFromCSV);
		}
	} catch (err) {
		console.error('found error', err);
	}
};

if (process.argv.length > 2) {
	// takes "source files path", "destination path"
	docMaker(process.argv[2], process.argv[3]);
} else {
	console.error('missing parameters');
}
