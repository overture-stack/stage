import { createPage } from '../../global/utils/pages';
import DataDictionaryPage from '@/components/pages/data-dictionary';

const DataDictionary = createPage({
	getInitialProps: async () => {},
	isPublic: true,
})(() => {
	return <DataDictionaryPage />;
});

export default DataDictionary;
