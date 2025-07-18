# Gemini Project: Publications Website

This project is a static website built with Eleventy that showcases publications, reports, and podcasts. It uses Tailwind CSS for styling and is configured to automatically fetch and update content from external sources like Zenodo and a podcast RSS feed.

## Project Structure

- **`.eleventy.js`**: The main configuration file for the Eleventy static site generator. It defines collections for podcasts and reports, sets up filters for formatting dates and slugs, and specifies the directory structure.
- **`src/`**: The source directory for the website content.
  - **`_data/`**: Holds global data files.
  - **`_layouts/`**: Contains the base templates for pages.
  - **`assets/`**: Stores static assets like CSS and images.
  - **`podcasts/`**: Contains individual markdown files for each podcast episode.
  - **`reports/`**: Contains individual markdown files for each report.
- **`scripts/`**: Contains Node.js scripts for fetching data.
  - **`syncPodcasts.cjs`**: Fetches podcast data from a libsyn RSS feed and creates markdown files for each episode in `src/podcasts/`.
  - **`zenodoReports.cjs`**: Fetches report data from a `zenodo.json` file and creates markdown files for each report in `src/reports/`.
- **`.github/workflows/`**: Contains GitHub Actions workflows for automating the data syncing process.
  - **`sync-podcasts.yml`**: A workflow to run the `sync:podcasts` script.
  - **`sync-zenodo.yml`**: A workflow to run the `sync:zenodo` script.
- **`package.json`**: Defines the project's dependencies and scripts.

## Getting Started

### Installation

To install the project dependencies, use pnpm:

```bash
pnpm install
```

### Running the Project

To start the development server, which includes hot-reloading and recompiling assets, run:

```bash
pnpm start
```

This will start Eleventy in serve mode and watch for changes to the CSS files.

### Building the Project

To build a production-ready version of the site, run:

```bash
pnpm build
```

The output will be generated in the `_site/` directory.

## Content Management

### Syncing Content

The project is designed to automatically sync content from external sources.

- **Sync Zenodo Reports**: To fetch the latest reports from Zenodo, first ensure you have an updated `zenodo.json` file, then run:
  ```bash
  pnpm run sync:zenodo
  ```
- **Sync Podcasts**: To fetch the latest podcasts from the RSS feed, run:
  ```bash
  pnpm run sync:podcasts
  ```
- **Sync All**: To run both sync scripts, use:
  ```bash
  pnpm run sync
  ```

These scripts are also configured to run via GitHub Actions, as defined in the `.github/workflows/` directory.

### Adding Content Manually

While the project is set up for automated content syncing, you can also add content manually:

- **Podcasts**: Create a new markdown file in the `src/podcasts/` directory. The file should include a frontmatter section with the `title`, `date`, `layout`, `tags`, `audio_url`, and `description`.
- **Reports**: Create a new markdown file in the `src/reports/` directory. The file should include a frontmatter section with details about the report, such as `title`, `date`, `zenodo_id`, `doi`, `url`, `resource_type`, `thumbnail`, `files`, `stats`, and `authors`.
