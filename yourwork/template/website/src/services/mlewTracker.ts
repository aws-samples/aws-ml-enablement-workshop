// MLEW Tracker の接続コード（固定ファイル）。
// yourwork/template/website/src/services/mlewTracker.ts からそのままコピーして使う。編集しない。
// 依存するのは public/tracker-sdk.js が定義する window.MLEWTracker とブラウザ標準 API だけ。

export type MlewTrackerConfig = {
  applicationId: string;
  applicationName: string;
  apiEndpoint: string;
  apiKey: string;
  debug?: boolean;
};

// TanStack Router の router.history のうち、ここで使う subscribe だけを受け取る型
export type RouterHistoryLike = {
  subscribe: (
    listener: (event: {
      location: { pathname: string };
      action: { type: string };
    }) => void,
  ) => () => void;
};

type TrackerInstance = {
  track: (eventType: string, properties?: Record<string, unknown>) => void;
  trackClick: (
    elementName: string,
    properties?: Record<string, unknown>,
  ) => void;
  trackView: (page: string, properties?: Record<string, unknown>) => void;
  setUserId: (userId: string) => void;
};

declare global {
  interface Window {
    MLEWTracker?: {
      Tracker: new (config: Record<string, unknown>) => TrackerInstance;
    };
  }
}

const VISITOR_ID_KEY = 'mlew-visitor-id';
// SDK が起動時に userId を復元するキー（SDK の Storage の接頭辞 mlew_tracker_ + userId）
const SDK_USER_ID_KEY = 'mlew_tracker_userId';

let tracker: TrackerInstance | undefined;
const sentSections = new Set<string>();

// ブラウザごとに永続する匿名 ID。localStorage が使えない環境では 'anonymous'
const getVisitorId = (): string => {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return 'anonymous';
  }
};

// SDK を初期化し、ルート遷移のページビューを記録する。main.tsx で createRouter の後に 1 回呼ぶ
export const initTracker = (
  config: MlewTrackerConfig,
  history: RouterHistoryLike,
): void => {
  if (tracker) return;
  if (!window.MLEWTracker) {
    console.error(
      '[MLEW Tracker] SDK が読み込まれていません。index.html の <head> に <script src="/tracker-sdk.js"></script>（async / defer なし）があるか確認してください',
    );
    return;
  }
  const apiEndpoint = config.apiEndpoint.trim().replace(/\/+$/, '');
  const apiKey = config.apiKey.trim();
  if (!apiEndpoint || !apiKey) {
    // SDK は未設定だと localhost に送ろうとし、失敗しても警告だけで続くため、ここで止める
    console.error(
      '[MLEW Tracker] config.ts の tracker.apiEndpoint / tracker.apiKey が空のため、イベントを送信しません',
    );
    return;
  }

  // SDK はコンストラクタで初回ページビューを送るので、userId は生成前に SDK のキーへ書いておく
  const visitorId = getVisitorId();
  try {
    localStorage.setItem(SDK_USER_ID_KEY, visitorId);
  } catch {
    // localStorage が使えない環境では setUserId だけで続行する
  }
  tracker = new window.MLEWTracker.Tracker({
    applicationId: config.applicationId,
    applicationName: config.applicationName,
    apiEndpoint,
    apiKey,
    autoTrack: true,
    debug: config.debug ?? false,
  });
  tracker.setUserId(visitorId);

  // SDK はクリックの page を記録時点の URL から取るため、Link 遷移では遷移先のパスになる。
  // キャプチャ段階で遷移前のパスを data-track-page に入れ、SDK にそれを page として使わせる
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const el = target.closest<HTMLElement>('[data-track="true"]');
      if (el) el.dataset.trackPage = window.location.pathname;
    },
    true,
  );

  // SDK は初回表示と popstate（戻る・進む）しかページビューを記録しない。
  // Link 遷移（PUSH / REPLACE）だけをここで記録する（BACK / FORWARD は SDK と二重になるので除く）
  let lastPath = window.location.pathname;
  history.subscribe(({ location, action }) => {
    if (location.pathname === lastPath) return;
    lastPath = location.pathname;
    sentSections.clear();
    if (action.type === 'PUSH' || action.type === 'REPLACE') {
      tracker?.trackView(location.pathname, { title: document.title });
    }
  });
};

// data-track を付けられない操作のクリックを記録する。data-track を付けた要素には使わない
export const trackClick = (
  elementName: string,
  properties?: Record<string, unknown>,
): void => {
  tracker?.trackClick(elementName, {
    page: window.location.pathname,
    ...properties,
  });
};

// セクションの表示を custom イベント（section-view）で記録する。同じページでは 1 セクション 1 回
export const trackSectionView = (
  sectionName: string,
  properties?: Record<string, unknown>,
): void => {
  if (!tracker) return;
  const key = `${window.location.pathname}#${sectionName}`;
  if (sentSections.has(key)) return;
  sentSections.add(key);
  tracker.track('section-view', { sectionName, ...properties });
};

// 要素が画面に入ったら trackSectionView を 1 回呼ぶ。戻り値は監視の解除
export const observeSection = (
  element: Element,
  sectionName: string,
  threshold = 0.3,
): (() => void) => {
  if (typeof IntersectionObserver === 'undefined') return () => {};
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        trackSectionView(sectionName);
        observer.disconnect();
      }
    },
    { threshold },
  );
  observer.observe(element);
  return () => observer.disconnect();
};
