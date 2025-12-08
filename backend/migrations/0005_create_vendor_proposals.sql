CREATE TABLE vendor_proposals (
    proposal_id BIGSERIAL PRIMARY KEY,
    rfp_id BIGINT REFERENCES rfps(rfp_id) ON DELETE CASCADE,
    vendor_id BIGINT REFERENCES vendors(vendor_id) ON DELETE CASCADE,
    raw_email_text TEXT NOT NULL,
    parsed_json JSONB,
    total_cost NUMERIC,
    attachment_document_path TEXT,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
