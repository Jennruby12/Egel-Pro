-- Tabla profiles: extiende auth.users con datos del estudiante + gamificacion
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  university TEXT,
  exam_date DATE,
  -- Rol global
  role TEXT NOT NULL DEFAULT 'student'
    CHECK (role IN ('student', 'admin')),
  -- Organizacion
  organization_id UUID REFERENCES organizations(id),
  org_role TEXT CHECK (org_role IN ('member', 'manager', 'owner')),
  -- Gamificacion
  xp_total INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_current INTEGER DEFAULT 0,
  streak_max INTEGER DEFAULT 0,
  streak_freeze_count INTEGER DEFAULT 0,
  last_activity_date DATE,
  -- Onboarding
  onboarding_completed BOOLEAN DEFAULT FALSE,
  diagnostic_score JSONB,
  goal_level TEXT DEFAULT 'sobresaliente'
    CHECK (goal_level IN ('satisfactorio', 'sobresaliente')),
  -- Plan individual
  plan TEXT DEFAULT 'free'
    CHECK (plan IN ('free', 'pro', 'pro_lifetime')),
  plan_expires_at TIMESTAMPTZ,
  -- Meta
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_organization ON profiles(organization_id) WHERE organization_id IS NOT NULL;
CREATE INDEX idx_profiles_role ON profiles(role);
