-- Add 'plan' to documents doc_type constraint
ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_doc_type_check;
ALTER TABLE documents ADD CONSTRAINT documents_doc_type_check 
  CHECK (doc_type IN ('plan', 'report', 'strategy', 'playbook', 'analysis', 'brief'));
