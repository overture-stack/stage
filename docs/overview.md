# Overview

Stage is a simple yet powerful React-based user interface framework designed to facilitate the creation of browser-accessible data portals. While versatile enough to be used for various web applications, Stage is specifically tailored for building the front-end of data management platforms. It provides a robust foundation for developers to rapidly construct and customize data-centric web interfaces.

## System Architecture

Stage functions primarily as a scaffold for creating custom data portal user interfaces. It achieves this by providing fundamental portal UI components for navigation, authentication, and data exploration.

![Stage Dev](./assets/stageDev.svg 'Stage Dev Environment')

As part of the larger Overture.bio software suite, Stage is typically used with multiple other services including:

- **Arranger Server:** A search API service that generates a GraphQL API from Elasticsearch mappings, providing an intermediary layer that simplifies querying and filtering Elasticsearch data using SQON syntax, without directly interacting with complex Elasticsearch queries.
- **Arranger Components:** A library of React components for building interactive search UIs. Includes faceted search, data tables, and SQON viewers. Communicates with Arranger Server to fetch and display data.
- **Keycloak:** The authorization and authentication service used to provided OAuth2 authentication and API key generation for Stage.

## Key Features

- **Modular Architecture**: Stage offers a flexible, component-based structure that allows for easy customization and extension of the user interface.
- **Identity and Access Management**: Pre-built login and profile pages integrated with Keycloak, supporting various SSO-identity provider logins including Google, GitHub, LinkedIn, and ORCiD.
- **Data Exploration UI**: Seamlessly integrates with Arranger for powerful, API-linked data exploration components.
- **URL Parameterization**: Supports dynamic URLs that can be modified or updated based on input parameters, enhancing the flexibility and shareability of application states.
- **Extensible Layout**: Provides a customizable foundation for creating tailored UIs, including configurable footer and navbar with primary and secondary menus.
- **Theme Customization**: Utilizes Emotion for dynamic styling, offering fine-grained control over individual component appearances.

## Repository Structure

```
.
├── /components/
│   ├── /pages/
│   ├── /theme/
│   └── /utils/
├── /global
├── /pages/
│   ├── /api/
│   ├── /explorer/
│   ├── /login/
│   └── /user/
├── /public
└── /tests
```

[Click here to view the Stage respository on GitHub ](https://github.com/overture-stack/stage)

#### Components

[Explaination]

#### Global

[Explaination]

#### Pages

[Explaination]

#### Public

[Explaination]

#### Tests

[Explaination]
