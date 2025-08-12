# Overture - JBrowse2 Integration

This integration connects Overture's genomic data management platform with [JBrowse 2](https://jbrowse.org/jb2/) genome visualization functionality, specifically linear and circular viewers for BAM and VCF files.

## Setting up the development enviroment 

**Prerequisites**

- Node.js and npm installed
- Internet connection required

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/overture-stack/stage.git -b feat/jbrowsemvp-arranger3
   cd stage
   ```

2. **Install the dependencies**

   ```bash
   npm install
   ```

3. **Update the env.schema file**

4. **Start the demo environment**

   ```bash
   npm run dev
   ```

> [!NOTE]
> A demo environment to locally spin up all dependent services, with demo data, is available here at https://github.com/overture-stack/prelude/tree/jbrowse-demo

## Funding Acknowledgement

Overture is supported by grant #U24CA253529 from the National Cancer Institute at the US National Institutes of Health, and additional funding from Genome Canada, the Canada Foundation for Innovation, the Canadian Institutes of Health Research, Canarie, and the Ontario Institute for Cancer Research.
