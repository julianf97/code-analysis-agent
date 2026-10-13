CREATE TABLE repositories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL DEFAULT 'github' CHECK (provider = 'github'),
  owner TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (provider, owner, name)
);

CREATE TABLE analysis_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  configuration JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repository_id UUID NOT NULL REFERENCES repositories(id),
  mode TEXT NOT NULL CHECK (mode IN ('directed','autonomous')),
  depth TEXT NOT NULL CHECK (depth IN ('QUICK','STANDARD','DEEP')),
  question TEXT,
  categories JSONB NOT NULL,
  branch TEXT NOT NULL,
  compare_branch TEXT,
  config JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued','running','completed','failed','cancelled','partial')),
  summary TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
CREATE INDEX analyses_status_idx ON analyses(status, created_at DESC);
CREATE INDEX analyses_repo_idx ON analyses(repository_id, created_at DESC);

CREATE TABLE analysis_revisions (
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('base','comparison')),
  branch TEXT NOT NULL,
  commit_sha VARCHAR(40) NOT NULL,
  PRIMARY KEY (analysis_id, kind)
);

CREATE TABLE analysis_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL UNIQUE REFERENCES analyses(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','completed','failed','cancelled')),
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  leased_by TEXT,
  lease_until TIMESTAMPTZ,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX jobs_available_idx ON analysis_jobs(status, lease_until, created_at);

CREATE TABLE analysis_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  details JSONB,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  UNIQUE (analysis_id, name)
);
CREATE TABLE analysis_files (
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  commit_sha VARCHAR(40) NOT NULL,
  categories JSONB NOT NULL DEFAULT '[]',
  inspected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY(analysis_id, path, commit_sha)
);
CREATE TABLE analysis_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  fingerprint VARCHAR(64) NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('Critical','High','Medium','Low')),
  evidence JSONB NOT NULL,
  impact TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('Keep','Refactor','Migrate','Remove')),
  justification TEXT NOT NULL,
  confidence NUMERIC(4,3) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (analysis_id, fingerprint)
);
CREATE INDEX findings_priority_idx ON analysis_findings(analysis_id, priority);
CREATE TABLE analysis_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  json_document JSONB NOT NULL,
  markdown TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (analysis_id, version)
);
CREATE TABLE analysis_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE llm_usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  model TEXT NOT NULL,
  task TEXT NOT NULL,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  estimated_cost_usd NUMERIC(12,6) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX usage_created_at_idx ON llm_usage_events(created_at);
CREATE TABLE budget_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES analyses(id) ON DELETE CASCADE,
  amount_usd NUMERIC(12,6) NOT NULL CHECK (amount_usd >= 0),
  released_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX budget_active_idx ON budget_reservations(analysis_id) WHERE released_at IS NULL;
