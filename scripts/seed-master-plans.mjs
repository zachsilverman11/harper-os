import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://odjqikyekktqlnrarupg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kanFpa3lla2t0cWxucmFydXBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MzM1NDksImV4cCI6MjA4NTIwOTU0OX0.vNN78oAd1LNCaaGUwZ-XTDF4QgxU4QLe6huGiLHM3_U'
);

const BIZ = {
  swim: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  mortgage: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  personal: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
};

const plans = [
  // ─────────────────────────────────────────────
  // 1. NATA
  // ─────────────────────────────────────────────
  {
    title: 'Master Plan: Nata',
    summary: 'V3 booking platform redesign — 8-step flow collapsed to 3-step mobile-first conversational experience.',
    tags: ['booking', 'nata', 'v3', 'mobile-first', 'swim'],
    project_id: '450a9ff2-796b-4bb6-a2b9-d4f729c70019',
    business_id: BIZ.swim,
    content: `# Master Plan: Nata

> **Status:** Active
> **Owner:** Zach & Harper
> **Last Updated:** 2026-01-30
> **Review Status:** 🔍 NEEDS ZACH'S REVIEW

## Vision
Transform the Inspired Swim booking experience from an 8-step desktop form into a 3-step mobile-first conversational flow that feels effortless — increasing conversion and reducing drop-off.

## Current State
V3 redesign is **actively in progress**. 12 total tasks: 2 done, 1 in progress, 1 due today, 2 this week, 6 in backlog. The mobile-first conversational booking redesign is the primary focus. The old 8-step flow is live but conversion is suboptimal.

## Phases

### Phase 1: Foundation & Research — ✅ Done
- Existing flow audit complete
- Drop-off points identified
- Mobile usage data analyzed (majority of bookings are mobile)

### Phase 2: V3 Conversational Redesign — 🔨 In Progress
- 3-step flow architecture defined
- Mobile-first UI components in development
- Conversational UX patterns being implemented
- Step 1: Location + Program selection (combined)
- Step 2: Schedule + Coach preference
- Step 3: Confirm + Pay

### Phase 3: Testing & Optimization — 📋 Up Next
- A/B test V3 vs V2 flow
- Mobile conversion tracking
- Load testing for peak enrollment periods

### Phase 4: Advanced Features — 💡 Planned
- AI-suggested programs based on child age/level
- Waitlist management
- Multi-child booking in single flow
- Returning customer express booking

## Key Metrics
- **Booking completion rate:** Target 70%+ (up from current)
- **Mobile conversion:** Target parity with desktop
- **Time to complete booking:** Target <90 seconds
- **Support tickets related to booking:** Target 50% reduction

## Blockers & Dependencies
- Need final sign-off on 3-step flow design
- Payment integration must support the new condensed flow
- Mobile testing across devices needed before launch

## Next Actions
- [ ] Complete in-progress task (V3 flow implementation)
- [ ] Ship today's task
- [ ] Review this-week tasks and prioritize
- [ ] Schedule Zach review of V3 prototype

## Decision Log
- 2026-01-30: V3 redesign confirmed — 8-step→3-step conversational flow
- Mobile-first approach chosen based on traffic data (majority mobile users)
`,
  },

  // ─────────────────────────────────────────────
  // 2. SWIM HUB
  // ─────────────────────────────────────────────
  {
    title: 'Master Plan: Swim Hub',
    summary: 'Internal marketing & operations dashboard — lead tracking, QuickBooks, social, reviews, and email modules.',
    tags: ['dashboard', 'swim-hub', 'marketing', 'operations', 'swim'],
    project_id: '3f44ec7a-0e0d-4437-a4f3-7b4e6b7581cc',
    business_id: BIZ.swim,
    content: `# Master Plan: Swim Hub

> **Status:** Planning
> **Owner:** Zach & Harper
> **Last Updated:** 2026-01-30
> **Review Status:** 🔍 NEEDS ZACH'S REVIEW

## Vision
A unified internal dashboard that gives Zach and the Inspired Swim team real-time visibility into marketing performance, operations metrics, and financial health — all in one place.

## Current State
Early stage. 7 total tasks: 2 this week, 5 in backlog. No modules are live yet. This is the central nervous system that will connect marketing data, operations metrics, and financial reporting.

## Phases

### Phase 1: Lead-to-Book Tracking — 📋 Up Next
- Track leads from source through to booked lesson
- Attribution by channel (Google Ads, Meta, organic, referral)
- Conversion funnel visualization

### Phase 2: Marketing Hub — 💡 Planned
- Google Ads performance dashboard
- Meta ads performance dashboard
- SEO ranking tracker
- Campaign ROI calculator

### Phase 3: Operations Metrics — 💡 Planned
- Enrollment numbers by location
- Coach utilization rates
- Capacity vs. demand heatmap
- Retention metrics display

### Phase 4: Financial Integration — 💡 Planned
- QuickBooks integration
- Revenue by location/program
- Expense tracking
- Profit margins by service

### Phase 5: Communication Modules — 💡 Planned
- Social media posting/scheduling
- Review management (Google, Facebook)
- Email campaign performance
- Customer communication logs

## Key Metrics
- **Data freshness:** Real-time or <1hr lag
- **User adoption:** Zach + Cheri using daily within 30 days of launch
- **Decision speed:** Reduce time-to-insight from hours to seconds

## Blockers & Dependencies
- Depends on Data & Analytics project for clean GA4/GTM data
- QuickBooks API access needed
- Social media account access required
- Need to define which metrics matter most (avoid dashboard bloat)

## Next Actions
- [ ] Complete 2 this-week tasks
- [ ] Define MVP module (likely lead-to-book tracking)
- [ ] Wireframe dashboard layout
- [ ] Identify data sources and API requirements

## Decision Log
- 2026-01-30: Project scoped with 7 modules — prioritization TBD
`,
  },

  // ─────────────────────────────────────────────
  // 3. SPLASH ZONE
  // ─────────────────────────────────────────────
  {
    title: 'Master Plan: Splash Zone',
    summary: 'Instructor engagement platform driving Google reviews — targets 500 Q1, 1000 EOY.',
    tags: ['splash-zone', 'reviews', 'google', 'instructors', 'swim'],
    project_id: 'd734bd41-80b2-4429-ac9b-1ae5bbbedbfd',
    business_id: BIZ.swim,
    content: `# Master Plan: Splash Zone

> **Status:** Active
> **Owner:** Zach & Harper
> **Last Updated:** 2026-01-30
> **Review Status:** 🔍 NEEDS ZACH'S REVIEW

## Vision
Turn swim instructors into content creators and review generators — building social proof at scale through an engagement platform that makes it easy for coaches to share moments and prompt parent reviews.

## Current State
Active with 4 tasks: 2 this week, 2 in backlog. The concept is defined and initial work is underway. **Critical issue:** Langley GBP (Google Business Profile) is currently suspended — needs resolution. AI content processing pipeline is being built.

## Phases

### Phase 1: Review Generation Engine — 🔨 In Progress
- Post-lesson review prompt system
- Coach-specific review links
- Parent engagement flow (lesson recap → review ask)
- Target: 500 Google reviews by end of Q1

### Phase 2: AI Content Processing — 📋 Up Next
- Coach-submitted photos/videos processed by AI
- Auto-generate social media content from raw inputs
- Brand-consistent captions and hashtags
- Content approval workflow

### Phase 3: Scale & Optimize — 💡 Planned
- Gamification for coaches (leaderboard, rewards)
- Multi-location review distribution
- A/B test review prompt messaging
- Target: 1,000 Google reviews by EOY

## Key Metrics
- **Google reviews:** 500 by Q1, 1,000 by EOY
- **Review response rate:** Target 15%+ of prompted parents
- **Coach participation:** 80%+ of coaches actively submitting content
- **Content output:** 3+ social posts per week from coach submissions

## Blockers & Dependencies
- ⚠️ **BLOCKER:** Langley GBP suspended — needs immediate resolution
- Coach onboarding/training needed
- Parent contact info required for review prompts
- AI content pipeline depends on account access

## Next Actions
- [ ] Resolve Langley GBP suspension (URGENT)
- [ ] Complete 2 this-week tasks
- [ ] Set up review prompt automation
- [ ] Brief coaches on Splash Zone participation

## Decision Log
- 2026-01-30: Review targets set — 500 Q1, 1,000 EOY
- Langley GBP suspension identified as blocker
`,
  },

  // ─────────────────────────────────────────────
  // 4. MARKETING
  // ─────────────────────────────────────────────
  {
    title: 'Master Plan: Marketing',
    summary: 'Full-stack marketing — Google Ads (5x ROAS), Meta retargeting ($40/day), SEO, directories, 16 GBP locations.',
    tags: ['marketing', 'google-ads', 'meta', 'seo', 'gbp', 'swim'],
    project_id: 'b9cff46d-db6a-4e00-a019-5529b699e353',
    business_id: BIZ.swim,
    content: `# Master Plan: Marketing

> **Status:** Active
> **Owner:** Zach & Harper
> **Last Updated:** 2026-01-30
> **Review Status:** 🔍 NEEDS ZACH'S REVIEW

## Vision
Build a full-stack marketing machine for Inspired Swim — paid ads with 5x+ ROAS, retargeting to capture warm leads, SEO for organic growth, and 16 GBP locations for local dominance.

## Current State
Most active project by task count. 21 total tasks: 3 done, 2 due today, 2 this week, 14 in backlog. Google Ads and Meta retargeting are the immediate priorities. SEO and directory work is queued.

## Phases

### Phase 1: Google Ads Optimization — 🔨 In Progress
- Campaign structure audit and rebuild
- Keyword optimization for swim lessons by location
- Target: 5x ROAS
- Budget allocation by location performance
- 3 tasks completed in this phase

### Phase 2: Meta Retargeting — 🔨 In Progress
- Meta pixel installed and configured
- Retargeting audiences built (site visitors, partial bookings)
- Budget: $40/day
- Creative assets for retargeting ads
- Lookalike audiences from customer list

### Phase 3: SEO & Content — 📋 Up Next
- SEO article strategy (location + program keywords)
- On-page optimization for booking pages
- Blog content calendar
- Internal linking structure

### Phase 4: Local Presence — 📋 Up Next
- 16 GBP locations fully optimized
- Directory submissions (Yelp, Yellow Pages, local directories)
- Citation consistency audit
- Review response templates

### Phase 5: Advanced Campaigns — 💡 Planned
- Seasonal campaign playbooks (summer, back-to-school)
- Referral program marketing
- Email marketing integration
- Video ad creative

## Key Metrics
- **Google Ads ROAS:** Target 5x
- **Meta retargeting CPA:** Track cost per booking from retargeting
- **Organic traffic:** Month-over-month growth
- **GBP impressions:** Across all 16 locations
- **Directory listings:** Complete and consistent

## Blockers & Dependencies
- Data & Analytics project must be complete for accurate tracking
- Meta pixel needs clean GA4 data to build audiences
- GBP management across 16 locations is labor-intensive
- SEO articles need content creation bandwidth

## Next Actions
- [ ] Complete 2 today tasks
- [ ] Complete 2 this-week tasks
- [ ] Review Google Ads ROAS against 5x target
- [ ] Validate Meta pixel firing correctly
- [ ] Audit all 16 GBP locations

## Decision Log
- 2026-01-30: Google Ads target set at 5x ROAS
- 2026-01-30: Meta retargeting budget set at $40/day
- 16 GBP locations confirmed as management scope
`,
  },

  // ─────────────────────────────────────────────
  // 5. OPERATIONS
  // ─────────────────────────────────────────────
  {
    title: 'Master Plan: Operations',
    summary: 'Team management, location ops, sales conversion — 65% renewal target with Cheri leading.',
    tags: ['operations', 'team', 'locations', 'retention', 'swim'],
    project_id: '2e30d98b-1f87-40c3-b847-ce9d4a6a0a71',
    business_id: BIZ.swim,
    content: `# Master Plan: Operations

> **Status:** Active
> **Owner:** Zach & Cheri
> **Last Updated:** 2026-01-30
> **Review Status:** 🔍 NEEDS ZACH'S REVIEW

## Vision
Streamline Inspired Swim operations — empower Cheri (GM) with data-driven tools, optimize sales conversion, and hit 65% renewal rate through AI-assisted micro-messaging and systematic follow-up.

## Current State
Lean project with 4 tasks: 2 this week, 2 in backlog. Focus is on sales conversion review with Cheri and implementing AI micro-messaging for customer touchpoints.

## Phases

### Phase 1: Sales Conversion Review — 📋 Up Next
- Sit down with Cheri to review current conversion funnel
- Identify drop-off points in inquiry→trial→enrollment
- Set baseline conversion metrics by location
- Define improvement targets

### Phase 2: AI Micro-Messaging — 📋 Up Next
- Automated touchpoints throughout customer lifecycle
- Post-trial follow-up sequences
- Mid-season check-ins
- Re-enrollment prompts
- Personalized by coach and program

### Phase 3: Location Optimization — 💡 Planned
- Performance metrics by location
- Staff allocation optimization
- Capacity utilization tracking
- Seasonal demand forecasting

### Phase 4: Team Enablement — 💡 Planned
- Coach performance dashboards
- Training and development tracking
- Communication tools for team
- Recognition and incentive programs

## Key Metrics
- **Renewal rate:** Target 65% (up from 34%)
- **Trial→enrollment conversion:** Establish baseline, then improve
- **Response time to inquiries:** Target <1 hour
- **Coach satisfaction:** Track via periodic surveys

## Blockers & Dependencies
- Cheri's availability for sales conversion review
- Overlaps with Retention Engine project (renewal targets)
- AI micro-messaging needs customer data and consent
- Location metrics depend on Swim Hub dashboard

## Next Actions
- [ ] Schedule sales conversion review with Cheri
- [ ] Complete 2 this-week tasks
- [ ] Define AI micro-messaging trigger points
- [ ] Map current operational workflows

## Decision Log
- 2026-01-30: 65% renewal rate set as primary operations target
- Cheri (GM) identified as key operations owner
`,
  },

  // ─────────────────────────────────────────────
  // 6. DATA & ANALYTICS
  // ─────────────────────────────────────────────
  {
    title: 'Master Plan: Data & Analytics',
    summary: 'GTM/GA4 nuclear rebuild after malware flag — 5-phase recovery from tag deletion to full restoration.',
    tags: ['data', 'analytics', 'gtm', 'ga4', 'google-ads', 'swim'],
    project_id: 'eae14231-e0b8-43e1-8651-125455e71f0c',
    business_id: BIZ.swim,
    content: `# Master Plan: Data & Analytics

> **Status:** Active (URGENT)
> **Owner:** Harper
> **Last Updated:** 2026-01-30
> **Review Status:** 🔍 NEEDS ZACH'S REVIEW

## Vision
Rebuild Inspired Swim's entire analytics infrastructure from scratch after a catastrophic malware flag destroyed all GTM tags — creating a clean, reliable data foundation that every other project depends on.

## Current State
**Critical recovery in progress.** All 21 GTM tags were flagged as malware and deleted. Starting from zero. 17 total tasks: 2 done, 2 in progress, 3 due today, 5 this week, 5 in backlog. Phase 1 (GA4 + Ads config tags) has been created but needs publishing.

## Phases

### Phase 1: GA4 + Google Ads Config Tags — 🔨 In Progress
- ✅ GA4 configuration tag created
- ✅ Google Ads conversion tag created
- ⏳ **Needs publish** — tags are staged but not live
- Basic pageview and conversion tracking

### Phase 2: Link Google Ads ↔ GA4 — 📋 Up Next
- Connect Google Ads account to GA4 property
- Import GA4 conversions into Google Ads
- Enable auto-tagging
- Verify conversion data flowing correctly

### Phase 3: Traffic Filtering — 📋 Up Next
- Internal traffic filters (office IPs, team devices)
- Bot/spam filtering
- Cross-domain tracking if needed
- Data quality validation

### Phase 4: Key Events Configuration — 📋 Up Next
- Booking completion event
- Form submission events
- Phone call tracking events
- Scroll depth and engagement events
- Custom events for funnel stages

### Phase 5: Restore Third-Party Tags — 💡 Planned
- Facebook/Meta pixel reinstall
- CallRail tracking restoration
- Any other third-party tags
- Full QA across all tags

## Key Metrics
- **Tags live and firing:** Target 100% accuracy
- **Data gaps:** Minimize days of lost data
- **Conversion tracking accuracy:** Validated against actual bookings
- **Page load impact:** Tags shouldn't add >200ms

## Blockers & Dependencies
- ⚠️ **Phase 1 needs publishing** — everything else is blocked until GA4/Ads tags go live
- This project blocks: Marketing, Swim Hub, Website & CRO, and all conversion tracking
- Need GTM publish access (Harper has it via browser)
- Meta pixel reinstall needs Business Suite access

## Next Actions
- [ ] **PUBLISH GTM container** (Phase 1 tags are ready)
- [ ] Complete 3 today tasks
- [ ] Complete 5 this-week tasks
- [ ] Begin Phase 2 (Ads↔GA4 linking) immediately after publish
- [ ] Document all new tags for future reference

## Decision Log
- 2026-01-30: All 21 original GTM tags deleted due to malware flags
- 2026-01-30: Nuclear rebuild approach chosen — clean slate, no tag recovery
- GA4 + Ads config tags created as Phase 1 priority
`,
  },

  // ─────────────────────────────────────────────
  // 7. RETENTION ENGINE
  // ─────────────────────────────────────────────
  {
    title: 'Master Plan: Retention Engine',
    summary: 'Drive retention from 34% to 65% — $350K/yr revenue impact. Phase 1 done, Phase 2 building email automation.',
    tags: ['retention', 'email', 'automation', 'revenue', 'swim'],
    project_id: '77b0b55e-9a9b-421a-a7b6-9ade4f9b6b1f',
    business_id: BIZ.swim,
    content: `# Master Plan: Retention Engine

> **Status:** Active
> **Owner:** Zach & Harper
> **Last Updated:** 2026-01-30
> **Review Status:** 🔍 NEEDS ZACH'S REVIEW

## Vision
Transform Inspired Swim's retention from 34% to 65% — a $350K/year revenue impact. Systematic, data-driven retention through automation, coaching insights, and proactive engagement.

## Current State
Phase 1 is **complete**. 25 total tasks: 3 done, 12 backlog, 10 in idea stage. Analytics, Hold Your Spot feature, and per-coach data are live. Phase 2 (email automation) is being built. **Critical blocker:** Coach data needs validation with Cheri before proceeding.

⚠️ **NOTE:** This project overlaps with Swim Lifecycle — recommend consolidating Swim Lifecycle into this project.

## Phases

### Phase 1: Analytics & Quick Wins — ✅ Done
- ✅ Retention analytics dashboard
- ✅ "Hold Your Spot" feature (pause instead of cancel)
- ✅ Per-coach retention data

### Phase 2: Email Automation — 📋 Up Next
- 8 email templates to build:
  - Welcome series
  - Progress milestone celebrations
  - Mid-season check-in
  - Renewal reminder sequence
  - At-risk intervention
  - Coach spotlight/connection
  - Seasonal transition
  - Referral ask
- Automation triggers defined
- Amberin briefing on retention strategy

### Phase 3: Win-Back Campaigns — 💡 Planned
- Lapsed customer identification
- Win-back email sequence
- Special offers for returning families
- Phone outreach for high-value churned customers

### Phase 4: Optimization — 💡 Planned
- A/B test email templates
- Optimize trigger timing
- Coach-specific retention playbooks
- Predictive churn model

## Key Metrics
- **Retention rate:** 34% → 65% (current → target)
- **Revenue impact:** $350K/year additional revenue at target
- **Email open rates:** Target 35%+
- **Hold Your Spot usage:** Track adoption rate
- **Win-back conversion:** Target 15% of lapsed customers

## Blockers & Dependencies
- ⚠️ **BLOCKER:** Coach data needs validation with Cheri first — cannot proceed with coach-specific retention tactics until data is verified
- Email automation platform needed (or existing platform configuration)
- Amberin needs briefing on retention strategy
- Overlaps with Swim Lifecycle project (consolidation recommended)

## Next Actions
- [ ] Validate coach data with Cheri (BLOCKER)
- [ ] Brief Amberin on retention strategy
- [ ] Build first 2 email templates (welcome + renewal reminder)
- [ ] Define automation triggers and timing
- [ ] Review Phase 1 results and impact

## Decision Log
- 2026-01-30: Phase 1 complete — analytics, Hold Your Spot, per-coach data all live
- 34%→65% retention target confirmed ($350K/yr impact)
- Coach data validation with Cheri identified as critical blocker
- Swim Lifecycle project flagged for consolidation into this project
`,
  },

  // ─────────────────────────────────────────────
  // 8. CONTENT & SOCIAL MEDIA ENGINE
  // ─────────────────────────────────────────────
  {
    title: 'Master Plan: Content & Social Media Engine',
    summary: '5-phase content pipeline from SplashZone capture to multi-platform distribution — 22 tasks, mostly ideation.',
    tags: ['content', 'social-media', 'ai', 'splash-zone', 'swim'],
    project_id: 'b612b56e-ce99-4c27-9710-0cc02a92e807',
    business_id: BIZ.swim,
    content: `# Master Plan: Content & Social Media Engine

> **Status:** Planning
> **Owner:** Zach & Harper
> **Last Updated:** 2026-01-30
> **Review Status:** 🔍 NEEDS ZACH'S REVIEW

## Vision
Build an AI-powered content machine that turns raw coach-submitted content from Splash Zone into polished, multi-platform social media posts — scaling Inspired Swim's social presence without scaling headcount.

## Current State
Mostly in ideation. 22 total tasks: 8 backlog, 14 in idea stage. The concept is well-defined but execution hasn't started. Needs foundational work (platform audit, account access, content calendar) before building.

⚠️ **NOTE:** This project overlaps significantly with **Content System** (9e3d9124). Strongly recommend consolidating these two projects into one.

## Phases

### Phase 1: Foundation & Audit — 📋 Up Next
- Platform audit (what accounts exist, access status)
- Content calendar framework
- Account access consolidation
- Brand voice and style guide
- Competitor content analysis

### Phase 2: Splash Zone Integration — 💡 Planned
- Connect to Splash Zone coach submissions
- AI content processing pipeline
- Auto-generate captions, hashtags, alt text
- Content approval workflow

### Phase 3: Multi-Platform Distribution — 💡 Planned
- Facebook posting automation
- Instagram feed + stories + reels
- Google Business Profile posts
- YouTube Shorts (if applicable)

### Phase 4: Coach Briefs & Engagement — 💡 Planned
- Coach content briefs (what to capture, when)
- Best practices guides
- Engagement templates for comments/DMs
- Coach spotlight series

### Phase 5: Analytics & Optimization — 💡 Planned
- Social media performance tracking
- Content type performance analysis
- Optimal posting schedule
- ROI measurement for social content

## Key Metrics
- **Posts per week:** Target 5+ across platforms
- **Engagement rate:** Target 3%+ (industry average ~1%)
- **Follower growth:** 10% month-over-month
- **Time per post:** <10 min with AI assistance (vs. 30-60 min manual)

## Blockers & Dependencies
- Account access needed for all social platforms
- Splash Zone must be operational for content source
- AI content processing pipeline needs building
- Coach onboarding for content capture
- **Consolidation decision needed** with Content System project

## Next Actions
- [ ] Decide on consolidation with Content System project
- [ ] Complete platform audit
- [ ] Secure all account access
- [ ] Define content calendar template
- [ ] Brief coaches on content capture expectations

## Decision Log
- 2026-01-30: 5-phase approach defined
- Overlap with Content System project flagged for consolidation
`,
  },

  // ─────────────────────────────────────────────
  // 9. CONTENT SYSTEM
  // ─────────────────────────────────────────────
  {
    title: 'Master Plan: Content System',
    summary: '5-phase content pipeline — significant overlap with Content & Social Media Engine, flagged for consolidation.',
    tags: ['content', 'pipeline', 'swim', 'consolidation-candidate'],
    project_id: '9e3d9124-63eb-429b-a726-2e141387fa93',
    business_id: BIZ.swim,
    content: `# Master Plan: Content System

> **Status:** Planning
> **Owner:** Zach & Harper
> **Last Updated:** 2026-01-30
> **Review Status:** 🔍 NEEDS ZACH'S REVIEW

## Vision
Systematic content creation pipeline for Inspired Swim — from ideation through production to distribution.

## Current State
Early planning. 7 total tasks: 5 backlog, 2 in idea stage. No execution has started.

⚠️ **CONSOLIDATION RECOMMENDED:** This project overlaps significantly with **Content & Social Media Engine** (b612b56e). Both cover content pipelines, AI processing, and multi-platform distribution. Recommend merging this project into Content & Social Media Engine to avoid duplicated effort and confusion.

## Phases

### Phase 1: Content Strategy — 💡 Planned
- Define content pillars
- Audience segmentation
- Content types and formats
- Editorial calendar

### Phase 2: Creation Pipeline — 💡 Planned
- Templates for recurring content
- AI-assisted copywriting
- Visual asset creation workflow
- Brand consistency guidelines

### Phase 3: Review & Approval — 💡 Planned
- Approval workflow
- Quality standards
- Legal/compliance check (if needed)

### Phase 4: Distribution — 💡 Planned
- Multi-channel publishing
- Scheduling automation
- Cross-posting rules

### Phase 5: Performance — 💡 Planned
- Content performance tracking
- ROI analysis
- Iteration based on data

## Key Metrics
- **Content output:** TBD (depends on consolidation decision)
- **Pipeline efficiency:** Time from idea to published

## Blockers & Dependencies
- ⚠️ **DECISION NEEDED:** Consolidate into Content & Social Media Engine?
- Almost entirely overlapping scope with Content & Social Media Engine
- No work started — clean merge is possible

## Next Actions
- [ ] **Zach to decide:** Merge into Content & Social Media Engine or keep separate
- [ ] If merged: Move relevant tasks to Content & Social Media Engine
- [ ] If kept: Define clear scope boundaries between the two projects

## Decision Log
- 2026-01-30: Flagged for consolidation with Content & Social Media Engine
- No work started — clean slate for either decision
`,
  },

  // ─────────────────────────────────────────────
  // 10. SWIM LIFECYCLE
  // ─────────────────────────────────────────────
  {
    title: 'Master Plan: Swim Lifecycle',
    summary: 'Welcome→mid-season→renewal→win-back email lifecycle — overlaps with Retention Engine, flagged for consolidation.',
    tags: ['lifecycle', 'email', 'retention', 'swim', 'consolidation-candidate'],
    project_id: 'f97ab47c-1d10-44be-a599-2445293013cd',
    business_id: BIZ.swim,
    content: `# Master Plan: Swim Lifecycle

> **Status:** Planning
> **Owner:** Zach & Harper
> **Last Updated:** 2026-01-30
> **Review Status:** 🔍 NEEDS ZACH'S REVIEW

## Vision
Map and automate the complete customer lifecycle for swim families — from first welcome through mid-season engagement, renewal, and win-back.

## Current State
Not started. 5 total tasks, all in backlog. No execution has begun.

⚠️ **CONSOLIDATION RECOMMENDED:** This project overlaps heavily with **Retention Engine** (77b0b55e). The Retention Engine already covers welcome sequences, renewal reminders, and win-back campaigns as part of its Phase 2-3 roadmap. Recommend merging Swim Lifecycle into Retention Engine.

## Phases

### Phase 1: Welcome Journey — 💡 Planned
- Welcome email/SMS sequence
- First-lesson preparation guide
- Coach introduction
- Facility orientation

### Phase 2: Mid-Season Engagement — 💡 Planned
- Progress updates
- Coach feedback sharing
- Mid-season check-in
- Upsell opportunities (additional lessons, camps)

### Phase 3: Renewal Flow — 💡 Planned
- Renewal reminder sequence
- Early-bird incentives
- Schedule preview for next season
- Seamless re-enrollment

### Phase 4: Win-Back — 💡 Planned
- Lapsed customer identification
- Win-back offers
- Feedback collection
- Re-engagement campaigns

## Key Metrics
- Same as Retention Engine targets (34%→65% retention)
- **Email engagement:** Open rates, click-through rates per stage

## Blockers & Dependencies
- ⚠️ **DECISION NEEDED:** Consolidate into Retention Engine?
- Retention Engine already covers most of this scope
- No work started — clean merge is possible

## Next Actions
- [ ] **Zach to decide:** Merge into Retention Engine or keep separate
- [ ] If merged: Move tasks to Retention Engine as lifecycle-specific items
- [ ] If kept: Define clear scope boundaries

## Decision Log
- 2026-01-30: Flagged for consolidation with Retention Engine
- No work started — clean slate for either decision
`,
  },

  // ─────────────────────────────────────────────
  // 11. WEBSITE & CRO
  // ─────────────────────────────────────────────
  {
    title: 'Master Plan: Website & CRO',
    summary: 'A/B testing and landing page optimization — baseline conversion metrics established.',
    tags: ['website', 'cro', 'conversion', 'a-b-testing', 'swim'],
    project_id: '92db8849-2c44-401b-a7de-f7019527e4c9',
    business_id: BIZ.swim,
    content: `# Master Plan: Website & CRO

> **Status:** Active
> **Owner:** Harper
> **Last Updated:** 2026-01-30
> **Review Status:** 🔍 NEEDS ZACH'S REVIEW

## Vision
Maximize the conversion rate of inspiredswim.com — every visitor who lands on the site should have the clearest, fastest path to booking a lesson.

## Current State
Small but meaningful project. 3 total tasks: 1 done, 2 in backlog. Baseline conversion metrics have been established. A/B testing and landing page optimization are next.

## Phases

### Phase 1: Baseline & Measurement — ✅ Done
- ✅ Baseline conversion metrics established
- Current conversion rate documented
- Key landing pages identified
- Traffic sources mapped

### Phase 2: Landing Page Optimization — 📋 Up Next
- High-traffic page audit
- Copy and CTA optimization
- Mobile UX improvements
- Page speed optimization

### Phase 3: A/B Testing Program — 💡 Planned
- Testing framework setup
- Priority test backlog
- Statistical significance standards
- Ongoing optimization cadence

## Key Metrics
- **Conversion rate:** Establish baseline → improve by 20%+
- **Bounce rate:** Reduce on key landing pages
- **Page load speed:** Target <3 seconds
- **Mobile conversion:** Parity with desktop

## Blockers & Dependencies
- Data & Analytics must be live for accurate conversion tracking
- A/B testing tool needed (Google Optimize deprecated — need alternative)
- Landing page changes need dev resources or CMS access

## Next Actions
- [ ] Audit top 5 landing pages for conversion opportunities
- [ ] Select A/B testing tool
- [ ] Create first A/B test hypothesis
- [ ] Verify conversion tracking is working (depends on Data & Analytics)

## Decision Log
- 2026-01-30: Baseline conversion metrics established (Phase 1 complete)
`,
  },

  // ─────────────────────────────────────────────
  // 12. COACH PROFILES
  // ─────────────────────────────────────────────
  {
    title: 'Master Plan: Coach Profiles',
    summary: 'SEO surface area expansion via individual coach profile pages with direct booking integration.',
    tags: ['coach-profiles', 'seo', 'booking', 'swim'],
    project_id: '2a15c498-e2eb-4918-a558-253d7392de46',
    business_id: BIZ.swim,
    content: `# Master Plan: Coach Profiles

> **Status:** Planning
> **Owner:** Zach & Harper
> **Last Updated:** 2026-01-30
> **Review Status:** 🔍 NEEDS ZACH'S REVIEW

## Vision
Give every Inspired Swim coach their own profile page — expanding SEO surface area, positioning coaches as the product, and enabling direct booking with preferred instructors.

## Current State
Not started. 3 total tasks, all in backlog. The concept is clear but no execution has begun.

## Phases

### Phase 1: Profile Infrastructure — 💡 Planned
- Coach profile page template
- Dynamic pages from coach data
- Photo, bio, specialties, certifications
- SEO optimization (schema markup, unique content)

### Phase 2: Coach-as-Product — 💡 Planned
- Review integration (coach-specific reviews)
- Teaching philosophy and approach
- Video introductions
- Parent testimonials per coach

### Phase 3: Direct Booking — 💡 Planned
- Book directly with specific coach from profile
- Coach availability display
- Integration with Nata booking flow
- "Request this coach" for full classes

## Key Metrics
- **SEO pages indexed:** One per coach (target: all coaches)
- **Organic traffic from coach pages:** Track as new channel
- **Direct bookings via profiles:** Track as conversion source
- **Coach profile completeness:** Target 100% with photo + bio

## Blockers & Dependencies
- Nata booking system integration needed for direct booking
- Coach cooperation needed (photos, bios, video intros)
- Website/CMS must support dynamic profile pages
- Review system (Splash Zone) integration

## Next Actions
- [ ] Define coach profile page template/wireframe
- [ ] Collect coach photos and bios
- [ ] Evaluate CMS capability for dynamic pages
- [ ] Plan SEO schema markup for coach pages

## Decision Log
- 2026-01-30: Project scoped — SEO + coach-as-product + direct booking
- No work started yet
`,
  },

  // ─────────────────────────────────────────────
  // 13. LOD (LEADS ON DEMAND)
  // ─────────────────────────────────────────────
  {
    title: 'Master Plan: LOD (Leads on Demand)',
    summary: 'AI-powered mortgage lead generation — Holly AI just shipped Claude consolidation, Cal.com booking, YouTube hooks, Inngest sequences.',
    tags: ['lod', 'holly', 'mortgage', 'ai', 'leads', 'claude'],
    project_id: 'bbabff0c-75a9-46b0-ba9e-5a6bb0730f89',
    business_id: BIZ.mortgage,
    content: `# Master Plan: LOD (Leads on Demand)

> **Status:** Active (SHIPPED UPDATE)
> **Owner:** Zach & Harper
> **Last Updated:** 2026-01-30
> **Review Status:** 🔍 NEEDS ZACH'S REVIEW

## Vision
An AI-native mortgage lead generation and conversion platform — Holly AI handles intake, qualification, trust-building, and handoff to human advisors. Leads on Demand means exactly what it says: turn on the tap, get qualified leads.

## Current State
**Largest project, major milestone just shipped.** 40 total tasks: 1 done, 1 needs review, 3 this week, 35 in backlog. Just merged a major PR to production on Jan 30 with: Holly GPT-4o→Claude consolidation, Cal.com direct booking, YouTube trust hooks, report copy isolation (Greg-approved), and post-call email/SMS sequences via Inngest.

## Phases

### Phase 1: Holly AI Core — ✅ Done (Jan 30 Ship)
- ✅ Holly consolidated from GPT-4o to Claude
- ✅ Cal.com direct booking integration
- ✅ YouTube trust hooks embedded in conversation
- ✅ Report copy isolation (Greg approved)
- ✅ Post-call email/SMS sequences via Inngest
- ✅ PR merged to production Jan 30

### Phase 2: Holly Buyer Portal — 📋 Up Next
- meetholly.ca portal for buyers
- Self-serve mortgage education
- Document upload and management
- Application status tracking
- Holly AI available for questions 24/7

### Phase 3: Realtor Dashboard — 💡 Planned
- Realtor partner portal
- Shared client pipeline view
- Co-marketing tools
- Commission/referral tracking
- Realtor-specific Holly AI interactions

### Phase 4: Financial Integration — 💡 Planned
- Finmo API integration
- Rate comparison engine
- Pre-approval automation
- Document verification pipeline

### Phase 5: CRM Evolution — 💡 Planned
- Replace Pipedrive with AI-native CRM
- Full pipeline management
- Automated follow-ups
- Deal scoring and prioritization
- Integration with all LOD components

## Key Metrics
- **Leads generated per month:** Track and grow
- **Lead-to-consultation conversion:** Target 30%+
- **Holly conversation completion rate:** Target 70%+
- **Time-to-first-contact:** Target <5 minutes (AI) 
- **Cost per qualified lead:** Track and optimize

## Blockers & Dependencies
- Holly buyer portal needs design and architecture
- Finmo API access and documentation needed
- Realtor dashboard requires partner feedback
- CRM evolution is a large undertaking — needs separate planning
- Greg's ongoing approval for copy and messaging

## Next Actions
- [ ] Review needs_review task
- [ ] Complete 3 this-week tasks
- [ ] Plan Holly buyer portal (meetholly.ca) architecture
- [ ] Begin Finmo API integration research
- [ ] Monitor post-ship metrics from Jan 30 release

## Decision Log
- 2026-01-30: Major production ship — Holly Claude, Cal.com, YouTube hooks, Inngest sequences
- Greg approved report copy isolation
- GPT-4o→Claude migration completed for Holly AI
- Inngest chosen for email/SMS sequence orchestration
`,
  },

  // ─────────────────────────────────────────────
  // 14. CUSTOMER PORTAL
  // ─────────────────────────────────────────────
  {
    title: 'Master Plan: Customer Portal',
    summary: 'Post-close mortgage management — rate alerts, health reports, penalty monitoring, annual reviews via Holly.',
    tags: ['portal', 'mortgage', 'post-close', 'holly', 'customer'],
    project_id: '05ab6d9d-bb4b-4aaf-bc3b-43e2b0d25dab',
    business_id: BIZ.mortgage,
    content: `# Master Plan: Customer Portal

> **Status:** Planning
> **Owner:** Zach
> **Last Updated:** 2026-01-30
> **Review Status:** 🔍 NEEDS ZACH'S REVIEW

## Vision
Keep mortgage clients engaged for life after closing — proactive rate alerts, monthly health reports, penalty monitoring, and annual reviews powered by Holly AI. Turn one-time transactions into lifetime relationships.

## Current State
Not started. 5 total tasks, all in backlog. Concept is well-defined but needs LOD/Holly foundation to mature first.

## Phases

### Phase 1: Rate Alert System — 💡 Planned
- Monitor market rates vs. client's current rate
- Automated alerts when refinance makes sense
- Savings calculator
- One-click refinance inquiry

### Phase 2: Monthly Health Reports — 💡 Planned
- Equity growth tracking
- Payment history summary
- Market value estimates
- Amortization progress visualization

### Phase 3: Penalty Monitoring — 💡 Planned
- Prepayment penalty tracking
- Optimal prepayment timing
- Penalty-free date countdown
- Strategy recommendations

### Phase 4: Annual Reviews — 💡 Planned
- Holly AI-powered annual mortgage review
- Life change detection (marriage, kids, job change)
- Proactive recommendations based on situation changes
- Renewal planning 12-18 months ahead

### Phase 5: Client Engagement — 💡 Planned
- Referral program for existing clients
- Educational content library
- Community features
- Event invitations

## Key Metrics
- **Client retention:** Track renewal rate with Inspired Mortgage
- **Portal login frequency:** Target monthly active engagement
- **Refinance conversion from alerts:** Track as revenue source
- **Referrals from existing clients:** Track and grow

## Blockers & Dependencies
- LOD platform must mature first (Holly AI, client data)
- Rate data feed needed for alerts
- Property valuation API needed for equity tracking
- Mortgage data integration (payments, balances, penalties)

## Next Actions
- [ ] Define MVP scope (likely rate alerts + basic dashboard)
- [ ] Research rate data APIs
- [ ] Wireframe basic portal layout
- [ ] Plan Holly AI integration for annual reviews

## Decision Log
- 2026-01-30: Project scoped with 5 key features
- Sequenced after LOD — depends on Holly AI foundation
`,
  },

  // ─────────────────────────────────────────────
  // 15. WEBSITE (MORTGAGE)
  // ─────────────────────────────────────────────
  {
    title: 'Master Plan: Website (Mortgage)',
    summary: 'New Inspired Mortgage brand site with Holly AI intake and realtor partner page.',
    tags: ['website', 'mortgage', 'brand', 'holly'],
    project_id: '9d7055f0-fc02-4449-b154-7ec278c96ecc',
    business_id: BIZ.mortgage,
    content: `# Master Plan: Website (Mortgage)

> **Status:** Planning
> **Owner:** Zach
> **Last Updated:** 2026-01-30
> **Review Status:** 🔍 NEEDS ZACH'S REVIEW

## Vision
Launch a modern Inspired Mortgage brand website that positions the business as tech-forward and AI-powered — with Holly AI handling initial client intake and a dedicated realtor partnership page for referral growth.

## Current State
Not started. 3 total tasks, all in backlog. Depends on LOD and Holly AI maturity.

## Phases

### Phase 1: Brand Site — 💡 Planned
- New inspired.mortgage website
- Brand identity and messaging
- Service pages (purchase, refinance, renewal)
- Team/about page
- Testimonials and social proof

### Phase 2: Holly AI Intake — 💡 Planned
- Holly AI chat widget on site
- Initial client qualification
- Appointment booking via Cal.com
- Document upload initiation
- Seamless handoff to human advisor

### Phase 3: Realtor Partner Page — 💡 Planned
- Dedicated realtor partnership landing page
- Co-marketing opportunities
- Referral program details
- Partner application form
- Success stories/case studies

## Key Metrics
- **Website traffic:** Baseline → growth trajectory
- **Holly intake conversations started:** Track as lead source
- **Realtor partner applications:** Track and grow
- **Site-to-lead conversion rate:** Target 5%+

## Blockers & Dependencies
- Brand identity needs finalization
- Holly AI must be production-ready for intake (done via LOD)
- Content creation for all pages
- Domain setup (inspired.mortgage)

## Next Actions
- [ ] Finalize brand identity and messaging
- [ ] Wireframe key pages
- [ ] Plan Holly AI widget integration
- [ ] Draft realtor partnership proposal

## Decision Log
- 2026-01-30: Three-phase approach — brand site, Holly intake, realtor page
- Sequenced after LOD Holly AI foundation
`,
  },

  // ─────────────────────────────────────────────
  // 16. CRM
  // ─────────────────────────────────────────────
  {
    title: 'Master Plan: CRM',
    summary: 'AI-native CRM replacing Pipedrive — evolving from LOD. Early planning, no tasks yet.',
    tags: ['crm', 'mortgage', 'ai', 'pipedrive'],
    project_id: '19e032b5-2709-4fad-9811-4da343126d9b',
    business_id: BIZ.mortgage,
    content: `# Master Plan: CRM

> **Status:** Early Planning
> **Owner:** Zach
> **Last Updated:** 2026-01-30
> **Review Status:** 🔍 NEEDS ZACH'S REVIEW

## Vision
Build an AI-native CRM that replaces Pipedrive — purpose-built for mortgage brokering with Holly AI at the center. Not adapting a generic CRM, but building one that thinks like a mortgage broker.

## Current State
**Earliest stage of all projects.** 0 visible tasks. This is a vision-level project that will evolve from the LOD platform. Pipedrive is currently in use but will eventually be replaced.

## Phases

### Phase 1: Requirements & Architecture — 💡 Planned
- Document current Pipedrive usage and workflows
- Identify gaps in current CRM experience
- Define AI-native CRM capabilities
- Architecture planning (likely extension of LOD platform)

### Phase 2: Core Pipeline — 💡 Planned
- Lead intake and scoring (powered by Holly AI)
- Deal pipeline with AI recommendations
- Contact management with conversation history
- Task and follow-up automation

### Phase 3: AI Features — 💡 Planned
- Predictive deal scoring
- Next-best-action recommendations
- Automated data entry from conversations
- Smart reminders and follow-ups

### Phase 4: Integrations — 💡 Planned
- Holly AI full integration
- Email and calendar sync
- Finmo/lender integration
- Document management
- Reporting and analytics

### Phase 5: Migration — 💡 Planned
- Pipedrive data export
- Data migration and validation
- Team training
- Parallel run period
- Pipedrive sunset

## Key Metrics
- **To be defined** — too early for concrete targets
- Directionally: faster deal velocity, higher conversion, less manual data entry

## Blockers & Dependencies
- LOD platform must mature significantly first
- Pipedrive migration requires careful planning
- Team buy-in needed for CRM change
- Holly AI capabilities must be proven in production

## Next Actions
- [ ] Document current Pipedrive workflows
- [ ] Identify top 5 pain points with current CRM
- [ ] Define what "AI-native" means for a mortgage CRM
- [ ] Create preliminary architecture doc

## Decision Log
- 2026-01-30: Project created — evolving from LOD platform
- Pipedrive replacement confirmed as long-term goal
- No tasks created yet — earliest planning stage
`,
  },

  // ─────────────────────────────────────────────
  // 17. HARPER OS
  // ─────────────────────────────────────────────
  {
    title: 'Master Plan: Harper OS',
    summary: 'The system itself — personal AI operating system with Supabase + Vercel, mobile UI, morning briefings, calendar sync.',
    tags: ['harper-os', 'personal', 'ai', 'supabase', 'vercel'],
    project_id: '5feb7598-086b-464b-b449-5fde08a79a61',
    business_id: BIZ.personal,
    content: `# Master Plan: Harper OS

> **Status:** Active
> **Owner:** Zach & Harper
> **Last Updated:** 2026-01-30
> **Review Status:** 🔍 NEEDS ZACH'S REVIEW

## Vision
Harper OS is Zach's personal AI operating system — the brain that connects all businesses, projects, and life management into one intelligent, proactive assistant. This is the system writing these plans.

## Current State
Live and functional. 9 total tasks: 2 done, 1 needs review, 6 in backlog. Supabase backend and Vercel frontend are deployed. Core functionality works — task management, project tracking, document storage. Mobile responsive design, morning briefings, and calendar sync are in progress or planned.

## Phases

### Phase 1: Foundation — ✅ Done
- ✅ Supabase backend deployed
- ✅ Vercel frontend deployed
- Core data models (projects, tasks, documents)
- Basic CRUD operations

### Phase 2: Intelligence Layer — 🔨 In Progress
- Harper API for AI interactions
- Morning briefings (daily summary + priorities)
- Calendar sync (Google Calendar integration)
- Task intelligence (smart prioritization)

### Phase 3: Mobile Experience — 📋 Up Next
- Mobile responsive redesign
- Quick-capture for tasks and notes
- Push notifications for urgent items
- Offline capability

### Phase 4: Proactive Features — 💡 Planned
- Daily briefings delivered to Telegram
- Automated status updates
- Cross-project dependency tracking
- Predictive task scheduling
- Business health dashboards

### Phase 5: Integration Hub — 💡 Planned
- Connect all business tools
- Unified notification center
- Cross-business reporting
- Life management (personal goals, health, etc.)

## Key Metrics
- **Daily active use:** Zach using Harper OS every day
- **Briefing accuracy:** Morning briefings actionable and accurate
- **Task completion rate:** Track if Harper OS improves throughput
- **System uptime:** Target 99.9%

## Blockers & Dependencies
- Calendar sync needs Google service account (configured)
- Mobile responsive requires UI refactor
- Morning briefings need aggregation logic across all projects
- Self-referential — improvements to Harper OS improve everything else

## Next Actions
- [ ] Review the needs_review task
- [ ] Implement morning briefing system
- [ ] Complete calendar sync integration
- [ ] Begin mobile responsive work
- [ ] Seed master plans into documents table (THIS TASK)

## Decision Log
- 2026-01-30: Supabase + Vercel stack confirmed and deployed
- 2026-01-30: Master plans being seeded into documents table
- Harper serves as AI co-pilot across all businesses
`,
  },
];

