# WORNG PDF — AI CV & Arabic Resume Builder (Yemen-Compatible)

> **Zero Google Login · Zero Gumroad · 100% Yemen & MENA Compatible**
> **Anonymous Fingerprint Access · Payoneer Direct Checkout · OKX USDT TRC20**

---

## 🌟 Highlights & Architecture

- **Anonymous Access**: No login, no passwords, no Google OAuth. Users are securely and uniquely identified via a privacy-preserving browser fingerprint + client IP address.
- **Strict Free Tier & Grey Lock**:
  - 1st generation (Dual Arabic Resume + English CV) is **100% FREE**.
  - 2nd generation onward requires an active **$2.67/month** unlimited subscription.
  - The "Generate Now" button automatically switches to a disabled, grey lock state (`cursor-not-allowed`) once the free pass is consumed without an active subscription.
- **Direct Real Payments (No Gumroad)**:
  - **Payoneer Direct Request**: Directly routes to account `hatkook5050@gmail.com` (**AHMED OMAR SAEED BARASHED**). User submits confirmation TxID for instant logging and admin approval.
  - **OKX USDT TRC20**: Deposit address `TKAWh7LiJY8wEcQ9r6N9e9DasfEEXxDStu`. Auto-verified on the TRON blockchain via TronScan API.
- **Design System**: Pop Bento Grid, Dark UI (`#080A0F`), Lime accent (`#CCFF00`), 3D stars (★), and Neo-Brutalist borders.
- **AI Recruiter Engine**: Multi-tiered AI support (Groq LLaMA 3.3 70B, Google Gemini 2.5 Flash, OpenAI, plus 10-year senior executive recruiter fallback).

---

## 🚀 Environment Variables (`.env`)

```env
# AI Models (Groq / Gemini / OpenAI)
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Payoneer Direct Configuration
PAYONEER_CHECKOUT_URL=https://link.payoneer.com/Token?t=09C648443DD44B91BE4267CF20C6F297&src=mobile
PAYONEER_TOKEN=09C648443DD44B91BE4267CF20C6F297
PAYONEER_RECEIVER_EMAIL=hatkook5050@gmail.com
PAYONEER_RECEIVER_NAME=AHMED OMAR SAEED BARASHED

# OKX USDT TRC20 Configuration
OKX_USDT_TRC20_ADDRESS=TKAWh7LiJY8wEcQ9r6N9e9DasfEEXxDStu
SUBSCRIPTION_MONTHLY_PRICE=2.67

# Supabase (Optional for persistent cloud backend)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🗄️ Supabase / PostgreSQL Database Schema

Run the following SQL snippet in the **Supabase SQL Editor**:

```sql
-- 1. Free Usage Tracking (No login, based on Fingerprint + IP)
CREATE TABLE IF NOT EXISTS free_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint_id TEXT UNIQUE NOT NULL,
  ip TEXT NOT NULL,
  free_used BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint_id TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  start_date TIMESTAMPTZ DEFAULT now(),
  end_date TIMESTAMPTZ NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('payoneer', 'crypto_trc20')),
  transaction_id TEXT NOT NULL,
  amount NUMERIC(10,2) DEFAULT 2.67,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Payments Table (Payoneer & OKX TRC20)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint_id TEXT NOT NULL,
  amount NUMERIC(10,2) DEFAULT 2.67,
  currency TEXT DEFAULT 'USD',
  provider TEXT NOT NULL CHECK (provider IN ('payoneer', 'crypto_trc20')),
  transaction_id TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  customer_reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  approved_at TIMESTAMPTZ
);

-- 4. CV Generations History
CREATE TABLE IF NOT EXISTS cv_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint_id TEXT NOT NULL,
  ip TEXT NOT NULL,
  was_free BOOLEAN DEFAULT true,
  cv_type TEXT NOT NULL,
  category TEXT NOT NULL,
  target_job_title TEXT NOT NULL,
  input_data JSONB NOT NULL,
  ai_response JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for lightning fast Lookups & Concurrency Lock
CREATE INDEX IF NOT EXISTS idx_free_usage_fp ON free_usage(fingerprint_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_fp ON subscriptions(fingerprint_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_txid ON payments(transaction_id);
```

---

## 🚢 Deployment Guide

### Option A: Full-Stack Deploy on Render.com (Free Tier)

1. Fork or push this repository to GitHub as `worng-pdf-ai-builder`.
2. Log in to [Render.com](https://render.com) and click **New + > Web Service**.
3. Select your GitHub repository `worng-pdf-ai-builder`.
4. Configure service settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. In **Environment Variables**, add the keys from your `.env`:
   - `GROQ_API_KEY`: `your_groq_api_key_here`
   - `PAYONEER_CHECKOUT_URL`: `https://link.payoneer.com/Token?t=09C648443DD44B91BE4267CF20C6F297&src=mobile`
   - `OKX_USDT_TRC20_ADDRESS`: `TKAWh7LiJY8wEcQ9r6N9e9DasfEEXxDStu`
   - `SUBSCRIPTION_MONTHLY_PRICE`: `2.67`
6. Click **Create Web Service**. Your app is live!

---

### Option B: Deploy Frontend to GitHub Pages

1. In `client/vite.config.ts`, if deploying to `https://<username>.github.io/worng-pdf-ai-builder/`, set:
   ```ts
   base: "/worng-pdf-ai-builder/",
   ```
2. Build the client bundle:
   ```bash
   npm run build
   ```
3. Push the `dist/public` folder to the `gh-pages` branch using `gh-pages` package:
   ```bash
   npx gh-pages -d dist/public
   ```
4. Point your API calls to your Render backend URL (e.g., `https://worng-pdf-backend.onrender.com`).

---

## 🛠️ Verification & Testing

1. **First-time generation**:
   - Open `/builder`, enter name and job title, and click **Generate Now (Free First Time)**.
   - The dual documents will generate and display in Box 8.
2. **Second-time generation (Grey Lock)**:
   - Notice the status badge switches to `[FREE USED]`.
   - The generate button becomes disabled: `cursor-not-allowed`, `bg-neutral-800`.
   - Clicking it immediately launches the Yemen-compatible payment modal with Payoneer and OKX options.
3. **Payoneer Approval**:
   - Navigate to `/admin` to view and approve pending transactions with 1 click.
