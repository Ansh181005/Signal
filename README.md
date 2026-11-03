<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="Assets/Smart%20Logo%20White.png">
  <source media="(prefers-color-scheme: light)" srcset="Assets/Smart%20Logo%20Black.png">
  <img alt="Signal Logo" src="Assets/Smart%20Logo%20White.png" width="180" />
</picture>

# 🚀 Signal

### *AI-Powered Startup Failure Prediction & Market Intelligence Platform*

[![React 19](https://img.shields.io/badge/React-19.0+-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.9%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![XGBoost](https://img.shields.io/badge/XGBoost-Ensemble%20ML-FF6600?logo=scikit-learn&logoColor=white)](https://xgboost.readthedocs.io/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%26%20Auth-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Render](https://img.shields.io/badge/Render-Docker%20Backend-46E3B7?logo=render&logoColor=white)](https://render.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Frontend%20Hosting-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![License MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 👥 Core Team Members

| Name | Role | Focus Area |
| :--- | :--- | :--- |
| 🧑‍💻 **Aryan Saini** | Project Lead & Machine Learning | System Architecture, Langgraph, XGBoost ML Pipeline, Backend API Engine |
| 👨‍💻 **Ansh Patel** | Frontend & UI/UX Engineer | React 19 Interface, TanStack Routing, Interactive Recharts Dashboard |
| 👩‍💻 **Isha Zope** | Data & Intelligence | Gemini AI Feature Engineering, Prompt Architecture, Mitigation Suggestions |
| 👩‍💻 **Jeevitha** | Cloud & Quality Assurance | Supabase PostgreSQL Security, API Routing, System Testing |
| 🧑‍💻 Aditya S Kallur | Software Development & Integration | Full-Stack Development, Java, Python, GIS, Testing & Project Integration |

---

## 📋 Table of Contents

1. [🌟 Project Introduction](#-project-introduction)
2. [🛑 Problem Statement](#-problem-statement)
3. [💡 Key Value Propositions](#-key-value-propositions)
4. [✨ Key Features](#-key-features)
5. [🛠️ Tech Stack](#-tech-stack)
6. [🏗️ System Architecture](#-system-architecture)
7. [🔄 AI & Machine Learning Pipeline](#-ai--machine-learning-pipeline)
8. [📊 Dataset & Machine Learning Performance](#-dataset--machine-learning-performance)
9. [📦 Installation & Setup](#-installation--setup)
10. [🚀 Quick Start](#-quick-start)
11. [🌐 Production Deployment](#-production-deployment)
12. [📁 Repository Structure](#-repository-structure)
13. [📄 License & Credits](#-license--credits)

---

## 🌟 Introduction of the Project

An intelligent, full-stack decision-support workspace called **Signal** was created to assist product teams, venture capitalists, and entrepreneurs in assessing the feasibility of early-stage firms both numerically and qualitatively.

The platform functions as an automated venture due diligence analyst by fusing the real-time reasoning of **Google Gemini 2.5 Flash** with the predictive power of a **custom Machine Learning model** (trained on 66,000+ historical startup outcomes from the [Crunchbase Startup Success/Fail Dataset on Kaggle](https://www.kaggle.com/datasets/yanmaksi/big-startup-secsees-fail-dataset-from-crunchbase)).

### 🎯 What We Offer
- 🧠 The precise probability of risk obtained from Crunchbase venture training data is known as the **Statistical Failure & Success Probability**.
- 📊 A 12-column Bento Grid workspace that analyzes vulnerability index scores, 6-month trajectories, and strategic action roadmaps is called the **Executive Risk & Assessment Dashboard**.
- 🔍 **Automated Competitor Intelligence**: Get real-time information about direct competitors, strengths, weaknesses, and market overlap.
- 📄 **Publication-Ready PDF Reports**: Structured vulnerability tables, feasibility scores, and recommendations are exported as direct vector `.pdf` documents.
- 📈 **Predictive Financial Projections**: Customized six-month burn rate and revenue forecasts based on industry benchmarks and budget.
- 🛡️ Instant history saving, two-way session persistence, and versioning with Supabase PostgreSQL and Row Level Security are all features of **Cloud-Synced Scenario Modeling**.

---

## 🛑 Problem Statement

It's common knowledge in venture capital that **over 90% of early-stage startups fail**. The fundamental issues are frequently preventable:
- The target market's size and demand are underestimated.
- A poorly planned runway and an early financial loss.
- Ignoring intense competition and distribution moats.
- Operating within an echo chamber without unbiased, quantitative data.

Early-stage founders cannot access traditional venture due diligence, which is slow and opaque. Static spreadsheets are unable to capture the dynamics of the market in real time, and generic chatbots lack mathematical rigor. This gap is filled by Signal.

---

## 💡 Key Value Propositions

| Target User | Core Value Proposition |
| :--- | :--- |
| 🚀 **Early-Stage Founders** | Stress-test pitch assumptions, identify blindspots, and calculate runway before spending capital |
| 💼 **Angel Investors & VCs** | Rapid quantitative pre-screening of inbound deal flow and pitch decks |
| 🏢 **Accelerators & Incubators** | Track cohort risk profiles and guide portfolio companies through iterative business pivots |
| 📊 **Product & Strategy Teams** | Evaluate new product lines, business models, and market positioning with AI benchmarks |

---

## ✨ Key Features

### 📊 **Executive Risk & Assessment Dashboard (`/dashboard`)**
- High-UX **12-Column Bento Grid Layout** featuring 4 hero stat cards: Overall Risk Index, Success Confidence, Market Vulnerability, and Technical Readiness.
- **6-Month Risk & Growth Trajectory Chart**: Dual Recharts area visualization comparing risk score evolution against projected revenue growth.
- **Executive Verdict & Key Findings**: High Priority findings with glowing indicators.
- **Strategic Action Roadmap**: Numbered step-by-step checklist to systematically de-risk ventures.

### 📄 **Publication-Ready PDF Export Generator**
- Direct client-side `.pdf` report generation powered by **jsPDF** (`exportAnalysisToPdf()`).
- Programmatically formats multi-page vector documents with executive brief, risk vulnerability table, competitor matrix, feasibility breakdown, and strategic suggestions.
- Direct download triggering without browser print prompt interruptions.

### 🧠 **Quantitative Machine Learning Conclusion**
- An XGBoost and Random Forest ensemble-based custom-trained classification model (`startup_model_optimized.joblib`).
- Evaluates total capital, funding rounds, funding duration, velocity to first funding, country code, and industry categories.
- Clear **Failure vs. Success Probability** confidence meters are provided.

### 🤖 **Generative AI Market Due Diligence**
- Google Gemini 2.5 Flash integration via backend orchestrator.
- Constructs organized market positioning matrices by analyzing unstructured text descriptions.
- Identifies immediate rivals with particular operational advantages and disadvantages.

### 🔄 **Two-Way Live Session Persistence**
- Centralized session store (`src/lib/session-store.ts`) synchronizing active live assessments.
- Form inputs and analysis parameters seamlessly persist when switching back and forth between `/project-input` and `/dashboard` with zero data loss. 

### 🗄️ **History, Duplication & Guest Session**
- **Supabase Cloud Sync**: Save multiple startup scenarios to track how pivoting business models alters risk.
- **Duplicate & Edit**: One-click cloning of previous assessments for rapid A/B hypothesis testing.
- **Guest / Demo Mode**: Instant evaluation without requiring upfront account creation.

---

## 🛠️ Tech Stack

### **Frontend Interface & Document Generation**
| Technology | Role |
| :--- | :--- |
| ![React](https://img.shields.io/badge/React-19.0+-61DAFB?logo=react&logoColor=black) | Component architecture and state management |
| ![TanStack Router](https://img.shields.io/badge/TanStack-Router-FF4154?logo=react&logoColor=white) | Fully type-safe client-side routing & navigation |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%203.4+-38B2AC?logo=tailwind-css&logoColor=white) | Modern dark-mode styling and glassmorphism design system |
| ![Recharts](https://img.shields.io/badge/Recharts-2.15+-22B5BF?logo=d3.js&logoColor=white) | Interactive financial charts, dual risk curves, and segment breakdowns |
| ![jsPDF](https://img.shields.io/badge/jsPDF-2.5+-E11D48?logo=adobe-acrobat-reader&logoColor=white) | Programmatic client-side vector PDF document export engine |
| ![Lucide React](https://img.shields.io/badge/Lucide-Icons-F56565?logo=feather&logoColor=white) | Vector icons and clean UI aesthetics |

### **Backend & Inference API**
| Technology | Role |
| :--- | :--- |
| ![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?logo=nodedotjs&logoColor=white) | Custom HTTP API server handling cross-origin requests & proxying |
| ![Child Process](https://img.shields.io/badge/Node.js-execFile%20Bridge-gray?logo=nodedotjs&logoColor=white) | High-performance asynchronous execution bridge to Python ML engine |
| ![Supabase JS](https://img.shields.io/badge/Supabase-SDK%202.49+-3ECF8E?logo=supabase&logoColor=white) | Cloud database operations and authentication middleware |

### **Machine Learning & AI Engine**
| Technology | Role |
| :--- | :--- |
| ![Google Gemini](https://img.shields.io/badge/Gemini%202.5-Flash%20API-8E75B2?logo=google&logoColor=white) | Live market research, competitor extraction & feature synthesis |
| ![Python](https://img.shields.io/badge/Python-3.9%2B-3776AB?logo=python&logoColor=white) | Core machine learning runtime |
| ![XGBoost](https://img.shields.io/badge/XGBoost-1.7+-FF6600?logo=scikit-learn&logoColor=white) | Gradient boosted decision trees for startup failure classification |
| ![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.2+-F7931E?logo=scikitlearn&logoColor=white) | Preprocessing pipelines, encoders, and model calibration |
| ![Pandas](https://img.shields.io/badge/Pandas-DataFrames-150458?logo=pandas&logoColor=white) | Vectorized feature manipulation and transformation |

### **Cloud Storage & Database**
| Technology | Role |
| :--- | :--- |
| ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=postgresql&logoColor=white) | Relational database storing user records, metadata, and JSON analysis payloads |
| ![RLS](https://img.shields.io/badge/Security-Row%20Level%20Security-blue) | Granular user data isolation and authorization policies |

---

## 🏗️ System Architecture

### High-Level Overview

```
┌────────────────────────────────────────────────────────────────┐
│                              Signal                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            FRONTEND (React 19 + TanStack)                │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐     │  │
│  │  │Landing Page │  │Project Input │  │Executive Dash│     │  │
│  │  └─────────────┘  └──────────────┘  └──────────────┘     │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐     │  │
│  │  │Auth / Demo  │  │User Profile  │  │PDF Generator │     │  │
│  │  └─────────────┘  └──────────────┘  └──────────────┘     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                                      │
│                         ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            BACKEND (Node.js REST API Server)             │  │
│  │  ┌─────────────────────────────────────────────────┐     │  │
│  │  │     Failure Prediction & Analytics Pipeline     │     │  │
│  │  └─────────────────────────────────────────────────┘     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                         │                                      │
│         ┌───────────────┴───────────────┐                      │
│         ▼                               ▼                      │
│  ┌─────────────┐                 ┌──────────────┐              │
│  │  Gemini AI  │                 │  ML Engine   │              │
│  │ (Market/LLM)│                 │  (XGBoost)   │              │
│  │ Google Cloud│                 │ Python exec  │              │
│  └─────────────┘                 └──────────────┘              │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │     PROCESSING & INTELLIGENCE MODULES                    │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │  │
│  │  │Market Intel  │  │Competitors   │  │Risk Scorer   │    │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │  │
│  │  │Projections   │  │ML Inference  │  │Session Sync  │    │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │     DATA STORAGE & SECURITY                              │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │  │
│  │  │Supabase DB   │  │Auth Sessions │  │PostgreSQL RLS│    │  │
│  │  │(Projects)    │  │(JWT Tokens)  │  │(Policies)    │    │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Core Modules

| Module | Responsibility | File |
| :--- | :--- | :--- |
| 📊 **Analysis Engine** | Projections, CAGR growth, and executive dashboard metrics | `src/lib/analysis.ts` |
| 📄 **PDF Report Generator** | Vector PDF document exporter built on jsPDF | `src/lib/pdf-export.ts` |
| 🔄 **Session Storage Store** | Two-way state persistence for live assessment data | `src/lib/session-store.ts` |
| 🍱 **Executive Dashboard** | 12-column Bento Box dashboard component | `src/components/ExecutiveDashboard.tsx` |
| 🤖 **AI & ML Orchestrator** | Gemini API integration, ML feature extraction & process spawning | `server/index.js` |
| 🧠 **ML Predictor** | Machine learning inference via XGBoost decision trees | `server/ml/predict.py` |
| 📈 **Model Training** | Model training & optimization on 66k+ Kaggle Crunchbase records | `Dataset/train_model.py` |
| 🗄️ **Database Client** | Supabase PostgreSQL client & authentication operations | `src/lib/supabase.ts` |
| ⚡ **API Client** | Local & production backend communication bridge | `src/lib/local-api.ts` |
| 👤 **Demo Session** | Local guest session & sample startup generator | `src/lib/demo-session.ts` |

---

## 🔄 AI & Machine Learning Pipeline

### 📊 End-to-End Predictive Data Flow

```mermaid
graph TD
    INPUT["📝 STARTUP INPUT<br/>(Name, Industry, Model, Budget, Description)"] --> DISPATCH["1️⃣ FRONTEND SUBMISSION<br/>• Validate input parameters<br/>• Transmit to Node.js Backend API"]
    
    DISPATCH --> GEMINI["2️⃣ GOOGLE GEMINI 2.5 FLASH<br/>• In-depth market & competitor research<br/>• Risk factor analysis across 4 categories<br/>• Synthesize 7 quantitative ML features"]
    
    GEMINI --> EXTRACT["3️⃣ FEATURE EXTRACTION<br/>• funding_total_usd<br/>• funding_rounds<br/>• funding_duration<br/>• time_to_first_funding<br/>• category_count<br/>• country_code<br/>• main_category"]
    
    EXTRACT --> RUNTIME["4️⃣ PYTHON INFERENCE RUNTIME<br/>• Spawn server/ml/predict.py via execFile<br/>• Feed extracted numerical feature vector"]
    
    RUNTIME --> MODEL["5️⃣ TRAINED CLASSIFICATION MODEL<br/>• Load startup_model_optimized.joblib<br/>• Apply feature encodings & scaling<br/>• Compute statistical decision trees"]
    
    MODEL --> PROB["6️⃣ STATISTICAL PROBABILITY<br/>• Failure Probability %<br/>• Success Probability %<br/>• Quantitative Verdict (Success / Failure)"]
    
    PROB --> MERGE["7️⃣ UNIFIED PAYLOAD SYNTHESIS<br/>• Combine Gemini qualitative insights<br/>• Attach ML statistical verdict<br/>• Synthesize Executive Dashboard & PDF Payload"]
    
    MERGE --> UI["8️⃣ REACTIVE DASHBOARD & WORKSPACE<br/>• Render Bento Grid Executive Dashboard<br/>• Plot 6-Month Projections & Competitors<br/>• Generate Direct PDF Export"]
    
    UI --> DB[("9️⃣ SUPABASE CLOUD SAVE<br/>• Persist project record to PostgreSQL<br/>• Associate with authenticated user ID")]
    
    style INPUT fill:#3B82F6,stroke:#1D4ED8,stroke-width:2px,color:#fff
    style DISPATCH fill:#6366F1,stroke:#4338CA,stroke-width:2px,color:#fff
    style GEMINI fill:#8B5CF6,stroke:#6D28D9,stroke-width:2px,color:#fff
    style EXTRACT fill:#EC4899,stroke:#BE185D,stroke-width:2px,color:#fff
    style RUNTIME fill:#F59E0B,stroke:#B45309,stroke-width:2px,color:#fff
    style MODEL fill:#EF4444,stroke:#B91C1C,stroke-width:2px,color:#fff
    style PROB fill:#10B981,stroke:#047857,stroke-width:2px,color:#fff
    style MERGE fill:#06B6D4,stroke:#0E7490,stroke-width:2px,color:#fff
    style UI fill:#3B82F6,stroke:#1D4ED8,stroke-width:3px,color:#fff
    style DB fill:#10B981,stroke:#047857,stroke-width:2px,color:#fff
```

---

## 📊 Dataset & Machine Learning Performance

The quantitative failure prediction engine is trained on real-world historical startup data to identify systemic risk signals and calculate survival probability.

### 📁 Training Dataset
- **Dataset Source**: [Big Startup Success/Fail Dataset from Crunchbase (Kaggle)](https://www.kaggle.com/datasets/yanmaksi/big-startup-secsees-fail-dataset-from-crunchbase)
- **Total Records**: 66,368 Crunchbase company profiles.
- **Filtered Training Cohort**: ~13,334 startups with definitive finalized outcomes (`closed`, `acquired`, or `ipo`), avoiding survivorship bias and active-state ambiguities.
- **Target Variable**: `is_success` (Binary: `1` for `acquired`/`ipo`, `0` for `closed`).
- **Class Balance**: 53% Success vs. 47% Failure (stratified 80/20 train/test split).

### ⚙️ Preprocessing & Feature Engineering
Seven crucial venture signals are extracted and assessed by the model:
1. **`funding_total_usd`**: The total amount of money raised in USD (standardized using `StandardScaler` and median-imputed).
2. **`funding_rounds`**: The total number of completed investment rounds.
3. **`funding_duration`**: The speed and duration (in days) between the first and last funding rounds.
4. **`time_to_first_funding`**: The number of days that have passed between the startup's formation date and its inaugural funding.
5. **`category_count`**: The number of active industry categories (a stand-in for breadth vs. product emphasis).
6. **`country_code`**: Geographic jurisdiction (Target Encoded without matrix sparsity to maintain regional predictive power).
7. **`main_category`**: The primary market vertical in more than 500 different sectors .

### 🏆 Model Architecture & Evaluation Metrics
Trained with an **Optimized XGBoost Classifier (`XGBClassifier`)** pipeline featuring 3-fold stratified `GridSearchCV` hyperparameter tuning (`n_estimators: 200`, `max_depth: 5`, `learning_rate: 0.05`, `eval_metric: logloss`).

| Metric | Score | Baseline (Random Forest) | Description |
| :--- | :---: | :---: | :--- |
| **Accuracy** | **~75.3%** | 72.6% | Overall classification accuracy on 20% stratified holdout test set |
| **F1-Score (Failure / Class 0)** | **0.72** | 0.69 | High precision/recall in identifying high-risk distressed ventures | 
| **F1-Score (Success / Class 1)** | **0.78** | 0.75 | Strong sensitivity in identifying viable acquisition/IPO trajectories | 
| **Macro Average F1** | **0.75** | 0.72 | Support-weighted average F1 across all evaluated outcomes |
| **Weighted Average F1** | **0.75** | 0.73 | Support-weighted average F1 across all evaluated outcomes |

---

## 📦 Installation & Setup

### 📋 Prerequisites
- **Node.js**: v20 or v22 (Recommended)
- **Python**: v3.9 or higher
- **Supabase Account**: Free Tier ([supabase.com](https://supabase.com/))
- **Google Gemini API Key**: Free Tier ([aistudio.google.com](https://aistudio.google.com/))

### Step 1: Clone the Repository
```bash
git clone https://github.com/aryan-saini-dev/smart-failure-detection.git Signal
cd Signal
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Set Up Python ML Virtual Environment
The Node backend executes the machine learning model through this Python environment:
```bash
cd Dataset
python -m venv venv

# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# Install ML dependencies
pip install -r ../requirements.txt
cd ..
```

### Step 4: Configure Supabase Database
1. Create a new project in your [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to **Authentication -> Providers -> Email** and disable "Confirm email" for immediate signup testing.
3. Open the **SQL Editor** in Supabase and run [`supabase/schema.sql`](supabase/schema.sql):
   ```sql
   -- See supabase/schema.sql
   ```

### Step 5: Configure Environment Variables
Copy the example environment file in the project root:
```bash
cp .env.example .env
```
Populate `.env` with your API credentials:
```env
# Google Gemini AI Key
GEMINI_API_KEY=your_gemini_api_key_here

# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8787
API_PORT=8787

# Supabase Credentials
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are required for sign-in and
account creation. Get both values from **Supabase Dashboard -> Project
Settings -> API**. After changing `.env`, stop and restart `npm run dev`;
Vite only loads environment variables when it starts.

If the login page displays `Failed to fetch`, check these two variables first.
That message means the browser could not reach the configured Supabase Auth
endpoint, most commonly because the variables are missing, still contain the
example values, or the frontend was not restarted after editing `.env`.

---

## 🚀 Quick Start

### Start the Local Servers

Open **two terminal windows** in the root directory:

**Terminal 1 (Backend API & ML Engine)**:
```bash
npm run api
```
*Server starts on `http://localhost:8787`*

**Terminal 2 (Frontend React Application)**:
```bash
npm run dev
```
*Frontend launches at `http://localhost:3000` (or `3001` if 3000 is occupied)*

### 📝 Setup Verification Checklist
- [] A Python virtual environment with the installation of `requirements.txt` was generated in `Dataset/venv`.
- [ ] The `.env` contains a valid `GEMINI_API_KEY`.
- [] The Supabase project was established, and the RLS-configured `projects` table was set up.
- [ ] The backend server is using port 8787.
- [ ] Frontend connects to `http://localhost:8787` and operating on port `3000`.

---

## 🌐 Production Deployment

| Service | Hosting Platform | Notes |
| :--- | :--- | :--- |
| **Frontend** | **Vercel** | Configured with TanStack Start Nitro preset (`preset: "vercel"`) |
| **Backend & ML** | **Render (Docker)** | Packaged with Node 22 + Python 3 + XGBoost in unified container |

### Vercel Environment Variables:
- `VITE_API_BASE_URL`: `https://smart-failure-detection.onrender.com`
- `VITE_SUPABASE_URL`: `https://your-project-id.supabase.co`
- `VITE_SUPABASE_ANON_KEY`: `your-anon-key`

---

## 📁 Repository Structure

```
Signal/
├── Dataset/                                # ML Training & Research
│   ├── big_startup_secsees_dataset.csv     # 66k+ Crunchbase Dataset (Kaggle)
│   ├── startup-success-fail-eda.ipynb      # Exploratory data analysis notebook
│   ├── train_model.py                      # Training & hyperparameter tuning pipeline
│   ├── startup_model_optimized.joblib      # Serialized production inference pipeline
│   └── dataset_documentation.md            # Statistical summary & benchmark metrics
├── server/                                 # Backend Engine
│   ├── index.js                            # Node.js HTTP API & Gemini integration
│   └── ml/
│       └── predict.py                      # Python ML inference bridge
├── src/                                    # Frontend Application (React 19)
│   ├── components/                         # UI Components & Dashboard Views
│   │   ├── Aurora.tsx                      # WebGL Aurora Canvas backdrop
│   │   ├── ExecutiveDashboard.tsx          # 12-Column Bento Grid Executive Dashboard
│   │   ├── OverviewView.tsx                # Shared 2-Column Overview Component
│   │   ├── FeasibilityView.tsx             # Shared 4-Pillar Feasibility Component
│   │   ├── MarketView.tsx                  # Shared Market & Segments Component
│   │   ├── EnhancedSuggestionsView.tsx     # Strategic Suggestions Component
│   │   └── site-nav.tsx                    # Header Navigation Bar
│   ├── lib/
│   │   ├── analysis.ts                     # Financial algorithms & data models
│   │   ├── pdf-export.ts                   # Client-side jsPDF document generator
│   │   ├── session-store.ts                # Live session state persistence manager
│   │   ├── local-api.ts                    # Backend API client
│   │   └── supabase.ts                     # Supabase SDK client
│   └── routes/                             # TanStack Router Pages
│       ├── index.tsx                       # Landing Page
│       ├── login.tsx                       # Authentication & Guest Demo
│       ├── project-input.tsx               # Startup Submission & Analysis Panel
│       ├── dashboard.tsx                   # Dedicated Executive Dashboard Route
│       ├── profile.tsx                     # Saved Assessment History
│       └── projects/
│           └── $projectId.tsx              # Detailed Saved Analysis View
├── Dockerfile                              # Production Docker container for Render
├── package.json                            # Node dependencies
├── requirements.txt                        # Python ML dependencies
└── vite.config.ts                          # Vite + Nitro configuration
```

---

## 📄 License & Credits

### 📜 Software License
This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

---

<div align="center">

</div>
