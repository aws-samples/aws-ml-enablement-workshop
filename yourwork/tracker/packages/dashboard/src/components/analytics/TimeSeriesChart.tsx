import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

interface TimeSeriesData {
  timestamp: number;
  eventCount: number;
  userCount?: number; // optional for backward compatibility
}

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
  className?: string;
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ 
  data, 
  className = '' 
}) => {
  // データが存在しない場合の処理
  if (!data || data.length === 0) {
    return (
      <div className={`card ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">イベント数の推移</h3>
        <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-4xl text-gray-300 mb-4">📊</div>
            <p className="text-gray-500 text-lg font-medium">データが見つかりません</p>
            <p className="text-gray-400 text-sm mt-2">選択された期間にイベントデータが存在しません</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = data.map(item => {
    const date = new Date(item.timestamp);
    return {
      ...item,
      date: format(date, 'MM/dd'),
      time: format(date, 'HH:mm'),
      fullDate: format(date, 'MM/dd HH:mm'),
    };
  });

  // X軸のラベル間隔を自動調整
  const getXAxisInterval = () => {
    const dataLength = chartData.length;
    if (dataLength <= 6) return 0; // 6個以下なら全て表示
    if (dataLength <= 12) return 1; // 12個以下なら1個おき
    if (dataLength <= 24) return Math.ceil(dataLength / 6); // 24個以下なら約6分割
    return Math.ceil(dataLength / 8); // それ以上なら約8分割
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`card ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">イベント数の推移</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="fullDate"
            stroke="#6b7280"
            fontSize={11}
            angle={-45}
            textAnchor="end"
            height={60}
            interval={getXAxisInterval()}
            tick={{ fontSize: 11 }}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="eventCount" 
            stroke="#3b82f6" 
            strokeWidth={3}
            name="イベント数"
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};