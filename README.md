# Signal

Signal is an AI-powered startup analysis workspace for founders, product teams,
accelerators, and investors. It turns a startup description into a structured
assessment of market opportunity, competition, financial runway, execution
readiness, technical feasibility, and risk.

The application combines:

- A React and TypeScript web interface
- A Node.js API server
- A LangGraph multi-agent analysis workflow
- An optional Google Gemini integration
- A local Python machine-learning prediction model
- Supabase Auth and PostgreSQL persistence
- Interactive dashboards and PDF report export

> Signal provides decision-support analysis. It is not financial, legal, tax, or
> investment advice.

## Contents

- [Product capabilities](#product-capabilities)
- [Technology stack](#technology-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment configuration](#environment-configuration)
- [Supabase setup](#supabase-setup)
- [Running the application](#running-the-application)
- [Using Signal](#using-signal)
- [Analysis pipeline](#analysis-pipeline)
- [API reference](#api-reference)
- [Data model](#data-model)
- [Testing and validation](#testing-and-validation)
- [Troubleshooting](#troubleshooting)
- [Deployment notes](#deployment-notes)
- [License](#license)

## Product capabilities

### Startup intake

Users can submit:

- Startup or project name
- Industry
- Business model
- Target market
- Budget and currency
- Project description

Supported currencies are USD, EUR, GBP, INR, and CAD. Budget values are
normalized for analysis while the selected currency is retained with the saved
project.

### Analysis workspace

The generated workspace includes:

- Executive risk dashboard
- Overall risk and success probability
- Market, financial, technical, and execution findings
- Revenue and cost projections
- Competitor intelligence
- Market segments
- SWOT analysis
- Feasibility assessment
- Recommended next steps
- Strategic guidance and action roadmaps
- Risk mitigations for six risk categories
- LangGraph workflow status and node details

The **All Guidance** view combines strategic recommendations with all risk
mitigation actions. The specialized guidance tabs remain available for Capital
Runway, Go-To-Market, Risk Defense, and Risk Mitigations.

### Authentication and saved analyses

Supabase Auth provides account registration and login. Authenticated users can:

- Save completed analyses
- View recent analyses in their profile
- Open a saved analysis
- Duplicate a saved analysis for editing
- Export a saved analysis as a PDF

Saved records are stored in the `public.projects` table. The complete generated
analysis is stored in the `analysis_data` JSONB column.

### PDF export

The browser can generate a PDF report containing the project summary, risk
assessment, projections, competitor information, feasibility details, and
recommendations.

## Technology stack

### Frontend

- React 19
- TypeScript
- TanStack Start and TanStack Router
- Vite
- Tailwind CSS
- Radix UI components
- Recharts
- Lucide React
- jsPDF

### Backend

- Node.js HTTP server
- Supabase JavaScript client
- LangChain LangGraph
- Google Gemini 2.5 Flash integration
- Python prediction process invoked by Node.js

### Machine learning

- Python
- pandas
- scikit-learn
- XGBoost
- joblib

The trained model and prediction script are located under `server/ml/`.

### Data and authentication

- Supabase Auth
- Supabase PostgreSQL
- Row Level Security
- JSONB analysis payloads

## Architecture

```text
Browser
  |
  | React / TanStack Router
  v
Frontend application
  |
  | POST /api/analyze
  | POST /api/projects
  | x-supabase-token
  v
Node.js API server
  |
  +--> LangGraph workflow
  |      +--> Market Research Agent
  |      +--> Quantitative Risk / ML Agent
  |      +--> Mitigation Engine Agent
  |      +--> Evaluator and Refiner Agent
  |
  +--> Google Gemini, when configured
  |
  +--> Python ML predictor
  |
  +--> Supabase Auth and PostgreSQL
```

The frontend talks directly to Supabase for authentication and for reading
saved projects. Analysis requests and project creation go through the Node.js
API because the API coordinates the LangGraph workflow and Python model.

If the LangGraph workflow or Gemini integration is unavailable, the server falls
back to local rule-based analysis. If the Python model is unavailable, the rest
of the analysis still completes with the available calculations.

## Project structure

```text
smart-failure-detection/
├── Assets/                         Source logo assets
├── Dataset/                        Dataset, training files, and model artifact
├── public/                         Browser assets and favicon
├── server/
│   ├── index.js                    Node.js API server
│   ├── langgraph/
│   │   └── agentGraph.js          Multi-agent analysis workflow
│   └── ml/
│       ├── predict.py              Python prediction entry point
│       └── startup_model_optimized.joblib
├── src/
│   ├── components/                 Shared UI and dashboard components
│   ├── hooks/                      React hooks
│   ├── lib/
│   │   ├── analysis.ts             Types and local analysis logic
│   │   ├── local-api.ts            Auth, project, and API helpers
│   │   ├── pdf-export.ts           PDF report generation
│   │   └── session-store.ts        Active analysis session state
│   └── routes/
│       ├── index.tsx               Landing page
│       ├── login.tsx               Authentication
│       ├── project-input.tsx       Startup submission
│       ├── dashboard.tsx           Analysis dashboard
│       ├── profile.tsx             Saved analysis history
│       └── projects/$projectId.tsx Saved analysis details
├── supabase/
│   └── schema.sql                  Database table and RLS policy
├── .env.example                    Environment variable template
├── package.json                    JavaScript dependencies and scripts
├── requirements.txt                Python dependencies
└── README.md
```

## Requirements

Install the following before starting:

- Node.js 22 or newer
- npm
- Python 3.9 or newer
- A Supabase project
- A Google Gemini API key for live Gemini analysis (optional)

The frontend and API are developed as separate processes. The frontend normally
runs on Vite's default development port, while the API runs on port `8787`.

## Installation

From the application directory:

```powershell
cd FINAL-MINOR\smart-failure-detection
npm install
```

Create a Python virtual environment:

```powershell
python -m venv Dataset\venv
Dataset\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

If PowerShell blocks activation, run the Python commands through the virtual
environment directly:

```powershell
Dataset\venv\Scripts\python.exe -m pip install -r requirements.txt
```

## Environment configuration

Create `.env` in the application directory. Start from `.env.example`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
VITE_API_BASE_URL=http://localhost:8787
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
API_PORT=8787
```

### Variable reference

| Variable | Required | Purpose |
|---|---:|---|
| `GEMINI_API_KEY` | No | Enables Gemini-backed analysis. Local fallback is used when absent. |
| `VITE_API_BASE_URL` | Yes for local API calls | URL used by the browser to reach the Node API. |
| `VITE_SUPABASE_URL` | Yes | Supabase project URL used by frontend and server. |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase public anonymous key. |
| `API_PORT` | No | Node API port; defaults to `8787`. |
| `PYTHON_PATH` | No | Custom Python executable path for the ML predictor. |

Never commit `.env` or private API keys. Only the Supabase anonymous key is
intended for browser-side use; service-role keys must not be placed in the
frontend environment.

## Supabase setup

### 1. Create a Supabase project

Create a project at [supabase.com](https://supabase.com/), then copy the project
URL and anonymous key into `.env`.

### 2. Configure email authentication

In the Supabase dashboard:

1. Open **Authentication → Providers → Email**.
2. Enable Email provider.
3. For local testing, disable email confirmation if immediate sign-in is
   preferred.

### 3. Create the projects table

Open **SQL Editor**, paste the contents of
[`supabase/schema.sql`](supabase/schema.sql), and run it.

The script is safe to run repeatedly. It:

- Creates `public.projects` if it does not exist
- Adds the `currency` column for older table versions
- Enables Row Level Security
- Replaces the user-isolation policy
- Grants authenticated users the required table operations

The policy ensures a user can only read and modify records where
`projects.user_id = auth.uid()`.

### 4. Inspect saved analyses

In Supabase, open **Table Editor → `projects`**. Each saved analysis is one row.
The main fields are:

- `name`, `industry`, `business_model`, `target_market`
- `budget`, `currency`, `description`
- `user_id`
- `analysis_data`
- `created_at`

To inspect recent records in SQL Editor:

```sql
select
  id,
  user_id,
  name,
  industry,
  budget,
  currency,
  analysis_data,
  created_at
from public.projects
order by created_at desc;
```

## Running the application

Start the API in one terminal:

```powershell
npm run api
```

Start the frontend in a second terminal:

```powershell
npm run dev
```

Open the URL printed by Vite, usually:

```text
http://localhost:5173
```

For a production build:

```powershell
npm run build
npm run preview
```

## Using Signal

1. Open the landing page.
2. Create an account or sign in.
3. Open **Project Input**.
4. Enter the startup details.
5. Select **Run analysis**.
6. Review the dashboard, risks, market information, feasibility, and guidance.
7. Open **Suggestions** to review all guidance and risk mitigations.
8. Select **Save analysis** to persist the record to Supabase.
9. Open **Profile** to view analysis history.
10. Open a saved record to inspect it, duplicate it, or export a PDF.

The save action requires an authenticated Supabase session and a configured
`public.projects` table.

## Analysis pipeline

### 1. Request creation

The project form sends the startup data to `POST /api/analyze` or
`POST /api/projects`.

### 2. LangGraph workflow

The workflow in `server/langgraph/agentGraph.js` executes these stages:

1. **Market Research Agent** — evaluates growth, competitors, and market
   segments.
2. **Quantitative Risk Agent** — combines risk calculations with the Python
   model when available.
3. **Mitigation Engine Agent** — produces strategic recommendations and risk
   mitigations.
4. **Evaluator / Refiner Agent** — checks the result and can send it through a
   refinement loop.

Workflow metadata is returned to the frontend so the interface can show the
executed nodes and refinement status.

### 3. Gemini integration

When `GEMINI_API_KEY` is configured, the server can request market and
competitive intelligence from Gemini 2.5 Flash. The response is normalized into
the application analysis shape.

### 4. Python model

The server invokes `server/ml/predict.py` with startup features. The predictor
loads `server/ml/startup_model_optimized.joblib` and returns success and failure
probabilities.

### 5. Fallback behavior

The application is designed to remain usable when external analysis services are
not available:

- Missing Gemini key: rule-based analysis
- LangGraph failure: local server fallback
- Missing Python environment or model failure: analysis without ML enrichment

Warnings are written to the API server console when a fallback is used.

## API reference

The API server defaults to `http://localhost:8787`.

### `POST /api/analyze`

Runs analysis without saving a project.

Example request:

```json
{
  "name": "Signal Demo",
  "industry": "SaaS",
  "business_model": "B2B Subscription",
  "target_market": "DevOps teams",
  "budget": 120000,
  "currency": "USD",
  "description": "AI-assisted operational intelligence for growing teams."
}
```

Successful response:

```json
{
  "analysis": {
    "growth": 18,
    "overallRisk": 52,
    "risks": [],
    "competitors": [],
    "marketSegments": [],
    "suggestions": []
  }
}
```

The actual response contains the complete analysis payload.

### `POST /api/projects`

Runs analysis and saves the project to Supabase. It requires the current
Supabase access token:

```http
x-supabase-token: <access-token>
```

The response contains the inserted project:

```json
{
  "project": {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Signal Demo",
    "analysis_data": {}
  }
}
```

### `OPTIONS`

The API supports CORS preflight requests for the frontend.

## Data model

The `public.projects` table is defined in
[`supabase/schema.sql`](supabase/schema.sql):

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key generated by Supabase |
| `user_id` | `uuid` | Authenticated owner; references `auth.users` |
| `name` | `text` | Startup or project name |
| `industry` | `text` | Selected industry |
| `business_model` | `text` | Business model |
| `target_market` | `text` | Target customer or market |
| `budget` | `numeric` | Submitted budget |
| `currency` | `text` | Submitted currency code |
| `description` | `text` | Project description |
| `analysis_data` | `jsonb` | Generated analysis result |
| `created_at` | `timestamptz` | Creation timestamp |

## Testing and validation

Run the production build:

```powershell
npm run build
```

Run TypeScript checking:

```powershell
npx tsc --noEmit
```

Run the API syntax check:

```powershell
node --check server\index.js
```

Run linting:

```powershell
npm run lint
```

The lint command scans the full configured workspace. If generated output or
line-ending differences produce existing formatting warnings, use ESLint on the
changed source files for a focused check.

## Troubleshooting

### “Could not find the table `public.projects` in the schema cache”

Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor.
After the query succeeds, restart the API and frontend processes.

### Save analysis does not work

Check all of the following:

1. The user is signed in.
2. `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set.
3. The `public.projects` table exists.
4. The table policy is present and enabled.
5. The API is running on the URL in `VITE_API_BASE_URL`.
6. The browser request includes a current Supabase session.

Inspect the browser Network panel and the API terminal for the detailed error.

### “Failed to fetch”

Start the API with:

```powershell
npm run api
```

Then confirm `VITE_API_BASE_URL` points to the same host and port. Restart Vite
after changing `.env`, because Vite reads `VITE_` variables at startup.

### Gemini analysis is unavailable

Confirm `GEMINI_API_KEY` is present in `.env` and restart the API. Signal still
uses local fallback analysis when the key is missing or Gemini is unavailable.

### Python ML prediction is unavailable

Install the Python dependencies and verify the interpreter:

```powershell
Dataset\venv\Scripts\python.exe -c "import pandas, sklearn, xgboost, joblib; print('Python dependencies OK')"
```

If Python is installed elsewhere, set `PYTHON_PATH` to the full executable path.

### Saved history is empty

Confirm that:

- You are signed in with the same account that saved the record.
- The `projects` table contains rows for the current `user_id`.
- Row Level Security policies were applied from `supabase/schema.sql`.

## Deployment notes

Before deploying:

1. Configure production Supabase URL and anonymous key.
2. Configure the API's production URL as `VITE_API_BASE_URL`.
3. Configure `GEMINI_API_KEY` only on the server.
4. Install Python dependencies and ensure the ML model artifact is available.
5. Run `npm run build`.
6. Run a signed-in smoke test covering analysis, save, profile history, and
   saved-analysis loading.
7. Confirm CORS allows the deployed frontend origin.

The frontend and API can be hosted independently. The API must be able to reach
Supabase, Gemini (if enabled), and the Python runtime. Do not expose private
server credentials in frontend build variables.

## License

See [`LICENSE`](LICENSE) for the project license.
