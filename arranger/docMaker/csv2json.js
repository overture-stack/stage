module.exports = async function (csv, callback) {
	const headers = csv
		.split('\n')[0]
		.split(',')
		.map((header) => header.trim().replace(/\s/g, ''))
		.map((header) => header[0].toLowerCase() + header.slice(1));

	const rows = csv
		.slice(csv.indexOf('\n')) //remove headers
		.split(/\n/g)
		.map((rowSource) => rowSource.split(/(?!\B"[^"]*),(?![^"]*"\B)/))
		.filter((row) => (row.length === headers.length ? true : console.log('discarded', row)))
		.map((row) =>
			headers.reduce((acc, header, index) => {
				const value = row[index] && row[index].replace(/("|\n)/g, '').trim();

				return {
					...acc,
					[header]: value,
				};
			}, {}),
		);

	return callback?.(rows) || rows;
};
