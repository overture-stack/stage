# Stage

Stage is a simple yet powerful React-based user interface framework designed to facilitate the creation of browser-accessible data portals. While versatile enough to be used for various web applications, Stage is specifically tailored for building the front-end of data management platforms. It provides a robust foundation for developers to rapidly construct and customize data-centric web interfaces.

</br>

> <div>
> <img align="left" src="ov-logo.png" height="50"/>
> </div>
>
> Stage is part of [Overture](https://www.overture.bio/), a collection of open-source software microservices used to create platforms for researchers to organize and share genomics data.\*

## Repository Structure

The repository is organized with the following directory structure:

```
.
├── /components/
│   ├── /pages/
│   ├── /theme/
│   └── /utils/
├── /global/
│   ├── /hooks
│   └── /utils
├── /pages/
│   ├── /api/
│   ├── /explorer/
│   ├── /login/
│   └── /user/
├── /public
└── /tests
```

- **Components:** UI elements and tools used to compose Pages and features throughout the application. Includes standardized reusable elements for navigation, page layout, error states, theming, and page-specific features.
- **Pages:** The central location for the main application file and all page routes, based on [Next.js Pages Routing system](https://nextjs.org/docs/pages/building-your-application/routing). This contains the root \_app.jsx file and individual folders/files for each navigable page in the site. Implements code found in /global and /components.
- **Global:** Global: Utilities, definitions and configuration related to core processes for running the application, or used widely throughout the app. Covers functionality such as authentication & authorization, environment & context sharing, URL management and Page construction.
- **Public:** Static public assets such as SVGs and other images.
- **Tests:** Unit tests built in Jest for insuring code stability.

## Documentation

Technical resources for those working with or contributing to the project are available from our official documentation site, the following content can also be read and updated within the `/docs` folder of this repository.

- [**Stage Overview**](https://docs.overture.bio/docs/core-software/Stage/overview)
- [**Setting up the Development Environment**](https://docs.overture.bio/docs/core-software/Stage/setup)

## Development Environment

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (v8.3.0 or higher)
- [Docker](https://www.docker.com/) (v4.32.0 or higher)

## Support & Contributions

- For support, feature requests, and bug reports, please see our [Support Guide](https://docs.overture.bio/community/support).

- For detailed information on how to contribute to this project, please see our [Contributing Guide](https://docs.overture.bio/docs/contribution).

## Related Software

The Overture Platform includes the following Overture Components:

</br>

| Software                                                | Description                                                                               |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [Score](https://github.com/overture-stack/score/)       | Transfer data to and from any cloud-based storage system                                  |
| [Song](https://github.com/overture-stack/song/)         | Catalog and manage metadata associated to file data spread across cloud storage systems   |
| [Maestro](https://github.com/overture-stack/maestro/)   | Organizing your distributed data into a centralized Elasticsearch index                   |
| [Arranger](https://github.com/overture-stack/arranger/) | A search API with reusable search UI components                                           |
| [Stage](https://github.com/overture-stack/stage)        | A React-based web portal scaffolding                                                      |
| [Lyric](https://github.com/overture-stack/lyric)        | A model-agnostic, tabular data submission system                                          |
| [Lectern](https://github.com/overture-stack/lectern)    | Schema Manager, designed to validate, store, and manage collections of data dictionaries. |

If you'd like to get started using our platform [check out our quickstart guides](https://docs.overture.bio/guides/getting-started)

## Funding Acknowledgement

Overture is supported by grant #U24CA253529 from the National Cancer Institute at the US National Institutes of Health, and additional funding from Genome Canada, the Canada Foundation for Innovation, the Canadian Institutes of Health Research, Canarie, and the Ontario Institute for Cancer Research.
