# Setup

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (v8.3.0 or higher)
- [Docker](https://www.docker.com/) (v4.39.0 or higher)

## Developer Setup

Stage is the front-end scaffolding for an Overture portal, so it needs a search API to render anything. This guide runs Stage's development server on your host against a ready-made portal back end.

### Setting up supporting services

Stage queries an Arranger server, which in turn queries a search engine. Rather than assembling those yourself, use the search portal demo from the Prelude repository, which ships them preconfigured and preloaded with sample data.

1. Clone the demo and move into its directory:

   ```bash
   git clone -b docs-demo/search-portal-workshop https://github.com/overture-stack/prelude.git
   cd prelude
   ```

2. Start the demo:

   ```bash
   make demo
   ```

   <details>
   <summary>**Click here for a detailed breakdown**</summary>

   `make demo` runs a pre-deployment check, then brings up the portal and loads the sample data into it:

   | Service       | Port   | Description                              | Purpose in Stage Development                             |
   | ------------- | ------ | ---------------------------------------- | -------------------------------------------------------- |
   | Elasticsearch | `9200` | Search and analytics engine              | Stores and indexes the data Arranger queries             |
   | Arranger      | `5050` | GraphQL API for data querying            | The API your Stage development server will talk to       |
   | Postgres      | -      | Relational database used by the demo     | Backs the demo's data submission flow                    |
   | Stage         | `3000` | The demo's own portal UI                 | The finished result, for comparison; not the copy you edit |

   - Elasticsearch and Arranger are bound to `127.0.0.1` only, so they are reachable from your host but not from your network.
   - Elasticsearch runs with authentication enabled. The demo's default credentials are `elastic` / `myelasticpassword`.
   - The demo brings up its **own** Stage container on port `3000`. Your development server therefore needs a different port; step 4 below uses `3001`. If port `3000` is already occupied when you run `make demo`, the demo moves its own Stage to `3001` instead and reports so, in which case pick another port for your server.
   - This demo does not include Keycloak, so there is no authentication provider to log in against. See the note on authentication in the next section.
   - `make down` shuts the demo down while preserving its data; `make status` shows what is running. For a full walkthrough of the demo and the data behind it, see [Running the Demo](/use/workshop/running-the-demo).

   </details>

In the next steps, we will run a Stage development server against these supporting services.

### Running the Development Server

1.  Clone Stage and move into its directory:

    ```bash
    git clone https://github.com/overture-stack/stage.git
    cd stage
    ```

2.  Configure environment variables:

    ```bash
    cp .env.schema .env
    ```

    :::info

    Copy the `.env.schema` template to `.env` and populate it for your environment. A configuration that points Stage at the demo started above looks like this:

         ```
          # Stage Variables
          NEXTAUTH_URL=http://localhost:3001/api/auth
          NEXT_PUBLIC_LAB_NAME=Stage Development Environment
          NEXT_PUBLIC_ADMIN_EMAIL=contact@overture.bio
          NEXT_PUBLIC_DEBUG=true

          # Auth: left unset because the demo ships no identity provider
          NEXT_PUBLIC_AUTH_PROVIDER=
          ACCESSTOKEN_ENCRYPTION_SECRET=super_secret
          SESSION_ENCRYPTION_SECRET=this_is_a_super_secret_secret

          # Arranger Variables
          NEXT_PUBLIC_ARRANGER_API_URL=http://localhost:5050
          NEXT_PUBLIC_ARRANGER_DOCUMENT_TYPE=records
          NEXT_PUBLIC_ARRANGER_INDEX=datatable1-index
          NEXT_PUBLIC_ARRANGER_MANIFEST_COLUMNS=
         ```

         <details>
           <summary>**Click here for a detailed explanation of the Stage environment variables**</summary>
            - **Stage Variables**

               - `NEXTAUTH_URL`: Specifies the base URL for NextAuth.js, which handles authentication in Next.js applications. This setting is used to configure the authentication flow, including where to redirect users after successful authentication. It must match the port your development server runs on.
               - `NEXT_PUBLIC_LAB_NAME`: The name displayed in the top left of the portal interface. Feel free to customize this.
               - `NEXT_PUBLIC_ADMIN_EMAIL`: The email address of the administrator or support contact. This setting updates the help link found by default in the footer navigation of the portal interface.
               - `NEXT_PUBLIC_DEBUG`: Enables verbose client-side logging.

            - **Auth Variables**

               - `NEXT_PUBLIC_AUTH_PROVIDER`: Selects the identity provider, either `keycloak` or `ego`. Left empty here: the search portal demo ships no identity provider, and Stage hides its login and profile controls when this is unset. To develop against Keycloak, set this to `keycloak`, populate the `NEXT_PUBLIC_KEYCLOAK_*` variables and `KEYCLOAK_CLIENT_SECRET` from the template, and supply a Keycloak instance yourself.
               - `ACCESSTOKEN_ENCRYPTION_SECRET`: Defines the secret used to encrypt access tokens, enhancing security by preventing easy decoding of intercepted tokens.
               - `SESSION_ENCRYPTION_SECRET`: Specifies the secret used to encrypt session cookies, protecting sensitive information stored in the cookie from unauthorized access.

            - **Arranger Variables**
               - `NEXT_PUBLIC_ARRANGER_API_URL`: The URL of the Arranger GraphQL API. The demo publishes Arranger on port `5050`.
               - `NEXT_PUBLIC_ARRANGER_DOCUMENT_TYPE`: The GraphQL type name for the catalogue's documents, set by the demo's Arranger configuration to `records`.
               - `NEXT_PUBLIC_ARRANGER_INDEX`: The index Arranger queries, set by the demo's Arranger configuration to `datatable1-index`.
               - `NEXT_PUBLIC_ARRANGER_MANIFEST_COLUMNS`: Lists the columns to be included in the manifest generated for download with Score. The search portal demo includes no Score service, so this can be left empty.
         </details>

    :::

3.  Install the required npm packages:

    ```bash
    npm ci
    ```

    :::tip
    Ensure you are running Node.js v16 or higher. To check, you can run `node --version`. You should see something similar to the following:

    ```bash
    v16.14.0
    ```

    :::

4.  Start the Stage development server on a port the demo is not already using:

    ```bash
    npm run dev -- -p 3001
    ```

### Verification

After installation and configuration, verify that Stage is functioning correctly:

1. **Check the Stage UI**

   - Navigate to `http://localhost:3001` in a web browser.
   - Expected result: You should see the Stage front-end UI, served by your development server rather than the demo's container on port `3000`.
   - Troubleshooting:
     - Check your browser's console for error messages.
     - Verify that you're using the correct URL and port.

2. **Check the connection to Arranger**

   - Navigate to the portal's explorer page.
   - Expected result: The data table and facets populate with the demo's sample records.
   - Troubleshooting:
     - Confirm Arranger is reachable: `curl http://localhost:5050/ping`.
     - Verify `NEXT_PUBLIC_ARRANGER_API_URL`, `NEXT_PUBLIC_ARRANGER_DOCUMENT_TYPE`, and `NEXT_PUBLIC_ARRANGER_INDEX` match the demo's Arranger configuration.
     - Restart the development server after changing `.env`; Next.js reads these values at start-up.

3. **Check your theming changes apply**
   - Edit a value under `components/theme/` and save.
   - Expected result: The running server rebuilds and the change appears in the browser.

:::note Authentication

Login, the user profile page, and API key generation all require an identity provider, which the search portal demo does not include. To exercise those flows, point `NEXT_PUBLIC_AUTH_PROVIDER` at a Keycloak instance you supply and complete the `NEXT_PUBLIC_KEYCLOAK_*` variables in `.env.schema`.

:::

:::info Need Help?
If you encounter any issues or have questions about our API, please don't hesitate to reach out through our [**support page**](/community/support) or our [**discussion forum**](https://github.com/overture-stack/docs/discussions?discussions_q=).
:::

:::warning
This guide is meant to demonstrate the configuration and usage of Stage for development purposes and is not intended for production. If you ignore this warning and use this in any public or production environment, please remember to use appropriate security measures and configure your environment variables accordingly.
:::
