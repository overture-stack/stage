module.exports = async function (csv, callback, separator) {
	const separatorRE = new RegExp(`(?!\\B"[^"]*)${separator}(?![^"]*"\\B)`);

	const headers = csv
		.split('\n')[0]
		.split(separatorRE)
		.map((header) => header.trim().replace(/\s/g, ''))
		.map((header) => header[0].toLowerCase() + header.slice(1));

	const rows = csv
		.slice(csv.indexOf('\n')) //remove headers
		.split(/\n/g)
		.map((rowSource) => rowSource.split(separatorRE))
		// .map((rowSource) => rowSource.split(/(?!\B"[^"]*),(?![^"]*"\B)/))
		.filter((row, rowNumber) => (row.length === headers.length ? true : console.log('discarded ', rowNumber, ':', row)))
		.map((row) => {
			const rowObject = headers.reduce((acc, header, index) => {
				const value = row[index] && row[index].replace(/("|\n)/g, '').trim();
				return {
					...acc,
					[header]: value,
				};
			}, {});

			return rowObject;
		});

	return callback?.(rows) || rows;
};
