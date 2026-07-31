# Setup

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (v8.3.0 or higher)
- [Docker](https://www.docker.com/) (v4.39.0 or higher), used to run the supporting services

## Developer Setup

Stage is the front-end scaffolding for an Overture portal. Its explorer page is assembled from Arranger's UI components, so the data table, facets, and query bar have nothing to render until an Arranger search API is behind them, and Arranger in turn needs a search engine to query. Those are the complementary services this guide starts: they are what feeds the Arranger component UI inside Stage. The repository ships them under `dev-services/`, so no other repository is required.

### Setting up complementary services

1.  Clone Stage and move into its directory:

    ```bash
    git clone https://github.com/overture-stack/stage.git
    cd stage
    ```

2.  Start the complementary services:

    ```bash
    cd dev-services
    make up
    ```

    <details>
    <summary>**Click here for a detailed breakdown**</summary>

    `make up` starts the two services Stage queries and loads mock ARGO clinical data into them, waiting until Arranger is actually serving the catalogue before it returns:

    | Service    | Port   | Description                   | Purpose in Stage Development                        |
    | ---------- | ------ | ----------------------------- | --------------------------------------------------- |
    | OpenSearch | `9200` | Search engine                 | Holds `donor-index`, the data Arranger reads        |
    | Arranger   | `5050` | GraphQL API for data querying | The search API your development server will talk to |

    A one-shot `setup` container applies the index template, creates `donor-index` with its `donor_centric` alias, and bulk-loads `data/donor.ndjson`. It is idempotent, so it skips work already done on subsequent starts.

    - Both services are bound to `127.0.0.1`, so they are reachable from your host but not from your network.
    - OpenSearch runs with its security plugin disabled, so no credentials are needed. Never disable security on anything network-exposed.
    - Stage itself is **not** containerized here. The copy you edit is the one you run in the next section.
    - The sample data is 373 mock ARGO clinical donor records, each carrying nested specimen, diagnosis, treatment, follow-up, and biomarker entities. The records and the Arranger catalogue configuration are taken from the Prelude `docs-demo/ai-assisted-data-discovery` demo, so a portal built here lines up with that one.
    - Arranger serves one catalogue per directory under `dev-services/configs/arranger`. With a single catalogue registered it mounts that catalogue at the root, `http://localhost:5050/graphql`, and only switches to `/<catalogue>/graphql` once more than one is registered. Stage reads a single catalogue, so this stack ships one, named `donor`, and `NEXT_PUBLIC_ARRANGER_API_URL` needs no catalogue path. If you add a second catalogue, that URL has to become `http://localhost:5050/donor`.
    - `make down` stops the services while keeping the loaded data, `make status` shows what is running, and `make logs` follows the Arranger and OpenSearch logs. `make reset` deletes the search engine volume, so the next `make up` reloads the data from scratch. `make` on its own lists every target.

    </details>

3.  Confirm Arranger is serving the catalogue before moving on:

    ```bash
    curl -s -X POST -H 'Content-Type: application/json' \
      -d '{"query":"{ records { hits { total } } }"}' \
      http://localhost:5050/graphql
    ```

    Expected result: `{"data":{"records":{"hits":{"total":373}}}}`.

### Running the Development Server

1.  Return to the repository root:

    ```bash
    cd ..
    ```

2.  Configure environment variables:

    ```bash
    cp .env.schema .env
    ```

    :::info

    Copy the `.env.schema` template to `.env` and populate it for your environment. A configuration that points Stage at the services started above looks like this:

         ```
          # Stage Variables
          NEXTAUTH_URL=http://localhost:3001/api/auth
          NEXT_PUBLIC_LAB_NAME=Stage Development Environment
          NEXT_PUBLIC_ADMIN_EMAIL=contact@overture.bio
          NEXT_PUBLIC_DEBUG=true

          # Auth: left unset because this stack ships no identity provider
          NEXT_PUBLIC_AUTH_PROVIDER=
          ACCESSTOKEN_ENCRYPTION_SECRET=super_secret
          SESSION_ENCRYPTION_SECRET=this_is_a_super_secret_secret

          # Arranger Variables
          NEXT_PUBLIC_ARRANGER_API_URL=http://localhost:5050
          NEXT_PUBLIC_ARRANGER_DOCUMENT_TYPE=records
          NEXT_PUBLIC_ARRANGER_INDEX=donor-index
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

               - `NEXT_PUBLIC_AUTH_PROVIDER`: Selects the identity provider, either `keycloak` or `ego`. Left empty here: this stack ships no identity provider, and Stage hides its login and profile controls when this is unset. To develop against Keycloak, set this to `keycloak`, populate the `NEXT_PUBLIC_KEYCLOAK_*` variables and `KEYCLOAK_CLIENT_SECRET` from the template, and supply a Keycloak instance yourself.
               - `ACCESSTOKEN_ENCRYPTION_SECRET`: Defines the secret used to encrypt access tokens, enhancing security by preventing easy decoding of intercepted tokens.
               - `SESSION_ENCRYPTION_SECRET`: Specifies the secret used to encrypt session cookies, protecting sensitive information stored in the cookie from unauthorized access.

            - **Arranger Variables**
               - `NEXT_PUBLIC_ARRANGER_API_URL`: The URL of the Arranger GraphQL API. The `dev-services` stack publishes Arranger on port `5050`.
               - `NEXT_PUBLIC_ARRANGER_DOCUMENT_TYPE`: The GraphQL type name for the catalogue's documents, set by `dev-services/configs/arranger/donor/base.json` to `records`.
               - `NEXT_PUBLIC_ARRANGER_INDEX`: The index Arranger queries, set by `dev-services/configs/arranger/donor/base.json` to `donor-index`.
               - `NEXT_PUBLIC_ARRANGER_MANIFEST_COLUMNS`: Lists the columns to be included in the manifest generated for download with Score. The `dev-services` stack includes no Score service, so this can be left empty.
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

4.  Start the Stage development server. Port `3001` is used here to leave `3000` free, since a local docs site or another portal commonly occupies it:

    ```bash
    npm run dev -- -p 3001
    ```

### Verification

After installation and configuration, verify that Stage is functioning correctly:

1. **Check the Stage UI**
   - Navigate to `http://localhost:3001` in a web browser.
   - Expected result: You should see the Stage front-end UI, served by your development server.
   - Troubleshooting:
     - Check your browser's console for error messages.
     - Verify that you're using the correct URL and port.

2. **Check the connection to Arranger**
   - Navigate to the portal's explorer page.
   - Expected result: The data table and facets populate with the mock ARGO donor records.
   - Troubleshooting:
     - Confirm Arranger is serving the catalogue, using the same query as step 3 above. `/ping` is not enough on its own: it answers even when the catalogue failed to mount.
     - Verify `NEXT_PUBLIC_ARRANGER_API_URL`, `NEXT_PUBLIC_ARRANGER_DOCUMENT_TYPE`, and `NEXT_PUBLIC_ARRANGER_INDEX` match `dev-services/configs/arranger/donor/base.json`.
     - Restart the development server after changing `.env`; Next.js reads these values at start-up.

3. **Check your theming changes apply**
   - Edit a value under `components/theme/` and save.
   - Expected result: The running server rebuilds and the change appears in the browser.

:::note Authentication

Login, the user profile page, and API key generation all require an identity provider, which the `dev-services` stack does not include. To exercise those flows, point `NEXT_PUBLIC_AUTH_PROVIDER` at a Keycloak instance you supply and complete the `NEXT_PUBLIC_KEYCLOAK_*` variables in `.env.schema`.

:::

:::info Need Help?
If you encounter any issues or have questions about our API, please don't hesitate to reach out through our [**support page**](https://docs.overture.bio/community/support) or our [**discussion forum**](https://github.com/overture-stack/docs/discussions?discussions_q=).
:::

:::warning
This guide is meant to demonstrate the configuration and usage of Stage for development purposes and is not intended for production. If you ignore this warning and use this in any public or production environment, please remember to use appropriate security measures and configure your environment variables accordingly.
:::
