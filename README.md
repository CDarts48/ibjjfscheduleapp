# IBJJF Schedule App

This application fetches and displays competitor schedules for IBJJF tournaments. It highlights conflicts where competitors are scheduled to compete at the same time.

## Features

- Fetches competitor data from the IBJJF competition system.
- Displays competitor details such as name, team, mat, time, and date.
- Highlights scheduling conflicts in red.
- Refresh button to reload the competitor list.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ibjjfscheduleapp.git
   cd ibjjfscheduleapp
   ```markdown
# IBJJF Schedule App

This application fetches and displays competitor schedules for IBJJF tournaments. It highlights conflicts where competitors are scheduled to compete at the same time.

## Features

- Fetches competitor data from the IBJJF competition system.
- Displays competitor details such as name, team, mat, time, and date.
- Highlights scheduling conflicts in red.
- Refresh button to reload the competitor list.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ibjjfscheduleapp.git
   cd ibjjfscheduleapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file for environment variables (if needed).

## Usage

### Development
Start the app in development mode with hot-reloading:
```bash
npm run dev
```

### Production
Start the app in production mode:
```bash
npm start
```

The app will be available at `http://localhost:3000`.

## Deployment

This app is configured for deployment using Fly.io. To deploy:

1. Install Fly CLI and log in:
   ```bash
   flyctl auth login
   ```

2. Deploy the app:
   ```bash
   flyctl deploy
   ```

## File Structure

- `mainPage.js`: Sets up the Express server and renders the EJS template.
- `matches.js`: Contains logic for fetching and processing competitor data.
- `views/index.ejs`: EJS template for displaying competitor information.
- `Dockerfile`: Configuration for containerizing the app.
- `.github/workflows/fly-deploy.yml`: GitHub Actions workflow for deploying to Fly.io.

## Dependencies

- `express`: Web framework for Node.js.
- `ejs`: Template engine for rendering HTML.
- `axios`: HTTP client for fetching data.
- `cheerio`: jQuery-like library for parsing HTML.
- `dotenv`: For managing environment variables.

## License

This project is licensed under the [Apache License 2.0](LICENSE).
```