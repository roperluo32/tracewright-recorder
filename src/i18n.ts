export const supportedLocales = ['en', 'zh_CN', 'zh_TW', 'ja', 'ko', 'de', 'fr', 'es', 'pt_BR'] as const;
export type AppLocale = (typeof supportedLocales)[number];

type UiKey =
  | 'eyebrow' | 'subcopy' | 'start' | 'pause' | 'resume' | 'stop' | 'copy' | 'download'
  | 'clear' | 'delete' | 'empty' | 'recentRecordings' | 'steps' | 'codePreview'
  | 'cannotFindTab' | 'internalPage' | 'recordingFailed' | 'copied' | 'noSteps'
  | 'optionsTitle' | 'optionsKicker' | 'optionsBody' | 'clearHistory' | 'savedRecordings'
  | 'language' | 'testIdAttribute' | 'maxHistoryItems' | 'includeUrlAssertions' | 'saveSettings'
  | 'settingsSaved';

type Dict = Record<UiKey, string>;

export const localeNames: Record<AppLocale, string> = {
  en: 'English',
  zh_CN: '简体中文',
  zh_TW: '繁體中文',
  ja: '日本語',
  ko: '한국어',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  pt_BR: 'Português',
};

const en: Dict = {
  eyebrow: 'Local Playwright recorder',
  subcopy: 'Record a browser flow and export a clean Playwright test. Data stays in your browser.',
  start: 'Start recording',
  pause: 'Pause',
  resume: 'Resume',
  stop: 'Stop & save',
  copy: 'Copy code',
  download: 'Download .spec.ts',
  clear: 'Clear',
  delete: 'Delete',
  empty: 'Open a web page, start recording, then click and type through the flow you want to test.',
  recentRecordings: 'Recent recordings',
  steps: 'Steps',
  codePreview: 'Code preview',
  cannotFindTab: 'Could not find the current tab.',
  internalPage: 'Browser internal pages cannot be recorded. Please switch to a regular web page.',
  recordingFailed: 'Recording failed. Please try again.',
  copied: 'Copied to clipboard.',
  noSteps: 'No steps recorded yet.',
  optionsTitle: 'Options & Local Data',
  optionsKicker: 'Tracewright Recorder',
  optionsBody: 'Tracewright records only after you start it. Recordings are stored in browser storage.',
  clearHistory: 'Clear recording history',
  savedRecordings: 'Saved recordings',
  language: 'Language',
  testIdAttribute: 'Test id attribute',
  maxHistoryItems: 'Max history items',
  includeUrlAssertions: 'Include URL assertions',
  saveSettings: 'Save settings',
  settingsSaved: 'Settings saved.',
};

const zh_CN: Dict = {
  ...en,
  eyebrow: '本地 Playwright 录制器',
  subcopy: '录制浏览器操作流程，并导出清晰的 Playwright 测试代码。数据只保存在你的浏览器中。',
  start: '开始录制',
  pause: '暂停',
  resume: '继续',
  stop: '停止并保存',
  copy: '复制代码',
  download: '下载 .spec.ts',
  clear: '清空',
  delete: '删除',
  empty: '打开一个网页，开始录制，然后完成你想自动化测试的点击和输入流程。',
  recentRecordings: '最近录制',
  steps: '步骤',
  codePreview: '代码预览',
  cannotFindTab: '找不到当前标签页。',
  internalPage: '浏览器内部页面无法录制，请切换到普通网页。',
  recordingFailed: '录制失败，请重试。',
  copied: '已复制到剪贴板。',
  noSteps: '还没有录制步骤。',
  optionsTitle: '设置与本地数据',
  optionsBody: 'Tracewright 只会在你主动开始后录制。录制历史保存在浏览器本地 storage 中。',
  clearHistory: '清除录制历史',
  savedRecordings: '已保存录制',
  language: '语言',
  testIdAttribute: 'Test id 属性',
  maxHistoryItems: '历史保留数量',
  includeUrlAssertions: '包含 URL 断言',
  saveSettings: '保存设置',
  settingsSaved: '设置已保存。',
};
const zh_TW: Dict = { ...zh_CN, subcopy: '錄製瀏覽器操作流程，並匯出清晰的 Playwright 測試程式碼。資料只保存在你的瀏覽器中。', start: '開始錄製', stop: '停止並儲存', recentRecordings: '最近錄製', savedRecordings: '已儲存錄製', settingsSaved: '設定已儲存。' };
const ja: Dict = { ...en, start: '録画を開始', pause: '一時停止', resume: '再開', stop: '停止して保存', copy: 'コードをコピー', download: '.spec.ts をダウンロード', clear: 'クリア', recentRecordings: '最近の録画', steps: 'ステップ' };
const ko: Dict = { ...en, start: '기록 시작', pause: '일시 중지', resume: '재개', stop: '중지 및 저장', copy: '코드 복사', download: '.spec.ts 다운로드', clear: '지우기', recentRecordings: '최근 기록', steps: '단계' };
const de: Dict = { ...en, start: 'Aufzeichnung starten', pause: 'Pause', resume: 'Fortsetzen', stop: 'Stoppen & speichern', copy: 'Code kopieren', download: '.spec.ts herunterladen', clear: 'Leeren', recentRecordings: 'Letzte Aufzeichnungen', steps: 'Schritte' };
const fr: Dict = { ...en, start: 'Démarrer', pause: 'Pause', resume: 'Reprendre', stop: 'Arrêter et enregistrer', copy: 'Copier le code', download: 'Télécharger .spec.ts', clear: 'Effacer', recentRecordings: 'Enregistrements récents', steps: 'Étapes' };
const es: Dict = { ...en, start: 'Iniciar grabación', pause: 'Pausar', resume: 'Reanudar', stop: 'Detener y guardar', copy: 'Copiar código', download: 'Descargar .spec.ts', clear: 'Borrar', recentRecordings: 'Grabaciones recientes', steps: 'Pasos' };
const pt_BR: Dict = { ...en, start: 'Iniciar gravação', pause: 'Pausar', resume: 'Retomar', stop: 'Parar e salvar', copy: 'Copiar código', download: 'Baixar .spec.ts', clear: 'Limpar', recentRecordings: 'Gravações recentes', steps: 'Etapas' };

const dictionaries: Record<AppLocale, Dict> = { en, zh_CN, zh_TW, ja, ko, de, fr, es, pt_BR };

export function normalizeLocale(value?: string | null): AppLocale {
  const raw = (value || '').replace('-', '_');
  if (supportedLocales.includes(raw as AppLocale)) return raw as AppLocale;
  const lower = raw.toLowerCase();
  if (lower.startsWith('zh')) return lower.includes('tw') || lower.includes('hk') ? 'zh_TW' : 'zh_CN';
  if (lower.startsWith('ja')) return 'ja';
  if (lower.startsWith('ko')) return 'ko';
  if (lower.startsWith('de')) return 'de';
  if (lower.startsWith('fr')) return 'fr';
  if (lower.startsWith('es')) return 'es';
  if (lower.startsWith('pt')) return 'pt_BR';
  return 'en';
}

export function t(locale: AppLocale, key: UiKey): string {
  return dictionaries[locale]?.[key] ?? en[key];
}
