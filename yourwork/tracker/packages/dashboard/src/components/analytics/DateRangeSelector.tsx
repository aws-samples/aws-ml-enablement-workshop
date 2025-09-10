import React, { useState, useEffect } from 'react';
import { format, subDays, startOfDay, endOfDay, differenceInDays } from 'date-fns';
import { ja } from 'date-fns/locale';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateRangeSelectorProps {
  onDateRangeChange: (range: DateRange) => void;
  currentRange?: DateRange;
  className?: string;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  onDateRangeChange,
  currentRange,
  className = ''
}) => {
  const [selectedRange, setSelectedRange] = useState<string>('7d');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  // 現在の日付範囲に基づいてプリセットを自動検出
  useEffect(() => {
    if (!currentRange) return;

    const { startDate, endDate } = currentRange;
    const daysDiff = differenceInDays(endDate, startDate);
    
    // 今日の場合（同じ日）
    if (daysDiff === 0) {
      setSelectedRange('1d');
      return;
    }
    
    // プリセット日数と一致するかチェック
    const matchingPreset = presetRanges.find(preset => {
      if (preset.days === null || preset.days === 0) return false;
      return Math.abs(daysDiff - preset.days) <= 1; // 1日の誤差を許容
    });
    
    if (matchingPreset) {
      setSelectedRange(matchingPreset.value);
    } else {
      // カスタム範囲
      setSelectedRange('custom');
      setCustomStartDate(format(startDate, 'yyyy-MM-dd'));
      setCustomEndDate(format(endDate, 'yyyy-MM-dd'));
    }
  }, [currentRange]);

  const presetRanges = [
    { value: '1d', label: '今日', days: 0 },
    { value: '7d', label: '過去7日', days: 7 },
    { value: '14d', label: '過去14日', days: 14 },
    { value: '30d', label: '過去30日', days: 30 },
    { value: '90d', label: '過去90日', days: 90 },
    { value: 'custom', label: 'カスタム', days: null }
  ];

  const handlePresetChange = (value: string) => {
    setSelectedRange(value);
    
    if (value === 'custom') return;
    
    const preset = presetRanges.find(r => r.value === value);
    if (!preset || preset.days === null) return;

    const endDate = endOfDay(new Date());
    const startDate = preset.days === 0 
      ? startOfDay(new Date()) 
      : startOfDay(subDays(new Date(), preset.days));

    onDateRangeChange({ startDate, endDate });
  };

  const handleCustomDateChange = () => {
    if (!customStartDate || !customEndDate) return;

    const startDate = startOfDay(new Date(customStartDate));
    const endDate = endOfDay(new Date(customEndDate));

    if (startDate > endDate) {
      alert('開始日は終了日より前に設定してください');
      return;
    }

    onDateRangeChange({ startDate, endDate });
  };

  const getCurrentRangeText = () => {
    const preset = presetRanges.find(r => r.value === selectedRange);
    if (selectedRange === 'custom' && customStartDate && customEndDate) {
      const start = format(new Date(customStartDate), 'MM/dd', { locale: ja });
      const end = format(new Date(customEndDate), 'MM/dd', { locale: ja });
      return `${start} - ${end}`;
    }
    return preset?.label || '過去7日';
  };

  return (
    <div className={`card ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">期間選択</h3>
          <p className="text-sm text-gray-600">
            現在の期間: <span className="font-medium">{getCurrentRangeText()}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* プリセット選択 */}
          <div className="flex flex-wrap gap-2">
            {presetRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => handlePresetChange(range.value)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedRange === range.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* カスタム日付入力 */}
          {selectedRange === 'custom' && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">開始</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                />
              </div>
              <span className="text-gray-500">〜</span>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">終了</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                />
              </div>
              <button
                onClick={handleCustomDateChange}
                disabled={!customStartDate || !customEndDate}
                className="px-3 py-1 text-sm font-medium bg-primary-600 text-white rounded hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                適用
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};