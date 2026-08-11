-- Booking + rate limiting tables.
-- Timestamps are ISO 8601 UTC strings ("2026-01-14T07:00:00.000Z"): SQLite has no date type,
-- and that format sorts and compares lexicographically, so BETWEEN works on slotStart.

CREATE TABLE Booking (
  id          TEXT PRIMARY KEY,
  slotStart   TEXT NOT NULL,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL,
  meetingType TEXT NOT NULL CHECK (meetingType IN ('video', 'call')),
  message     TEXT,
  locale      TEXT NOT NULL,
  packages    TEXT NOT NULL DEFAULT '[]',
  meetingRoom TEXT,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'refused')),
  createdAt   TEXT NOT NULL,
  updatedAt   TEXT NOT NULL
);

-- The whole anti-double-booking guarantee. A slot can be held by at most one live booking;
-- refusing frees it. Never check-then-insert: insert and let this index reject the loser.
CREATE UNIQUE INDEX Booking_activeSlot ON Booking (slotStart) WHERE status IN ('pending', 'confirmed');

CREATE INDEX Booking_status ON Booking (status);

CREATE TABLE RateLimitHit (
  id        TEXT PRIMARY KEY,
  ipHash    TEXT NOT NULL,
  createdAt TEXT NOT NULL
);

CREATE INDEX RateLimitHit_ipHash_createdAt ON RateLimitHit (ipHash, createdAt);
