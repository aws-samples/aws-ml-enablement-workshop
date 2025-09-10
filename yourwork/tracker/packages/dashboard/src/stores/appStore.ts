import { create } from 'zustand';
import { subDays } from 'date-fns';
import type { DateRange } from '../types/index.js';

interface AppState {
  selectedApplication: string | null;
  dateRange: DateRange;
  
  setSelectedApplication: (appId: string | null, updateUrl?: boolean) => void;
  setDateRange: (range: DateRange) => void;
  initializeFromUrl: () => void;
}

// URLパラメーターを更新する関数
const updateUrlParams = (appId: string | null) => {
  const url = new URL(window.location.href);
  if (appId) {
    url.searchParams.set('app', appId);
  } else {
    url.searchParams.delete('app');
  }
  window.history.replaceState({}, '', url.toString());
};

// localStorageキー
const STORAGE_KEY = 'mlew-tracker-selected-app';

export const useAppStore = create<AppState>((set, get) => ({
  selectedApplication: null,
  dateRange: {
    startDate: subDays(new Date(), 7),
    endDate: new Date(),
  },
  
  setSelectedApplication: (appId, updateUrl = true) => {
    set({ selectedApplication: appId });
    
    // URLパラメーターを更新
    if (updateUrl) {
      updateUrlParams(appId);
    }
    
    // localStorageに保存
    if (appId) {
      localStorage.setItem(STORAGE_KEY, appId);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  },
  
  setDateRange: (range) => set({ dateRange: range }),
  
  initializeFromUrl: () => {
    // URLパラメーターから取得
    const urlParams = new URLSearchParams(window.location.search);
    const appFromUrl = urlParams.get('app');
    
    if (appFromUrl) {
      get().setSelectedApplication(appFromUrl, false); // URL更新はしない
    } else {
      // URLにない場合はlocalStorageから取得
      const appFromStorage = localStorage.getItem(STORAGE_KEY);
      if (appFromStorage) {
        get().setSelectedApplication(appFromStorage, true); // URLを更新
      }
    }
  },
}));