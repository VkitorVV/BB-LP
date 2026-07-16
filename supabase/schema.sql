-- ── funnel_sessions ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS funnel_sessions (
  id               BIGSERIAL PRIMARY KEY,
  session_id       TEXT NOT NULL,
  date             DATE NOT NULL DEFAULT CURRENT_DATE,
  first_seen       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  left_at          TIMESTAMPTZ,
  page_status      TEXT NOT NULL DEFAULT 'active',
  utm_source       TEXT,
  utm_medium       TEXT,
  utm_campaign     TEXT,
  utm_content      TEXT,
  utm_term         TEXT,
  campaign_id      TEXT,
  adset_id         TEXT,
  ad_id            TEXT,
  placement        TEXT,
  site_source_name TEXT,
  max_section_order INT DEFAULT 0,
  max_section_title TEXT,
  UNIQUE(session_id, date)
);
ALTER TABLE funnel_sessions ADD COLUMN IF NOT EXISTS left_at TIMESTAMPTZ;
ALTER TABLE funnel_sessions ADD COLUMN IF NOT EXISTS page_status TEXT NOT NULL DEFAULT 'active';

-- ── funnel_section_events ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS funnel_section_events (
  id            BIGSERIAL PRIMARY KEY,
  session_id    TEXT NOT NULL,
  date          DATE NOT NULL DEFAULT CURRENT_DATE,
  section_id    TEXT NOT NULL,
  section_title TEXT NOT NULL,
  section_order INT  NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, date, section_id)
);

