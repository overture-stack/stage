import { css } from '@emotion/react';
import PageLayout from '../../PageLayout';

const DataDictionaryPage = () => {
	return (
		<PageLayout subtitle="Data Dictionary">
			<div
                css ={(theme) => css`
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    background-color: ${theme.colors.white};
                    border-radius: 8px;
                    padding: 20px;
                `}
            >Welcome to the Data Dictionary page!</div>
		</PageLayout>
	);
};

export default DataDictionaryPage;
