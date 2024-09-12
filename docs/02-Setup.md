# Setup

## Run using npm

### Prerequisites

- Node.js (version X.X or higher)
- npm (version X.X or higher) or pnpm (version X.X or higher)

### Installation

To install Stage follow these steps.

1. **Clone the repository:** Clone the repository to your machine

```bash
git clone https://github.com/overture-stack/stage.git
```

2. **Install dependencies:** Run the following command

```bash
npm ci
```

**Note:** Ensure you are using Node.js version 20 or greater for optimal performance and compatibility.

3. **Deploy:** Deploy Stage locally by running the following command

```bash
npm run dev
```

Once complete you should be able to access Stage from your `localhost:3000`, without anything configured you should see the following error message (or similar):

![Entity](./assets/configerror.png 'Error')

In the next section we will resolve these errors by configuring Stage to integrate with Arranger.

## Configuration

1. Create a configuration file named `[config-file-name]` in your project root:

```json
{
	"key": "value",
	"another-key": "another-value"
}
```

2. Environment Variables

The following environment variables can be set to configure the application:

- `ENV_VAR_1`: Description of what this variable does
- `ENV_VAR_2`: Description of what this variable does

3. Command-line Arguments

The application accepts the following command-line arguments:

- `--arg1`: Description of what this argument does
- `--arg2 <value>`: Description of what this argument does

## Integrating Arranger

Before integrating, make sure to have Arranger Server running correctly and connected to an Elasticsearch instance. For instructions on setting that up, see our <a href="https://overture.bio/documentation/arranger" target="_blank" rel="noopener noreferrer">Arranger documentation here</a>

1. **Create an environment variable file:** Copy or rename the `.env.schema` file as `.env.dmsui`.

2. **Update environment variables:** Update the following fields within your `.env.dmsui`. These values are based on the default Elasticsearch values supplied with Arranger.

```ENV
######### Arranger
NEXT_PUBLIC_ARRANGER_DOCUMENT_TYPE=file
NEXT_PUBLIC_ARRANGER_INDEX=file_centric_1.0
NEXT_PUBLIC_ARRANGER_API_URL=http://localhost:5050/
# Columns are field names separated by commas, with or without quotes
# this is where you'd provide here the fields you want to use for manifest downloads
# NEXT_PUBLIC_ARRANGER_MANIFEST_COLUMNS=fieldName, "fieldName", 'fieldName'
```

3. **Restart Stage:** From the command line exit out (Ctrl/Cmd + C), and re-run Stage `npm run dev`.

Once compiled you should be able to see Arranger running in Stage.

![Entity](./assets/dmsuiarranger.jpg 'Arranger running in Stage')

## Integrating Ego

Before integrating Ego with Stage make sure you have Ego running and configured with an identity provider. For instructions on setting up and configuring Ego see our <a href="https://overture.bio/documentation/ego" target="_blank" rel="noopener noreferrer">Ego documentation here</a>.

To add Ego to the DMS UI:

1. **Add Stage to Ego:** From the Ego Admin UI's left-hand panel select **Applications**. From the Applications screen on the right-hand side click **Create**.

![Entity](./assets/dmsappcreate.jpg 'Ego-UI creating a new application')

Insert the following information:

| Field              | Value                                       |
| ------------------ | ------------------------------------------- |
| Name               | Stage                                       |
| Status             | Approved                                    |
| Client             | Stage                                       |
| Client Secret      | Stage                                       |
| Redirect URI       | http://localhost:3000/api/auth/callback/ego |
| Error Redirect URI | http://localhost:3000/error                 |

You can leave the Groups and Users fields blank. Click the **save** button on the top right of the panel.

![Entity](./assets/dmsuiappcreatepopulated.jpg 'New Stage application values')

4.  **Create an environment variable file:** Within the cloned Stage repository locate your `.env.dmsui` file, if you have not created one yet duplicate the `env.schema` file and rename it to `.env.dmsui`.

5.  **Update environment variables:**Variables within this file are already preconfigured for a local setup:

```ENV
######### Ego

# Auth provider
NEXT_PUBLIC_AUTH_PROVIDER=ego
ACCESSTOKEN_ENCRYPTION_SECRET=super_secret
SESSION_ENCRYPTION_SECRET=this_is_a_super_secret_secret

# Base url for Ego API
NEXT_PUBLIC_EGO_API_ROOT=http://localhost:8081

# Ego registered app id
NEXT_PUBLIC_EGO_CLIENT_ID=Stage
```

However, you will need to update the `NEXT_PUBLIC_SSO_PROVIDERS` variable in line with the SSO provider(s) you want available:

```ENV
NEXT_PUBLIC_SSO_PROVIDERS=GOOGLE,GITHUB,ORCID,LINK

######### Optional features/functionalities

NEXT_PUBLIC_DEBUG=true

```

**Note:** you will need to set up a client ID and client Secret through each provider. For more information see our documentation on [setting up identity provider secrets](https://www.overture.bio/documentation/ego/installation/prereq/#setup-identity-provider-secrets)

6. **Restart Stage:** From the command line exit out (Ctrl/Cmd + C), and re-run Stage `npm run dev`.

Once compiled you should be able to access Ego by clicking login on the upper right corner of Stage.
