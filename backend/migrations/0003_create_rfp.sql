CREATE TABLE rfps (
    rfp_id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    structured_json JSONB,
    budget NUMERIC,
    delivery_time TEXT,
    attachment_path TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
