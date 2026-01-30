#!/usr/bin/env node
/**
 * Seed HarperOS Documents library with real plans and analyses.
 * Run: node scripts/seed-documents.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabase = createClient(
  'https://odjqikyekktqlnrarupg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kanFpa3lla2t0cWxucmFydXBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MzM1NDksImV4cCI6MjA4NTIwOTU0OX0.vNN78oAd1LNCaaGUwZ-XTDF4QgxU4QLe6huGiLHM3_U'
);

const SWIM_BIZ = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const MORTGAGE_BIZ = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';

// Data & Analytics project for Swim
const DATA_ANALYTICS_PROJECT = 'eae14231-e0b8-43e1-8651-125455e71f0c';
// Marketing project for Swim
const MARKETING_PROJECT = 'b9cff46d-db6a-4e00-a019-5529b699e353';
// LOD project for Mortgage
const LOD_PROJECT = 'bbabff0c-75a9-46b0-ba9e-5a6bb0730f89';

const documents = [
  {
    title: 'GTM / GA4 / Google Ads — Nuclear Rebuild Execution Plan',
    filePath: '/Users/clawdbot/clawd/docs/inspired-swim/gtm-ga4-nuclear-rebuild-plan.md',
    doc_type: 'strategy',
    business_id: SWIM_BIZ,
    project_id: DATA_ANALYTICS_PROJECT,
    author: 'harper',
    status: 'published',
    summary: 'Complete rebuild plan for Inspired Swim measurement stack. All 21 GTM tags flagged for malware — nuclear rebuild from scratch using native templates. 5 phases covering tag rebuild, Google Ads linking, internal traffic filtering, key events, and FB/CallRail restoration.',
    tags: ['gtm', 'ga4', 'google-ads', 'tracking', 'measurement'],
  },
  {
    title: 'LOD Post-Discovery Report + Holly Implementation — Full Build Plan v1',
    filePath: '/Users/clawdbot/clawd/docs/inspired-mortgage/reports/BUILD-PLAN-v1.md',
    doc_type: 'strategy',
    business_id: MORTGAGE_BIZ,
    project_id: LOD_PROJECT,
    author: 'harper',
    status: 'published',
    summary: 'Two-part build plan: Report overhaul (copy fidelity, new sections, application link placement, enhanced CTA) + Holly training/automation (5 booking hooks, post-call email sequence, post-call SMS sequence). ~15-20 files, ~3000+ lines across React-PDF, HTML templates, Holly knowledge base, and Inngest functions.',
    tags: ['lod', 'holly', 'reports', 'automation', 'mortgage'],
  },
  {
    title: 'SEO Directory & Citation Audit — Inspired Swim',
    filePath: '/Users/clawdbot/clawd/docs/inspired-swim/seo-directory-audit-2026-01-29.md',
    doc_type: 'analysis',
    business_id: SWIM_BIZ,
    project_id: MARKETING_PROJECT,
    author: 'harper',
    status: 'published',
    summary: '14 GBP locations found but minimal presence on other directories. Yellow Pages, BBB, Apple Business Connect all missing. Tiered directory strategy (90+ DA first), NAP consistency plan, backlink opportunities, and 5-phase implementation plan. Estimated cost: $500-2,500.',
    tags: ['seo', 'citations', 'directories', 'local-seo', 'gbp'],
  },
  {
    title: 'GA4 Analytics Baseline — Inspired Swim',
    filePath: '/Users/clawdbot/clawd/docs/inspired-swim/ga4-baseline-2026-01-29.md',
    doc_type: 'analysis',
    business_id: SWIM_BIZ,
    project_id: DATA_ANALYTICS_PROJECT,
    author: 'harper',
    status: 'published',
    summary: 'CRITICAL: Paid Search (20% of traffic) and Paid Social (5%) show ZERO conversions. Cross-domain tracking broken between inspiredswim.com and nataflow.com. 11K sessions/mo, conversions up 37% but tracking is unreliable. Bot traffic from Lanzhou (613 sessions). All /lp/* and /locations/* pages show 0 conversions.',
    tags: ['ga4', 'analytics', 'baseline', 'conversion-tracking'],
  },
  {
    title: 'GTM / GA4 / Google Ads Full Audit',
    filePath: '/Users/clawdbot/clawd/docs/inspired-swim/gtm-ga4-full-audit-2026-01-29.md',
    doc_type: 'analysis',
    business_id: SWIM_BIZ,
    project_id: DATA_ANALYTICS_PROJECT,
    author: 'harper',
    status: 'published',
    summary: 'Complete audit of GTM container GTM-NFFRNB9Z. All 21 tags flagged for malware and paused. Google Ads accounts 957-210-9784 and 874-371-1070 neither linked to GA4. GA4 still receiving data via Enhanced Measurement. Coach Portal is #1 page (943 views). Recommended: nuclear rebuild with native templates only.',
    tags: ['gtm', 'ga4', 'google-ads', 'audit', 'malware'],
  },
];

async function seedDocuments() {
  console.log('🔍 Checking for existing documents...');
  
  const { data: existing, error: checkErr } = await supabase
    .from('documents')
    .select('title');
  
  if (checkErr) {
    console.error('Error checking existing docs:', checkErr);
    return;
  }
  
  const existingTitles = new Set((existing || []).map(d => d.title));
  
  for (const doc of documents) {
    if (existingTitles.has(doc.title)) {
      console.log(`⏭️  Skipping "${doc.title}" — already exists`);
      continue;
    }
    
    console.log(`📄 Inserting: ${doc.title}`);
    
    let content;
    try {
      content = readFileSync(doc.filePath, 'utf-8');
    } catch (e) {
      console.error(`  ❌ Could not read file: ${doc.filePath}`);
      continue;
    }
    
    const { data, error } = await supabase
      .from('documents')
      .insert({
        title: doc.title,
        content: content,
        doc_type: doc.doc_type,
        business_id: doc.business_id,
        project_id: doc.project_id,
        author: doc.author,
        status: doc.status,
        summary: doc.summary,
        tags: doc.tags,
        published_at: new Date().toISOString(),
      })
      .select('id, title');
    
    if (error) {
      console.error(`  ❌ Error: ${error.message}`);
    } else {
      console.log(`  ✅ Created: ${data[0].id}`);
    }
  }
  
  console.log('\n🎉 Document seeding complete!');
}

seedDocuments().catch(console.error);
