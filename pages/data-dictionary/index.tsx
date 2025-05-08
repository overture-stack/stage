import { createPage } from '../../global/utils/pages';

const DataDictionary  = createPage({
	getInitialProps: async () => {},
	isPublic: true,
})(() => {
	return (
        <div>
            Welcome to the Data Dictionary page!
            <p>
                This is where all the data will be!
            </p>
        </div>
    ) 
});

export default DataDictionary;