-- Sessões anônimas
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
  clicks_count     INT DEFAULT 0,
  purchased        BOOLEAN DEFAULT FALSE,
  revenue          NUMERIC(10,2) DEFAULT 0,
  UNIQUE(session_id, date)
);

-- Migração: adicionar colunas se ainda não existirem
ALTER TABLE funnel_sessions ADD COLUMN IF NOT EXISTS left_at TIMESTAMPTZ;
ALTER TABLE funnel_sessions ADD COLUMN IF NOT EXISTS page_status TEXT NOT NULL DEFAULT 'active';

-- Eventos de seção
CREATE TABLE IF NOT EXISTS funnel_section_events (
  id            BIGSERIAL PRIMARY KEY,
  session_id    TEXT NOT NULL,
  date          DATE NOT NULL DEFAULT CURRENT_DATE,
  section_id    TEXT NOT NULL,
  section_title TEXT NOT NULL,
  section_order INT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, date, section_id)
);

-- Eventos de clique
CREATE TABLE IF NOT EXISTS funnel_click_events (
  id              BIGSERIAL PRIMARY KEY,
  session_id      TEXT NOT NULL,
  date            DATE NOT NULL DEFAULT CURRENT_DATE,
  checkout_type   TEXT NOT NULL,
  button_location TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Compras
CREATE TABLE IF NOT EXISTS funnel_purchases (
  id             BIGSERIAL PRIMARY KEY,
  session_id     TEXT,
  date           DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_id     TEXT,
  checkout_title TEXT,
  amount         NUMERIC(10,2),
  utm_campaign   TEXT,
  utm_content    TEXT,
  utm_term       TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_funnel_sessions_date         ON funnel_sessions(date);
CREATE INDEX IF NOT EXISTS idx_funnel_sessions_last_seen    ON funnel_sessions(last_seen);
CREATE INDEX IF NOT EXISTS idx_funnel_sessions_page_status  ON funnel_sessions(page_status);
CREATE INDEX IF NOT EXISTS idx_funnel_section_events_date   ON funnel_section_events(date);
CREATE INDEX IF NOT EXISTS idx_funnel_click_events_date     ON funnel_click_events(date);
CREATE INDEX IF NOT EXISTS idx_funnel_purchases_date        ON funnel_purchases(date);
