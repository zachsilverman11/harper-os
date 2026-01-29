#!/usr/bin/env node
/**
 * Seed HarperOS with real projects and tasks from Master Project Registry.
 * Run: node scripts/seed-projects.mjs
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://odjqikyekktqlnrarupg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kanFpa3lla2t0cWxucmFydXBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MzM1NDksImV4cCI6MjA4NTIwOTU0OX0.vNN78oAd1LNCaaGUwZ-XTDF4QgxU4QLe6huGiLHM3_U'
);

// Existing business IDs
const SWIM_BIZ = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const MORTGAGE_BIZ = 'b2c3d4e5-f6a7-8901-bcde-f12345678901';
const PERSONAL_BIZ = 'c3d4e5f6-a7b8-9012-cdef-123456789012';

// Existing project IDs (from DB query)
const EXISTING_PROJECTS = {
  nata: '450a9ff2-796b-4bb6-a2b9-d4f729c70019',
  swimHub: '3f44ec7a-0e0d-4437-a4f3-7b4e6b7581cc',
  splashZone: 'd734bd41-80b2-4429-ac9b-1ae5bbbedbfd',
  marketing: 'b9cff46d-db6a-4e00-a019-5529b699e353',
  swimOps: '2e30d98b-1f87-40c3-b847-ce9d4a6a0a71',
  holly: '0d22c5d6-69e8-4c68-bb69-85638f2d4136',
  lod: 'bbabff0c-75a9-46b0-ba9e-5a6bb0730f89',
  mortgageOps: 'b8108ebc-cb2e-4268-ac3f-79093c94ccfc',
  golf: 'efc55760-2c29-4ec5-9e0d-8893acc73dfc',
  health: '15aadebd-4b5a-4950-a364-29bc27c4ee95',
  harperOS: '5feb7598-086b-464b-b449-5fde08a79a61',
};

async function seedNewProjects() {
  // Add missing Inspired Swim projects
  const newSwimProjects = [
    { business_id: SWIM_BIZ, name: 'Content System', description: '5-phase content pipeline: SplashZone → AI → multi-platform distribution', color: '#06b6d4', order: 5 },
    { business_id: SWIM_BIZ, name: 'Swim Lifecycle', description: 'Post-booking engagement: welcome → mid-season → renewal → win-back', color: '#84cc16', order: 6 },
    { business_id: SWIM_BIZ, name: 'Website & CRO', description: 'Conversion rate optimization + website improvements', color: '#f43f5e', order: 7 },
    { business_id: SWIM_BIZ, name: 'Coach Profiles', description: 'SEO surface area + coach-as-product positioning + direct booking', color: '#f59e0b', order: 8 },
  ];

  // Add missing Inspired Mortgage projects
  const newMortgageProjects = [
    { business_id: MORTGAGE_BIZ, name: 'Customer Portal', description: 'Post-close mortgage management portal (replaces Ownwell)', color: '#8b5cf6', order: 3 },
    { business_id: MORTGAGE_BIZ, name: 'Website', description: 'Complete rebrand site for Inspired Mortgage', color: '#f59e0b', order: 4 },
    { business_id: MORTGAGE_BIZ, name: 'CRM', description: 'AI-native CRM replacing Pipedrive — evolve LOD', color: '#ec4899', order: 5 },
  ];

  const allNew = [...newSwimProjects, ...newMortgageProjects];
  
  console.log(`Inserting ${allNew.length} new projects...`);
  const { data: projects, error } = await supabase
    .from('projects')
    .insert(allNew)
    .select();
  
  if (error) {
    console.error('Error inserting projects:', error);
    return null;
  }
  
  console.log('Created projects:', projects.map(p => `${p.name} (${p.id})`));
  return projects;
}

async function seedTasks(newProjects) {
  // Map new project names to IDs
  const projectMap = {};
  for (const p of newProjects) {
    projectMap[p.name] = p.id;
  }

  const tasks = [
    // === NATA V3 (existing project, add more granular tasks) ===
    { project_id: EXISTING_PROJECTS.nata, title: 'Fix Firebase build errors for Vercel deployment', status: 'this_week', priority: 'critical', assignee: 'harper', harper_action: true, order: 0, tags: ['blocked', 'firebase'] },
    { project_id: EXISTING_PROJECTS.nata, title: 'Mobile-first conversational booking redesign', status: 'in_progress', priority: 'critical', assignee: 'harper', harper_action: true, order: 1, tags: ['ux', 'conversion'] },
    { project_id: EXISTING_PROJECTS.nata, title: 'Conversion event tracking for retargeting', status: 'backlog', priority: 'high', assignee: 'harper', harper_action: true, order: 2, tags: ['analytics'] },

    // === MARKETING (GTM, Meta, SEO under existing project) ===
    { project_id: EXISTING_PROJECTS.marketing, title: 'GTM Audit — review existing tags from previous ads team', status: 'this_week', priority: 'critical', assignee: 'harper', harper_action: true, order: 0, tags: ['gtm', 'analytics'], notes: 'Blocked: Need GTM access from Zach' },
    { project_id: EXISTING_PROJECTS.marketing, title: 'Install Meta Pixel via GTM', status: 'backlog', priority: 'high', assignee: 'harper', harper_action: true, order: 1, tags: ['meta', 'pixel'], notes: 'Depends on GTM audit. 30 min task.' },
    { project_id: EXISTING_PROJECTS.marketing, title: 'Meta Retargeting campaign setup ($40/day budget)', status: 'backlog', priority: 'high', assignee: 'harper', harper_action: true, order: 2, tags: ['meta', 'ads', 'retargeting'], notes: 'Strategy doc complete. Requires Nata V3 + pixel data.' },
    { project_id: EXISTING_PROJECTS.marketing, title: 'SEO keyword strategy + content calendar', status: 'backlog', priority: 'normal', assignee: 'harper', harper_action: true, order: 3, tags: ['seo'] },
    { project_id: EXISTING_PROJECTS.marketing, title: 'GBP optimization for all 16 locations', status: 'backlog', priority: 'normal', assignee: 'harper', harper_action: true, order: 4, tags: ['gbp', 'seo'] },

    // === CONTENT SYSTEM (new project) ===
    { project_id: projectMap['Content System'], title: 'Phase 1: SplashZone content upload pipeline', status: 'backlog', priority: 'high', assignee: 'harper', harper_action: true, order: 0, tags: ['content', 'splashzone'] },
    { project_id: projectMap['Content System'], title: 'Phase 2: Marketing Hub queue + manual posting', status: 'backlog', priority: 'normal', assignee: 'harper', harper_action: true, order: 1, tags: ['content'] },
    { project_id: projectMap['Content System'], title: 'Phase 3: Distribution automation (IG, FB, TikTok, LinkedIn)', status: 'backlog', priority: 'normal', assignee: 'harper', harper_action: true, order: 2, tags: ['content', 'automation'] },
    { project_id: projectMap['Content System'], title: 'Phase 4: Video processing + parent submissions', status: 'backlog', priority: 'low', assignee: 'harper', harper_action: true, order: 3, tags: ['content', 'video'] },
    { project_id: projectMap['Content System'], title: 'Phase 5: Analytics + performance tracking', status: 'backlog', priority: 'low', assignee: 'harper', harper_action: true, order: 4, tags: ['content', 'analytics'] },

    // === SWIM LIFECYCLE (new project) ===
    { project_id: projectMap['Swim Lifecycle'], title: 'Design lifecycle engagement flows (5 phases)', status: 'backlog', priority: 'normal', assignee: 'harper', harper_action: true, order: 0, tags: ['lifecycle', 'design'], notes: 'Vision doc complete. Build after Nata V3.' },
    { project_id: projectMap['Swim Lifecycle'], title: 'Welcome sequence for new bookings', status: 'backlog', priority: 'normal', assignee: 'harper', harper_action: true, order: 1, tags: ['lifecycle', 'automation'] },
    { project_id: projectMap['Swim Lifecycle'], title: 'Mid-season check-in system', status: 'backlog', priority: 'low', assignee: 'harper', harper_action: true, order: 2, tags: ['lifecycle'] },
    { project_id: projectMap['Swim Lifecycle'], title: 'Renewal / Hold Your Spot campaign', status: 'backlog', priority: 'normal', assignee: 'harper', harper_action: true, order: 3, tags: ['lifecycle', 'retention'] },
    { project_id: projectMap['Swim Lifecycle'], title: 'Win-back campaigns for churned customers', status: 'backlog', priority: 'low', assignee: 'harper', harper_action: true, order: 4, tags: ['lifecycle'] },

    // === WEBSITE & CRO (new project) ===
    { project_id: projectMap['Website & CRO'], title: 'Establish baseline conversion metrics', status: 'backlog', priority: 'high', assignee: 'harper', harper_action: true, order: 0, tags: ['cro', 'analytics'], notes: 'Depends on GTM audit' },
    { project_id: projectMap['Website & CRO'], title: 'A/B test booking page layouts', status: 'backlog', priority: 'normal', assignee: 'harper', harper_action: true, order: 1, tags: ['cro', 'testing'] },
    { project_id: projectMap['Website & CRO'], title: 'Landing page optimization for ad traffic', status: 'backlog', priority: 'normal', assignee: 'harper', harper_action: true, order: 2, tags: ['cro', 'ads'] },

    // === COACH PROFILES (new project) ===
    { project_id: projectMap['Coach Profiles'], title: 'Design coach profile page template', status: 'backlog', priority: 'normal', assignee: 'harper', harper_action: true, order: 0, tags: ['seo', 'coaches'] },
    { project_id: projectMap['Coach Profiles'], title: 'Build coach profile pages with SEO optimization', status: 'backlog', priority: 'normal', assignee: 'harper', harper_action: true, order: 1, tags: ['seo', 'coaches'] },
    { project_id: projectMap['Coach Profiles'], title: 'Integrate direct booking from coach profiles', status: 'backlog', priority: 'low', assignee: 'harper', harper_action: true, order: 2, tags: ['booking', 'coaches'] },

    // === SWIM HUB (existing project) ===
    { project_id: EXISTING_PROJECTS.swimHub, title: 'Social Media section build', status: 'backlog', priority: 'normal', assignee: 'harper', harper_action: true, order: 0, tags: ['social', 'content'] },
    { project_id: EXISTING_PROJECTS.swimHub, title: 'Reviews & Reputation dashboard', status: 'backlog', priority: 'normal', assignee: 'harper', harper_action: true, order: 1, tags: ['reviews'] },
    { project_id: EXISTING_PROJECTS.swimHub, title: 'Email Marketing module', status: 'backlog', priority: 'low', assignee: 'harper', harper_action: true, order: 2, tags: ['email'] },

    // === HOLLY (existing project — Mortgage) ===
    { project_id: EXISTING_PROJECTS.holly, title: 'Post-discovery automated follow-up via Holly', status: 'backlog', priority: 'high', assignee: 'harper', harper_action: true, order: 0, tags: ['automation', 'conversion'], notes: 'Key for closing discovery→application gap' },
    { project_id: EXISTING_PROJECTS.holly, title: 'Document collection bot (friendly, persistent chase)', status: 'backlog', priority: 'high', assignee: 'harper', harper_action: true, order: 1, tags: ['automation', 'docs'] },
    { project_id: EXISTING_PROJECTS.holly, title: 'meetholly.ca — Realtor buyer qualification portal', status: 'backlog', priority: 'normal', assignee: 'harper', harper_action: true, order: 2, tags: ['realtor', 'portal'], notes: 'Greg priority #1. Build after lifecycle proven.' },
    { project_id: EXISTING_PROJECTS.holly, title: 'Holly status updates for active clients', status: 'backlog', priority: 'normal', assignee: 'harper', harper_action: true, order: 3, tags: ['automation', 'communication'] },

    // === LOD (existing project — Mortgage) ===
    { project_id: EXISTING_PROJECTS.lod, title: 'Add personal clients pipeline (Greg\'s book of business)', status: 'backlog', priority: 'high', assignee: 'harper', harper_action: true, order: 0, tags: ['pipeline'], notes: 'Greg priority #2 — personal leads have no system' },
    { project_id: EXISTING_PROJECTS.lod, title: 'Finmo API integration (deal status sync)', status: 'backlog', priority: 'normal', assignee: 'harper', harper_action: true, order: 1, tags: ['integration', 'finmo'] },
    { project_id: EXISTING_PROJECTS.lod, title: 'Evolve LOD into full CRM (contact management, deal pipeline)', status: 'backlog', priority: 'normal', assignee: 'harper', harper_action: true, order: 2, tags: ['crm'], notes: 'Instead of buying new CRM, build on LOD' },

    // === CUSTOMER PORTAL (new project — Mortgage) ===
    { project_id: projectMap['Customer Portal'], title: 'Monthly mortgage health reports (replace Ownwell)', status: 'backlog', priority: 'high', assignee: 'harper', harper_action: true, order: 0, tags: ['reports', 'clients'] },
    { project_id: projectMap['Customer Portal'], title: 'Rate change alerts for existing clients', status: 'backlog', priority: 'normal', assignee: 'harper', harper_action: true, order: 1, tags: ['alerts', 'rates'] },
    { project_id: projectMap['Customer Portal'], title: 'Penalty monitoring dashboard', status: 'backlog', priority: 'normal', assignee: 'harper', harper_action: true, order: 2, tags: ['monitoring'] },
    { project_id: projectMap['Customer Portal'], title: 'Annual review scheduling via Holly', status: 'backlog', priority: 'low', assignee: 'harper', harper_action: true, order: 3, tags: ['scheduling', 'holly'] },
    { project_id: projectMap['Customer Portal'], title: 'Life-change detection triggers', status: 'backlog', priority: 'low', assignee: 'harper', harper_action: true, order: 4, tags: ['automation', 'lifecycle'] },

    // === MORTGAGE WEBSITE (new project) ===
    { project_id: projectMap['Website'], title: 'Design new Inspired Mortgage brand site', status: 'backlog', priority: 'normal', assignee: 'harper', harper_action: true, order: 0, tags: ['website', 'brand'] },
    { project_id: projectMap['Website'], title: 'Holly AI intake on website', status: 'backlog', priority: 'normal', assignee: 'harper', harper_action: true, order: 1, tags: ['website', 'holly'] },
    { project_id: projectMap['Website'], title: 'Realtor partner page', status: 'backlog', priority: 'low', assignee: 'harper', harper_action: true, order: 2, tags: ['website', 'realtor'] },

    // === HARPER OS (existing project) ===
    { project_id: EXISTING_PROJECTS.harperOS, title: 'Project management — Needs Review workflow', status: 'in_progress', priority: 'critical', assignee: 'harper', harper_action: true, order: 0, tags: ['feature', 'core'], notes: 'Adding review stage + seeding real project data' },
    { project_id: EXISTING_PROJECTS.harperOS, title: 'Daily briefing integration into dashboard', status: 'backlog', priority: 'normal', assignee: 'harper', harper_action: true, order: 1, tags: ['feature'] },
    { project_id: EXISTING_PROJECTS.harperOS, title: 'Harper API — let me update tasks programmatically', status: 'backlog', priority: 'high', assignee: 'harper', harper_action: true, order: 2, tags: ['api', 'core'], notes: 'Enables me to move tasks through stages proactively' },
  ];

  console.log(`Inserting ${tasks.length} tasks...`);
  const { data, error } = await supabase
    .from('tasks')
    .insert(tasks)
    .select('id, title, status');
  
  if (error) {
    console.error('Error inserting tasks:', error);
    return;
  }
  
  console.log(`Successfully created ${data.length} tasks`);
  for (const t of data) {
    console.log(`  [${t.status}] ${t.title}`);
  }
}

async function main() {
  console.log('🚀 Seeding HarperOS with real project data...\n');
  
  const newProjects = await seedNewProjects();
  if (!newProjects) {
    console.error('Failed to create projects. Aborting.');
    process.exit(1);
  }
  
  console.log('');
  await seedTasks(newProjects);
  
  console.log('\n✅ Seeding complete!');
  console.log('\n⚠️  IMPORTANT: Run this SQL in Supabase Dashboard to enable the "Needs Review" status:');
  console.log('    ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check;');
  console.log('    ALTER TABLE tasks ADD CONSTRAINT tasks_status_check CHECK (status IN (\'backlog\', \'this_week\', \'today\', \'in_progress\', \'needs_review\', \'done\'));');
}

main().catch(console.error);
