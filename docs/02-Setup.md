# Setup

### Prerequisites

- Node.js (v16 or higher)
- npm (v8.3.0 or higher)
- Docker (v4.32.0 or higher)

### Installation

Stage is a basic front-end UI that complements Arranger's search UI components. It's best to run Stage with Arranger and some mock data. To simplify setting up this development environment, we've created a docker-compose file to automate the setup of Stage's complementary services.

**1. Clone and run the Stage Dev Environment QuickStart**

```bash
git clone -b stageDev https://github.com/overture-stack/composer.git
cd composer
docker compose up --attach conductor
```

With Stage's complementary services running, we can now run Stage itself for local development.

**2. Clone the Stage Repository**

```bash
git clone https://github.com/overture-stack/stage.git
cd stage
```

**3. Install the dependencies**

```bash
npm ci
```

**4. Set up environment variables**

In the root directory of the Stage repository, rename the `.env.stage` file to `.env`. This environment variable file is preconfigured for the Stage dev environment quickstart.

**5. Run the local development server**

```bash
npm run dev
```

Once completed, you will be able to access Stage from `http://localhost:3000`.