-- ── funnel_click_events ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS funnel_click_events (
  id                     BIGSERIAL PRIMARY KEY,
  session_id             TEXT NOT NULL,
  date                   DATE NOT NULL DEFAULT CURRENT_DATE,
  checkout_type          TEXT NOT NULL,
  checkout_label         TEXT,
  checkout_price         NUMERIC(10,2),
  button_location        TEXT,
  target_url             TEXT,
  current_section_title  TEXT,
  current_section_order  INT,
  utm_source             TEXT,
  utm_medium             TEXT,
  utm_campaign           TEXT,
  utm_content            TEXT,
  utm_term               TEXT,
  campaign_id            TEXT,
  adset_id               TEXT,
  ad_id                  TEXT,
  clicked_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Migration: add new columns if they don't exist
ALTER TABLE funnel_click_events ADD COLUMN IF NOT EXISTS checkout_label        TEXT;
ALTER TABLE funnel_click_events ADD COLUMN IF NOT EXISTS checkout_price        NUMERIC(10,2);
ALTER TABLE funnel_click_events ADD COLUMN IF NOT EXISTS target_url            TEXT;
ALTER TABLE funnel_click_events ADD COLUMN IF NOT EXISTS current_section_title TEXT;
ALTER TABLE funnel_click_events ADD COLUMN IF NOT EXISTS current_section_order INT;
ALTER TABLE funnel_click_events ADD COLUMN IF NOT EXISTS utm_source            TEXT;
ALTER TABLE funnel_click_events ADD COLUMN IF NOT EXISTS utm_medium            TEXT;
ALTER TABLE funnel_click_events ADD COLUMN IF NOT EXISTS utm_campaign          TEXT;
ALTER TABLE funnel_click_events ADD COLUMN IF NOT EXISTS utm_content           TEXT;
ALTER TABLE funnel_click_events ADD COLUMN IF NOT EXISTS utm_term              TEXT;
ALTER TABLE funnel_click_events ADD COLUMN IF NOT EXISTS campaign_id           TEXT;
ALTER TABLE funnel_click_events ADD COLUMN IF NOT EXISTS adset_id              TEXT;
ALTER TABLE funnel_click_events ADD COLUMN IF NOT EXISTS ad_id                 TEXT;
ALTER TABLE funnel_click_events ADD COLUMN IF NOT EXISTS clicked_at            TIMESTAMPTZ;

-- ── funnel_purchases ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS funnel_purchases (
  id             BIGSERIAL PRIMARY KEY,
  session_id     TEXT,
  date           DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_id     TEXT,
  status         TEXT,
  checkout_title TEXT,
  amount         NUMERIC(10,2),
  utm_campaign   TEXT,
  utm_content    TEXT,
  utm_term       TEXT,
  approved_at    TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE funnel_purchases ADD COLUMN IF NOT EXISTS session_id TEXT;
ALTER TABLE funnel_purchases ADD COLUMN IF NOT EXISTS date DATE NOT NULL DEFAULT CURRENT_DATE;
ALTER TABLE funnel_purchases ADD COLUMN IF NOT EXISTS payment_id TEXT;
ALTER TABLE funnel_purchases ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE funnel_purchases ADD COLUMN IF NOT EXISTS checkout_title TEXT;
ALTER TABLE funnel_purchases ADD COLUMN IF NOT EXISTS amount NUMERIC(10,2);
ALTER TABLE funnel_purchases ADD COLUMN IF NOT EXISTS utm_campaign TEXT;
ALTER TABLE funnel_purchases ADD COLUMN IF NOT EXISTS utm_content TEXT;
ALTER TABLE funnel_purchases ADD COLUMN IF NOT EXISTS utm_term TEXT;
ALTER TABLE funnel_purchases ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE funnel_purchases ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_funnel_sessions_date        ON funnel_sessions(date);
CREATE INDEX IF NOT EXISTS idx_funnel_sessions_last_seen   ON funnel_sessions(last_seen);
CREATE INDEX IF NOT EXISTS idx_funnel_sessions_page_status ON funnel_sessions(page_status);
CREATE INDEX IF NOT EXISTS idx_funnel_section_events_date  ON funnel_section_events(date);
CREATE INDEX IF NOT EXISTS idx_funnel_click_events_date    ON funnel_click_events(date);
CREATE INDEX IF NOT EXISTS idx_funnel_purchases_date       ON funnel_purchases(date);
CREATE INDEX IF NOT EXISTS idx_funnel_purchases_session_id ON funnel_purchases(session_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_funnel_purchases_payment_id_unique
  ON funnel_purchases(payment_id);

-- ── Migração: CTA tracking ───────────────────────────────────────────────────
ALTER TABLE funnel_section_events ADD COLUMN IF NOT EXISTS reach_method         TEXT DEFAULT 'scroll';
ALTER TABLE funnel_section_events ADD COLUMN IF NOT EXISTS source_cta_label     TEXT;
ALTER TABLE funnel_section_events ADD COLUMN IF NOT EXISTS source_section_id    TEXT;
ALTER TABLE funnel_section_events ADD COLUMN IF NOT EXISTS source_section_title TEXT;
ALTER TABLE funnel_section_events ADD COLUMN IF NOT EXISTS source_section_order INT;

ALTER TABLE funnel_click_events ADD COLUMN IF NOT EXISTS click_kind             TEXT DEFAULT 'checkout';
ALTER TABLE funnel_click_events ADD COLUMN IF NOT EXISTS cta_label              TEXT;
ALTER TABLE funnel_click_events ADD COLUMN IF NOT EXISTS source_section_id      TEXT;
ALTER TABLE funnel_click_events ADD COLUMN IF NOT EXISTS source_section_title   TEXT;
ALTER TABLE funnel_click_events ADD COLUMN IF NOT EXISTS source_section_order   INT;
ALTER TABLE funnel_click_events ADD COLUMN IF NOT EXISTS target_section_id      TEXT;
ALTER TABLE funnel_click_events ADD COLUMN IF NOT EXISTS target_section_title   TEXT;
ALTER TABLE funnel_click_events ADD COLUMN IF NOT EXISTS target_section_order   INT;
ALTER TABLE funnel_click_events ADD COLUMN IF NOT EXISTS is_internal_jump       BOOLEAN DEFAULT FALSE;
