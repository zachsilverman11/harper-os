import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Create a separate Supabase client for Swim Hub (analytics data)
const swimHubUrl = process.env.SWIMHUB_SUPABASE_URL || '';
const swimHubKey = process.env.SWIMHUB_SUPABASE_SERVICE_KEY || '';
const swimHubSupabase = swimHubUrl && swimHubKey
  ? createClient(swimHubUrl, swimHubKey)
  : null;

export async function GET() {
  try {
    if (!swimHubSupabase) {
      return NextResponse.json({
        websiteSessions: { value: 0, trend: 0, trendUp: false },
        organicTraffic: { value: 0, trend: 0, trendUp: false },
        bookings: { value: 0, trend: 0, trendUp: false },
        bounceRate: { value: 0, trend: 0, trendUp: false },
      });
    }

    // Calculate date ranges
    const today = new Date();
    const last7DaysStart = new Date(today);
    last7DaysStart.setDate(today.getDate() - 7);
    const prior7DaysStart = new Date(today);
    prior7DaysStart.setDate(today.getDate() - 14);

    // Format dates for Supabase query (YYYY-MM-DD)
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const todayStr = formatDate(today);
    const last7DaysStr = formatDate(last7DaysStart);
    const prior7DaysStr = formatDate(prior7DaysStart);

    // Fetch last 14 days of data from daily_kpi_snapshots
    const { data: snapshots, error } = await swimHubSupabase
      .from('daily_kpi_snapshots')
      .select('*')
      .gte('date', prior7DaysStr)
      .lte('date', todayStr)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching KPI snapshots:', error);
      return NextResponse.json(
        { error: 'Failed to fetch KPI data', details: error.message },
        { status: 500 }
      );
    }

    if (!snapshots || snapshots.length === 0) {
      // Return placeholder data if no data available
      return NextResponse.json({
        websiteSessions: {
          value: 0,
          trend: 0,
          trendUp: false,
        },
        organicTraffic: {
          value: 0,
          trend: 0,
          trendUp: false,
        },
        bookings: {
          value: 0,
          trend: 0,
          trendUp: false,
        },
        bounceRate: {
          value: 0,
          trend: 0,
          trendUp: false,
        },
      });
    }

    // Split into last 7 days and prior 7 days
    const last7Days = snapshots.filter((s) => s.date >= last7DaysStr);
    const prior7Days = snapshots.filter(
      (s) => s.date >= prior7DaysStr && s.date < last7DaysStr
    );

    // Calculate totals for last 7 days
    const totalSessions = last7Days.reduce(
      (sum, s) => sum + (s.sessions || 0),
      0
    );
    const totalOrganicSessions = last7Days.reduce(
      (sum, s) => sum + (s.organic_sessions || 0),
      0
    );

    // Calculate totals for prior 7 days
    const priorTotalSessions = prior7Days.reduce(
      (sum, s) => sum + (s.sessions || 0),
      0
    );
    const priorTotalOrganicSessions = prior7Days.reduce(
      (sum, s) => sum + (s.organic_sessions || 0),
      0
    );

    // Calculate percentage changes
    const sessionsTrend =
      priorTotalSessions > 0
        ? ((totalSessions - priorTotalSessions) / priorTotalSessions) * 100
        : 0;
    const organicTrend =
      priorTotalOrganicSessions > 0
        ? ((totalOrganicSessions - priorTotalOrganicSessions) /
            priorTotalOrganicSessions) *
          100
        : 0;

    // Get latest bounce rate (most recent day with data)
    const latestSnapshot = snapshots[0];
    const latestBounceRate = latestSnapshot?.bounce_rate || 0;

    // Calculate bounce rate trend (compare to 7 days ago)
    const weekAgoSnapshot = snapshots.find((s) => s.date === last7DaysStr);
    const weekAgoBounceRate = weekAgoSnapshot?.bounce_rate || latestBounceRate;
    const bounceRateTrend =
      weekAgoBounceRate > 0
        ? ((latestBounceRate - weekAgoBounceRate) / weekAgoBounceRate) * 100
        : 0;

    // Get MTD bookings (from the most recent snapshot)
    const bookingsMTD = latestSnapshot?.bookings_mtd || 0;
    // Simple trend: compare to prior month's same date (if available)
    const bookingsTrend = 0; // TODO: Implement once we have prior month data

    return NextResponse.json({
      websiteSessions: {
        value: totalSessions,
        trend: sessionsTrend,
        trendUp: sessionsTrend > 0,
      },
      organicTraffic: {
        value: totalOrganicSessions,
        trend: organicTrend,
        trendUp: organicTrend > 0,
      },
      bookings: {
        value: bookingsMTD,
        trend: bookingsTrend,
        trendUp: bookingsTrend > 0,
      },
      bounceRate: {
        value: latestBounceRate,
        trend: bounceRateTrend,
        trendUp: bounceRateTrend < 0, // Lower bounce rate is better, so negative trend is "up"
      },
    });
  } catch (err) {
    console.error('Unexpected error in KPI API:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