// Add common fields to all plans
const documents = plans.map(plan => ({
  ...plan,
  doc_type: 'plan',
  status: 'draft',
  author: 'harper',
}));

async function seedPlans() {
  console.log(`\n🚀 Seeding ${documents.length} master plans into Supabase...\n`);

  // First, check if any existing plans need to be cleaned up
  const { data: existing, error: fetchError } = await supabase
    .from('documents')
    .select('id, title')
    .eq('doc_type', 'plan')
    .eq('author', 'harper');

  if (fetchError) {
    console.error('❌ Error fetching existing plans:', fetchError.message);
    // Continue anyway — might be no existing plans
  } else if (existing && existing.length > 0) {
    console.log(`📋 Found ${existing.length} existing plans. Deleting to replace with fresh versions...`);
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('doc_type', 'plan')
      .eq('author', 'harper');
    
    if (deleteError) {
      console.error('❌ Error deleting existing plans:', deleteError.message);
      console.log('⚠️  Proceeding with insert anyway (may create duplicates)');
    } else {
      console.log('✅ Old plans deleted.\n');
    }
  }

  // Insert all plans
  const { data, error } = await supabase
    .from('documents')
    .insert(documents)
    .select('id, title');

  if (error) {
    console.error('❌ Error inserting plans:', error.message);
    console.error('Details:', JSON.stringify(error, null, 2));
    
    // Try one-by-one to identify which plans fail
    console.log('\n🔄 Retrying one-by-one to identify issues...\n');
    let successCount = 0;
    let failCount = 0;
    
    for (const doc of documents) {
      const { data: d, error: e } = await supabase
        .from('documents')
        .insert(doc)
        .select('id, title');
      
      if (e) {
        console.error(`  ❌ ${doc.title}: ${e.message}`);
        failCount++;
      } else {
        console.log(`  ✅ ${d[0].title} (${d[0].id})`);
        successCount++;
      }
    }
    
    console.log(`\n📊 Results: ${successCount} success, ${failCount} failed`);
  } else {
    console.log('✅ All plans inserted successfully!\n');
    for (const d of data) {
      console.log(`  📄 ${d.title} (${d.id})`);
    }
    console.log(`\n📊 Total: ${data.length} master plans seeded.`);
  }

  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 CONSOLIDATION FLAGS:');
  console.log('  ⚠️  Content System → merge into Content & Social Media Engine');
  console.log('  ⚠️  Swim Lifecycle → merge into Retention Engine');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n🔍 All plans inserted as DRAFT — need Zach\'s review.');
  console.log('Done! 🎉\n');
}

seedPlans().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
