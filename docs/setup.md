# Setup

Stage is a front-end UI that complements Arranger's search UI components. This guide will walk you through setting up a complete development environment, including Stage and its complementary services.

![Stage Dev](./assets/stageDev.svg 'Stage Dev Environment')

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (v16 or higher)
- npm (v8.3.0 or higher)
- Docker (v4.32.0 or higher)

## Installation

### 1. Set up complementary services

We'll use our Conductor service, a flexible Docker Compose setup, to spin up Stage's complementary services.

```bash
git clone https://github.com/overture-stack/conductor.git
cd conductor
```

Next, run the appropriate start command for your operating system:

| Operating System | Command |
|------------------|---------|
| Unix/macOS       | `make stageDev` |
| Windows          | `make.bat stageDev` |

This command will set up all necessary services for Stage development.

### 2. Clone and set up Stage

Now, let's set up Stage itself:

```bash
git clone https://github.com/overture-stack/stage.git
cd stage
```

### 3. Configure environment variables

Rename the `.env.stage` file to `.env`:

```bash
mv .env.stage .env
```

This `.env` file is preconfigured for the Stage dev environment quickstart. Here's a summary of the key environment variables:

```env
# ==============================
# Stage Environment Variables
# ==============================

# Stage Variables
NEXTAUTH_URL=http://localhost:3000/api/auth
NEXT_PUBLIC_LAB_NAME=Stage Development Environment
NEXT_PUBLIC_ADMIN_EMAIL=contact@overture.bio
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_SHOW_MOBILE_WARNING=true

# Keycloak Variables
NEXT_PUBLIC_AUTH_PROVIDER=keycloak
ACCESSTOKEN_ENCRYPTION_SECRET=super_secret
SESSION_ENCRYPTION_SECRET=this_is_a_super_secret_secret
NEXT_PUBLIC_KEYCLOAK_HOST=http://keycloak:8080
NEXT_PUBLIC_KEYCLOAK_REALM=myrealm
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=webclient
KEYCLOAK_CLIENT_SECRET=ikksyrYaKX07acf4hpGrpKWcUGaFkEdM
NEXT_PUBLIC_KEYCLOAK_PERMISSION_AUDIENCE=dms

# Arranger Variables
NEXT_PUBLIC_ARRANGER_DOCUMENT_TYPE=file
NEXT_PUBLIC_ARRANGER_INDEX=file_centric
NEXT_PUBLIC_ARRANGER_API_URL=http://arranger-server:5050
NEXT_PUBLIC_ARRANGER_MANIFEST_COLUMNS=repositories.code, object_id, analysis.analysis_id, study_id, file_type, file.name, file.size, file.md5sum, file.index_file.object_id, donors.donor_id, donors.specimens.samples.sample_id
```

<details>
  <summary><b>Detailed explanation of Stage's environment variables</b></summary>

- **Stage Variables**
    - `NEXTAUTH_URL`: Specifies the base URL for NextAuth.js, which handles authentication in Next.js applications. This setting is used to configure the authentication flow, including where to redirect users after successful authentication.
    - `NEXT_PUBLIC_LAB_NAME`: The name displayed in the top left of the portal interface. Feel free to customize this.
    - `NEXT_PUBLIC_ADMIN_EMAIL`: The email address of the administrator or support contact. This setting updates the help link found by default in the footer navigation of the portal interface.

- **Keycloak Variables**
    - `NEXT_PUBLIC_AUTH_PROVIDER`: Specifies the authentication provider, in this case, "keycloak".
    - `ACCESSTOKEN_ENCRYPTION_SECRET`: Defines the secret used to encrypt access tokens, enhancing security by preventing easy decoding of intercepted tokens.
    - `SESSION_ENCRYPTION_SECRET`: Specifies the secret used to encrypt session cookies, protecting sensitive information stored in the cookie from unauthorized access.
    - `NEXT_PUBLIC_KEYCLOAK_HOST`: Specifies the URL where the Keycloak server is hosted (e.g., "http://localhost:8080").
    - `NEXT_PUBLIC_KEYCLOAK_REALM`: Defines the realm in Keycloak that contains the users and roles for the application.
    - `NEXT_PUBLIC_KEYCLOAK_CLIENT_ID`: The client ID for the Keycloak application.
    - `KEYCLOAK_CLIENT_SECRET`: The client secret for the Keycloak application.
    - `NEXT_PUBLIC_KEYCLOAK_PERMISSION_AUDIENCE`: Specifies the audience for the permission claims in the access token, restricting the scope of access granted to the token.

- **Arranger Variables**
    - `NEXT_PUBLIC_ARRANGER_DOCUMENT_TYPE`: Specifies whether the index is file-centric or analysis (participant) centric.
    - `NEXT_PUBLIC_ARRANGER_INDEX`: Defines the index used by the Arranger service.
    - `NEXT_PUBLIC_ARRANGER_API_URL`: The URL of the Arranger GraphQL API. By default, Arranger's API is mapped to port 5050.
    - `NEXT_PUBLIC_ARRANGER_MANIFEST_COLUMNS`: Lists the columns to be included in the manifest generated for download with Score.

</details>

### 4. Start the development server

Install the required npm packages:

```bash
npm ci
```

Launch the Stage development server:

```bash
npm run dev
```

Once the server starts, you can access Stage at `http://localhost:3000`.

## Troubleshooting

If you encounter any issues during setup:

1. Ensure all prerequisites are correctly installed and at the specified versions.
2. Check that all services in the Docker Compose setup are running correctly.
3. Verify that your `.env` file contains the correct configuration.
4. If you're having network issues, ensure that the ports specified in the configuration are not being used by other services.

For further assistance, feel free to [open an issue through GitHub here](https://github.com/overture-stack/stage/issues/new?assignees=&labels=&projects=&template=Feature_Requests.md).