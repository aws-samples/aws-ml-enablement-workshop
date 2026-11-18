// MLEW Tracker の計測コード（固定ファイル）。CloudWatch RUM にページビュー・クリック・セクションの表示を送る。
// yourwork/template/website/src/services/mlewTracker.ts からそのままコピーして使う。編集しない。
// 送信先（app monitor の ID とリージョン）は、デプロイ時に infra の MlewTracker が書く /runtime-config.json から読む。
//
// モックの側で書くのは次だけ:
// - main.tsx で initTracker(router.history) を 1 回呼ぶ
// - クリックを記録する要素に、data-track-name 属性で名前を付ける
// - 表示を記録するセクションに、data-track-section 属性で名前を付ける
// - クリック以外の操作（ドラッグ＆ドロップ、選択の変更など）は、trackAction 関数に名前を渡して記録する
import { AwsRum } from '@aws-rum/web-slim';

// TanStack Router の router.history のうち、ここで使う subscribe だけを受け取る型
export type RouterHistoryLike = {
  subscribe: (
    listener: (event: { location: { pathname: string } }) => void,
  ) => () => void;
};

export type MlewTrackerOptions = {
  // モックの版（v1 / v2 など）。分析で版ごとに分けるときに使う
  version?: string;
  debug?: boolean;
};

type TrackerRuntimeConfig = { appMonitorId?: string; region?: string };

let started = false;
let rum: AwsRum | undefined;
let debug = false;
// RUM の準備ができるまでの記録は、ここにためてから送る
let pending: ((client: AwsRum) => void)[] | undefined = [];
// 同じページで同じセクションを 2 回記録しないための記録。ページが変わったら消す
const sentSections = new Set<string>();

const send = (label: string, run: (client: AwsRum) => void): void => {
  if (debug) console.debug('[MLEW Tracker]', label);
  if (rum) run(rum);
  else pending?.push(run);
};

const recordPageView = (pathname: string): void => {
  send(`page view ${pathname}`, (client) => client.recordPageView(pathname));
};

const recordEvent = (
  eventType: string,
  data: Record<string, unknown>,
): void => {
  send(`${eventType} ${JSON.stringify(data)}`, (client) =>
    client.recordEvent(eventType, data),
  );
};

const recordSection = (sectionName: string): void => {
  const page = window.location.pathname;
  const key = `${page}#${sectionName}`;
  if (sentSections.has(key)) return;
  sentSections.add(key);
  recordEvent('mlew.section_view', { sectionName, page });
};

const loadConfig = async (): Promise<TrackerRuntimeConfig | undefined> => {
  try {
    const response = await fetch('/runtime-config.json', { cache: 'no-store' });
    if (!response.ok) return undefined;
    const config = (await response.json()) as {
      mlewTracker?: TrackerRuntimeConfig;
    };
    return config.mlewTracker;
  } catch {
    return undefined;
  }
};

const startRum = async (version: string): Promise<void> => {
  const config = await loadConfig();
  const appMonitorId = config?.appMonitorId?.trim();
  const region = config?.region?.trim();
  if (!appMonitorId || !region) {
    pending = undefined;
    console.warn(
      '[MLEW Tracker] /runtime-config.json に mlewTracker の設定が無いため、イベントを送信しません（デプロイ前の pnpm dev では正常です）',
    );
    return;
  }
  try {
    rum = new AwsRum(appMonitorId, version, region, {
      sessionSampleRate: 1,
      allowCookies: true,
      // ページビューは router の history の購読で送る（SPA の遷移を RUM が拾わないため）
      disableAutoPageView: true,
      // 認証情報は使わない。app monitor のリソースポリシーが署名なしの送信を許可している
      signing: false,
      eventPluginsToLoad: [],
    });
  } catch (error) {
    pending = undefined;
    console.error(
      '[MLEW Tracker] CloudWatch RUM の初期化に失敗しました',
      error,
    );
    return;
  }
  const queued = pending ?? [];
  pending = undefined;
  for (const run of queued) run(rum);
};

// data-track-section を付けた要素が画面に入ったら、ページごとに 1 回記録する
const observeSections = (): void => {
  if (
    typeof IntersectionObserver === 'undefined' ||
    typeof MutationObserver === 'undefined'
  )
    return;
  const visibility = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        visibility.unobserve(el);
        const sectionName = el.dataset.trackSection;
        if (sectionName) recordSection(sectionName);
      }
    },
    { threshold: 0.3 },
  );
  const watch = (root: ParentNode): void => {
    if (root instanceof HTMLElement && root.dataset.trackSection)
      visibility.observe(root);
    for (const el of root.querySelectorAll<HTMLElement>('[data-track-section]'))
      visibility.observe(el);
  };
  watch(document);
  new MutationObserver((mutations) => {
    for (const mutation of mutations)
      for (const node of mutation.addedNodes)
        if (node instanceof HTMLElement) watch(node);
  }).observe(document.body, { childList: true, subtree: true });
};

// 計測を始める。main.tsx で createRouter の後に 1 回呼ぶ
export const initTracker = (
  history: RouterHistoryLike,
  options: MlewTrackerOptions = {},
): void => {
  if (started) return;
  started = true;
  debug = options.debug ?? false;

  recordPageView(window.location.pathname);

  // クリックはキャプチャ段階で記録する。Link の遷移より前なので、page は遷移前のパスになる
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const el = target.closest<HTMLElement>('[data-track-name]');
      const elementName = el?.dataset.trackName;
      if (!elementName) return;
      recordEvent('mlew.click', {
        elementName,
        page: window.location.pathname,
      });
    },
    true,
  );

  // Link の遷移（PUSH / REPLACE）も、戻る・進むもここで記録する。
  // history は pushState より先に通知するので、パスは window.location ではなく引数から取る
  let lastPath = window.location.pathname;
  history.subscribe(({ location }) => {
    if (location.pathname === lastPath) return;
    lastPath = location.pathname;
    sentSections.clear();
    recordPageView(location.pathname);
  });

  observeSections();
  void startRum(options.version ?? 'v1');
};

// クリック以外の操作（ドラッグ＆ドロップ、選択の変更など）を記録する。
// クリックは data-track-name で記録するので、ここでは記録しない
export const trackAction = (
  actionName: string,
  properties?: Record<string, string | number | boolean>,
): void => {
  if (!started) return;
  recordEvent('mlew.action', {
    ...properties,
    actionName,
    page: window.location.pathname,
  });
};
