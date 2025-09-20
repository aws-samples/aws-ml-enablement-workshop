import React, { useState } from 'react';
import { format } from 'date-fns';
import type { AnalyticsEvent } from '../../types/index.js';
import { analyticsClient } from '../../api/client.js';
import { useAppStore } from '../../stores/appStore.js';

const downloadCSV = (events: AnalyticsEvent[], filename: string) => {
  // CSVヘッダー
  const headers = [
    'No',
    '時刻',
    'イベントID',
    'イベントタイプ',
    'ページ',
    '要素名',
    'ユーザーID',
    'セッションID',
    'ユーザーエージェント',
    '画面幅',
    '画面高さ',
    'カスタムデータ'
  ];

  // データ行を作成
  const rows = events.map((event, index) => [
    (index + 1).toString(),
    format(new Date(event.timestamp), 'yyyy/MM/dd HH:mm:ss'),
    event.eventId,
    event.eventType,
    event.page || '',
    event.elementName || '',
    event.userId || 'anonymous',
    event.sessionId,
    event.userAgent || '',
    event.viewport?.width || '',
    event.viewport?.height || '',
    event.properties ? JSON.stringify(event.properties) : ''
  ]);

  // CSVコンテンツを生成
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      row.map(cell => {
        // セル内にカンマ、改行、ダブルクォートが含まれる場合はエスケープ
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('\n') || cellStr.includes('"')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',')
    )
  ].join('\n');

  // BOMを追加（Excelで文字化けを防ぐため）
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // ダウンロードリンクを作成してクリック
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

interface EventsTableProps {
  events: AnalyticsEvent[];
  isLoading: boolean;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

export const EventsTable: React.FC<EventsTableProps> = ({ events, isLoading, dateRange }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { selectedApplication } = useAppStore();
  if (isLoading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <p className="text-gray-500">この期間にイベントデータがありません</p>
        </div>
      </div>
    );
  }

  const handleDownloadCSV = async () => {
    if (!selectedApplication || !dateRange) {
      alert('アプリケーションと期間を選択してください');
      return;
    }

    setIsDownloading(true);
    try {
      // 全件取得（上限なし）
      const allData = await analyticsClient.getEvents(selectedApplication, {
        startTime: dateRange.startDate.getTime(),
        endTime: dateRange.endDate.getTime(),
        limit: 10000, // 大きめの上限を設定
      });

      const filename = `events_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
      downloadCSV(allData.events, filename);
      
      if (allData.events.length >= 10000) {
        alert(`最大ダウンロード件数（10,000件）に達しました。さらにデータがある可能性があります。`);
      }
    } catch (error) {
      console.error('Failed to download all events:', error);
      alert('全件ダウンロードに失敗しました');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">イベント一覧</h3>
          <p className="text-sm text-gray-500 mt-1">
            直近{events.length}件を表示
            {events.length >= 100 && (
              <span className="text-orange-600 ml-2">
                (最大100件)
              </span>
            )}
          </p>
        </div>
        <button
          onClick={handleDownloadCSV}
          disabled={isDownloading}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              ダウンロード中...
            </>
          ) : (
            <>
              <svg
                className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              CSVダウンロード
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                時刻
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                イベントタイプ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ページ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                要素名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ユーザーID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                セッションID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                カスタムデータ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event, index) => (
              <tr key={event.eventId} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(event.timestamp), 'yyyy/MM/dd HH:mm:ss')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                    ${event.eventType === 'click' ? 'bg-blue-100 text-blue-800' : ''}
                    ${event.eventType === 'view' ? 'bg-green-100 text-green-800' : ''}
                    ${event.eventType === 'custom' ? 'bg-purple-100 text-purple-800' : ''}
                  `}>
                    {event.eventType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {event.page || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {event.elementName || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {event.userId || 'anonymous'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {event.sessionId.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {event.properties ? (
                    <details className="cursor-pointer">
                      <summary className="text-blue-600 hover:text-blue-800">
                        詳細を表示
                      </summary>
                      <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                        {JSON.stringify(event.properties, null, 2)}
                      </pre>
                    </details>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};