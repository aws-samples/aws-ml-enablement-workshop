import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { analyticsClient } from '../api/client.js';
import { useAppStore } from '../stores/appStore.js';
import { MetricCard } from '../components/analytics/MetricCard.js';
import { TimeSeriesChart } from '../components/analytics/TimeSeriesChart.js';
import { TopItemsList } from '../components/analytics/TopItemsList.js';
import { DateRangeSelector } from '../components/analytics/DateRangeSelector.js';
import { EventsTable } from '../components/analytics/EventsTable.js';

export const DashboardPage: React.FC = () => {
  const { selectedApplication } = useAppStore();
  
  // ローカルな日付範囲状態
  const [dateRange, setDateRange] = useState({
    startDate: startOfDay(subDays(new Date(), 7)),
    endDate: endOfDay(new Date())
  });

  const handleDateRangeChange = (newRange: { startDate: Date; endDate: Date }) => {
    setDateRange(newRange);
  };

  // サマリーデータの取得
  const { data, isLoading, error } = useQuery({
    queryKey: ['summary', selectedApplication, dateRange.startDate, dateRange.endDate],
    queryFn: () => {
      if (!selectedApplication) throw new Error('No application selected');
      
      return analyticsClient.getSummary(selectedApplication, {
        startTime: dateRange.startDate.getTime(),
        endTime: dateRange.endDate.getTime(),
        granularity: 'day',
      });
    },
    enabled: !!selectedApplication,
    refetchInterval: 60000, // 1分ごとに更新
  });

  // イベント詳細データの取得
  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ['events', selectedApplication, dateRange.startDate, dateRange.endDate],
    queryFn: () => {
      if (!selectedApplication) throw new Error('No application selected');
      
      return analyticsClient.getEvents(selectedApplication, {
        startTime: dateRange.startDate.getTime(),
        endTime: dateRange.endDate.getTime(),
        limit: 100, // 最大100件まで取得
      });
    },
    enabled: !!selectedApplication,
  });

  if (!selectedApplication) {
    return (
      <div className="card text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          アプリケーションが選択されていません
        </h3>
        <p className="text-gray-600">
          アプリケーションページからアプリケーションを選択してください。
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-red-50 border-red-200">
        <div className="text-center py-8">
          <p className="text-red-800 font-medium">ダッシュボードデータの読み込みに失敗しました</p>
          <p className="text-red-600 text-sm mt-2">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          ダッシュボード - {selectedApplication}
        </h1>
        <div className="text-sm text-gray-600">
          {format(dateRange.startDate, 'MMM dd')} - {format(dateRange.endDate, 'MMM dd, yyyy')}
        </div>
      </div>

      {/* Date Range Selector */}
      <DateRangeSelector 
        onDateRangeChange={handleDateRangeChange}
        currentRange={dateRange}
      />

      {/* Metrics Card */}
      <div className="max-w-sm">
        <MetricCard
          title="総イベント数"
          value={data?.totalEvents || 0}
          change={{
            value: 0,
            trend: 'up',
          }}
        />
      </div>

      {/* Time Series Chart */}
      <TimeSeriesChart 
        data={data?.timeSeriesData?.map(item => {
          const date = new Date(item.time);
          if (isNaN(date.getTime())) {
            console.error('Invalid date:', item.time);
            return {
              timestamp: Date.now(),
              eventCount: 0,
              userCount: 0,
            };
          }
          return {
            timestamp: date.getTime(),
            eventCount: item.events,
            userCount: item.users,
          };
        }) || []}
      />

      {/* Top Events and Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopItemsList
          title="トップイベント"
          items={data?.topEvents || []}
          type="events"
        />
        <TopItemsList
          title="トップページ"
          items={data?.topPages?.map(page => ({
            name: page.page,
            count: page.views,
            percentage: page.percentage,
          })) || []}
          type="pages"
        />
      </div>

      {/* Events Table */}
      <div className="space-y-4">
        <EventsTable 
          events={eventsData?.events || []} 
          isLoading={eventsLoading}
          dateRange={dateRange}
        />
      </div>
    </div>
  );
};