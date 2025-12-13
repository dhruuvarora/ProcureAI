CREATE TYPE proposal_status AS ENUM (
  'submitted',
  'shortlisted',
  'rejected',
  'accepted'
);

ALTER TABLE vendor_proposals
ADD COLUMN status proposal_status DEFAULT 'submitted';

ALTER TABLE vendor_proposals
ADD COLUMN score NUMERIC;

ALTER TABLE vendor_proposals
ADD COLUMN remarks TEXT;
