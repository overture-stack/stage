import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

interface SwaggerProps {
	endpointPath: string;
}

// OpenAPI specification
import fullSpec from '../../../public/swagger.json';

// Custom component to display a specific endpoint
const SwaggerEndpoint = ({ endpointPath }: SwaggerProps) => {
	// Function to filter the specification to include only the specified endpoint
	const filterSpecToEndpoint = (spec: any, path: string) => {
		const filteredSpec = { ...spec };
		filteredSpec.paths = {
			[path]: spec.paths[path],
		};
		return filteredSpec;
	};

	// Filter the full specification to include only the specified endpoint
	const filteredSpec = filterSpecToEndpoint(fullSpec, endpointPath);

	// Render the SwaggerUI component with the filtered specification
	return <SwaggerUI spec={filteredSpec} />;
};

export default SwaggerEndpoint;
