export const languages = ['en', 'ko', 'zh-CN', 'ja', 'es'] as const;
export type Language = (typeof languages)[number];
type Translations = readonly [string, string, string, string, string];

// English / Korean / Simplified Chinese / Japanese / Spanish.
const messages = {
  pageTitle: [
    'Wiremotion — Make the connection visible.',
    'Wiremotion — 연결을 움직이는 그림으로.',
    'Wiremotion — 让连接清晰可见。',
    'Wiremotion — つながりを、見える形に。',
    'Wiremotion — Haz visible la conexión.',
  ],
  description: [
    'Turn small JSON diagrams into schematic motion GIFs for your README. Processed in your browser.',
    '간단한 JSON을 README용 스키매틱 모션 GIF로 만듭니다. 브라우저 안에서 처리합니다.',
    '将简单的 JSON 图表转换为 README 动态示意图 GIF。在浏览器中处理。',
    '小さな JSON から README 用の動く模式図 GIF を作成。処理はブラウザー内で完結します。',
    'Convierte diagramas JSON en GIF animados para tu README. Procesamiento en tu navegador.',
  ],
  home: [
    'Wiremotion home',
    'Wiremotion 홈',
    'Wiremotion 首页',
    'Wiremotion ホーム',
    'Inicio de Wiremotion',
  ],
  resources: ['Resources', '자료', '资源', 'リソース', 'Recursos'],
  language: ['Language', '언어', '语言', '言語', 'Idioma'],
  docs: ['Documentation ↗', '문서 ↗', '文档 ↗', 'ドキュメント ↗', 'Documentación ↗'],
  eyebrow: [
    'DIAGRAMS, IN MOTION.',
    '움직이는 다이어그램.',
    '让图表动起来。',
    '図に、動きを。',
    'DIAGRAMAS EN MOVIMIENTO.',
  ],
  headline: ['Make the connection', '연결을 그려내고,', '让连接', 'つながりを、', 'Haz visible'],
  headlineAccent: ['visible.', '움직이세요.', '清晰可见。', '見える形に。', 'la conexión.'],
  intro: [
    'Small JSON. Moving signals. A diagram worth putting in your README.',
    '간단한 JSON, 움직이는 신호. README에 담고 싶은 다이어그램을 만드세요.',
    '简单的 JSON，流动的信号。为你的 README 制作一张动态图。',
    '小さな JSON、流れる信号。README に載せたくなる図を作ろう。',
    'Un poco de JSON. Señales en movimiento. Un diagrama para tu README.',
  ],
  noAccount: ['NO ACCOUNT', '가입 없이', '无需账号', '登録不要', 'SIN CUENTA'],
  localExport: ['LOCAL EXPORT', '로컬 내보내기', '本地导出', 'ローカル出力', 'EXPORTACIÓN LOCAL'],
  source: ['01 / SOURCE', '01 / 소스', '01 / 源码', '01 / ソース', '01 / CÓDIGO'],
  startWith: ['Start with', '템플릿', '模板', 'テンプレート', 'Plantilla'],
  pipeline: [
    '01 — Pipeline',
    '01 — 파이프라인',
    '01 — 流水线',
    '01 — パイプライン',
    '01 — Secuencia',
  ],
  branch: ['02 — Branch', '02 — 분기', '02 — 分支', '02 — 分岐', '02 — Ramificación'],
  hub: ['03 — Hub', '03 — 허브', '03 — 中心', '03 — ハブ', '03 — Centro'],
  editor: ['Diagram JSON', '다이어그램 JSON', '图表 JSON', '図の JSON', 'JSON del diagrama'],
  format: ['Format JSON', 'JSON 정리', '格式化 JSON', 'JSON を整形', 'Formatear JSON'],
  saveJson: ['Save JSON ↓', 'JSON 저장 ↓', '保存 JSON ↓', 'JSON を保存 ↓', 'Guardar JSON ↓'],
  preview: [
    '02 / LIVE CANVAS',
    '02 / 실시간 미리보기',
    '02 / 实时预览',
    '02 / プレビュー',
    '02 / VISTA PREVIA',
  ],
  theme: ['Diagram theme', '다이어그램 테마', '图表主题', '図のテーマ', 'Tema del diagrama'],
  dark: ['Dark', '어둡게', '深色', 'ダーク', 'Oscuro'],
  light: ['Light', '밝게', '浅色', 'ライト', 'Claro'],
  ready: [
    'READY FOR YOUR README',
    'README에 바로 사용',
    '为 README 准备就绪',
    'README にそのまま',
    'LISTO PARA TU README',
  ],
  exportHeading: [
    'Draw it. Loop it. Ship it.',
    '그리고, 움직이고, 공유하세요.',
    '绘制、循环、分享。',
    '描いて、動かして、届けよう。',
    'Dibuja. Anima. Comparte.',
  ],
  exportNote: [
    'GIF + a still frame. Everything stays in your browser.',
    'GIF와 정지 이미지. 모두 브라우저 안에서 처리합니다.',
    'GIF 与静态图片。一切都在浏览器内处理。',
    'GIF と静止画。すべてブラウザー内で処理します。',
    'GIF y una imagen fija. Todo se procesa en tu navegador.',
  ],
  exportGif: ['Export GIF ↗', 'GIF 내보내기 ↗', '导出 GIF ↗', 'GIF を出力 ↗', 'Exportar GIF ↗'],
  savePng: ['Save PNG ↓', 'PNG 저장 ↓', '保存 PNG ↓', 'PNG を保存 ↓', 'Guardar PNG ↓'],
  cancel: ['Cancel', '취소', '取消', 'キャンセル', 'Cancelar'],
  embedNote: [
    'Embed motion with a still-image fallback.',
    '정지 이미지 대체 옵션과 함께 삽입하세요.',
    '嵌入动画，并提供静态图片替代。',
    '静止画の代替も用意して埋め込もう。',
    'Inserta la animación con una alternativa estática.',
  ],
  copy: [
    'Copy README snippet ↗',
    'README 코드 복사 ↗',
    '复制 README 代码 ↗',
    'README コードをコピー ↗',
    'Copiar código README ↗',
  ],
  how: ['How it works', '사용 방법', '使用方法', '使い方', 'Cómo funciona'],
  step1: ['01 / DEFINE', '01 / 정의', '01 / 定义', '01 / 定義', '01 / DEFINE'],
  step1Title: [
    'Give your idea a shape.',
    '아이디어를 형태로.',
    '让想法成形。',
    'アイデアを形に。',
    'Dale forma a tu idea.',
  ],
  step1Body: [
    'Pick a template. Edit labels, connections, and the order of the signal.',
    '템플릿을 고르고 이름·연결·신호 순서를 편집하세요.',
    '选择模板，编辑标签、连接和信号顺序。',
    'テンプレートを選び、ラベル・接続・信号の順番を編集します。',
    'Elige una plantilla. Edita etiquetas, conexiones y el orden de la señal.',
  ],
  step2: [
    '02 / MAKE IT YOURS',
    '02 / 내 스타일로',
    '02 / 个性化',
    '02 / 自分らしく',
    '02 / PERSONALIZA',
  ],
  step2Title: [
    'A little structure. A lot of character.',
    '간결한 구조, 뚜렷한 개성.',
    '简洁的结构，鲜明的个性。',
    'シンプルな構造、豊かな個性。',
    'Poca estructura. Mucho carácter.',
  ],
  step2Body: [
    'Halftone fields, precise wiring, and a single accent. Dark or light.',
    '하프톤 배경, 정교한 배선, 하나의 강조색. 어두운 테마와 밝은 테마.',
    '半色调背景、精确连线与一种强调色。支持深浅两种主题。',
    'ハーフトーン、精密な配線、ひとつの差し色。ダークとライト。',
    'Semitonos, conexiones precisas y un color de acento. Tema oscuro o claro.',
  ],
  step3: [
    '03 / TAKE IT WITH YOU',
    '03 / 내 파일로',
    '03 / 带走作品',
    '03 / 持ち出そう',
    '03 / LLÉVATELO',
  ],
  step3Title: [
    'Your files. Your canvas.',
    '내 파일, 내 캔버스.',
    '你的文件，你的画布。',
    'あなたのファイル、あなたのキャンバス。',
    'Tus archivos. Tu lienzo.',
  ],
  step3Body: [
    'No uploads, API keys, or watermarked exports. Open source, under MIT.',
    '업로드·API 키·워터마크 없이. MIT 라이선스의 오픈소스입니다.',
    '无需上传、API 密钥或水印。基于 MIT 许可证开源。',
    'アップロード・API キー・透かしは不要。MIT ライセンスのオープンソースです。',
    'Sin subidas, claves de API ni marcas de agua. Código abierto con licencia MIT.',
  ],
  author: [
    'A small tool by jeffrog-256k1 ↗',
    'jeffrog-256k1이 만든 작은 도구 ↗',
    'jeffrog-256k1 制作的小工具 ↗',
    'jeffrog-256k1 の小さなツール ↗',
    'Una pequeña herramienta de jeffrog-256k1 ↗',
  ],
  feedback: ['Feedback ↗', '의견 보내기 ↗', '反馈 ↗', 'フィードバック ↗', 'Comentarios ↗'],
  valid: [
    '● Valid diagram',
    '● 유효한 다이어그램',
    '● 图表有效',
    '● 有効な図',
    '● Diagrama válido',
  ],
  lastValid: [
    'Last valid preview shown',
    '마지막 유효한 미리보기 표시 중',
    '显示上次有效的预览',
    '最後に有効だったプレビューを表示中',
    'Se muestra la última vista válida',
  ],
  diagramMeta: [
    '{nodes} NODES · {edges} CONNECTIONS',
    '노드 {nodes}개 · 연결 {edges}개',
    '{nodes} 个节点 · {edges} 条连接',
    '{nodes} ノード · {edges} 接続',
    '{nodes} NODOS · {edges} CONEXIONES',
  ],
  pause: ['Ⅱ Pause', 'Ⅱ 일시정지', 'Ⅱ 暂停', 'Ⅱ 一時停止', 'Ⅱ Pausar'],
  play: ['▷ Play', '▷ 재생', '▷ 播放', '▷ 再生', '▷ Reproducir'],
  pauseAria: [
    'Pause animation',
    '애니메이션 일시정지',
    '暂停动画',
    'アニメーションを一時停止',
    'Pausar animación',
  ],
  playAria: [
    'Play animation',
    '애니메이션 재생',
    '播放动画',
    'アニメーションを再生',
    'Reproducir animación',
  ],
  pngSaved: [
    'Still frame saved. Use it as your reduced-motion fallback.',
    '정지 이미지를 저장했습니다. 모션 감소용 대체 이미지로 사용하세요.',
    '静态图片已保存，可用作减少动态效果时的替代图片。',
    '静止画を保存しました。動きを減らす設定向けの代替画像に使えます。',
    'Imagen fija guardada. Úsala como alternativa con movimiento reducido.',
  ],
  copied: [
    'README snippet copied. Save both exports in your repository’s assets folder.',
    'README 코드를 복사했습니다. 두 이미지를 저장소의 assets 폴더에 넣으세요.',
    'README 代码已复制。请将两张图片放入仓库的 assets 文件夹。',
    'README コードをコピーしました。2つの画像をリポジトリの assets フォルダーに保存してください。',
    'Código README copiado. Guarda ambas imágenes en la carpeta assets del repositorio.',
  ],
  snippetSaved: [
    'Snippet saved as a Markdown file.',
    '코드를 Markdown 파일로 저장했습니다.',
    '代码已保存为 Markdown 文件。',
    'コードを Markdown ファイルとして保存しました。',
    'Código guardado como archivo Markdown.',
  ],
  rendering: [
    'Rendering {percent}%',
    '렌더링 {percent}%',
    '正在渲染 {percent}%',
    '描画中 {percent}%',
    'Renderizando {percent}%',
  ],
  gifSaved: [
    'GIF saved · {size} MiB · {duration}s loop. Save PNG for a still fallback.',
    'GIF 저장 완료 · {size} MiB · {duration}초 반복. 정지 이미지용 PNG도 저장하세요.',
    'GIF 已保存 · {size} MiB · {duration} 秒循环。请同时保存 PNG 作为静态替代。',
    'GIF を保存 · {size} MiB · {duration} 秒ループ。代替の静止画用に PNG も保存してください。',
    'GIF guardado · {size} MiB · bucle de {duration} s. Guarda un PNG como alternativa estática.',
  ],
  cancelled: [
    'Export cancelled.',
    '내보내기를 취소했습니다.',
    '已取消导出。',
    '出力をキャンセルしました。',
    'Exportación cancelada.',
  ],
  exportFailed: [
    'Export failed. Use a current browser with OffscreenCanvas support.',
    '내보내기에 실패했습니다. OffscreenCanvas를 지원하는 최신 브라우저를 사용하세요.',
    '导出失败。请使用支持 OffscreenCanvas 的新版浏览器。',
    '出力に失敗しました。OffscreenCanvas 対応の最新ブラウザーを使ってください。',
    'Error al exportar. Usa un navegador actualizado compatible con OffscreenCanvas.',
  ],
  unknownError: [
    'Could not read this diagram. Check the JSON fields.',
    '다이어그램을 읽지 못했습니다. JSON 필드를 확인하세요.',
    '无法读取图表。请检查 JSON 字段。',
    '図を読み込めません。JSON のフィールドを確認してください。',
    'No se pudo leer el diagrama. Revisa los campos JSON.',
  ],
  object: [
    '{path} must be an object.',
    '{path}는 객체여야 합니다.',
    '{path} 必须是对象。',
    '{path} はオブジェクトにしてください。',
    '{path} debe ser un objeto.',
  ],
  unknownField: [
    '{path}: unknown field "{key}".',
    '{path}: 알 수 없는 필드 "{key}".',
    '{path}：未知字段“{key}”。',
    '{path}: 未知のフィールド「{key}」。',
    '{path}: campo desconocido "{key}".',
  ],
  text: [
    '{path} must be {min}–{max} characters on one line.',
    '{path}는 한 줄의 {min}~{max}자여야 합니다.',
    '{path} 必须为单行，长度为 {min}–{max} 个字符。',
    '{path} は1行、{min}〜{max}文字にしてください。',
    '{path} debe tener entre {min} y {max} caracteres en una sola línea.',
  ],
  choice: [
    '{path}: allowed values: {options}.',
    '{path}: 허용 값: {options}.',
    '{path}：允许的值：{options}。',
    '{path}: 指定できる値: {options}。',
    '{path}: valores permitidos: {options}.',
  ],
  inputSize: [
    'JSON must be 16 KiB or smaller.',
    'JSON은 16 KiB 이하여야 합니다.',
    'JSON 不能超过 16 KiB。',
    'JSON は 16 KiB 以下にしてください。',
    'El JSON debe ocupar como máximo 16 KiB.',
  ],
  invalidJson: [
    'Invalid JSON. Check commas, quotes, and brackets.',
    'JSON 형식 오류입니다. 쉼표·따옴표·괄호를 확인하세요.',
    'JSON 格式无效。请检查逗号、引号和括号。',
    'JSON の形式が無効です。カンマ・引用符・括弧を確認してください。',
    'JSON no válido. Revisa comas, comillas y corchetes.',
  ],
  version: [
    'version must be 1.',
    'version은 1이어야 합니다.',
    'version 必须为 1。',
    'version は 1 にしてください。',
    'version debe ser 1.',
  ],
  accent: [
    'accent must be a six-digit hex color, such as #ff5938.',
    'accent는 #ff5938처럼 6자리 16진수 색상이어야 합니다.',
    'accent 必须是六位十六进制颜色，例如 #ff5938。',
    'accent は #ff5938 のような6桁の16進数カラーにしてください。',
    'accent debe ser un color hexadecimal de seis dígitos, como #ff5938.',
  ],
  seed: [
    'seed must be an integer from 0 to 2147483647.',
    'seed는 0~2147483647의 정수여야 합니다.',
    'seed 必须是 0–2147483647 的整数。',
    'seed は 0〜2147483647 の整数にしてください。',
    'seed debe ser un entero entre 0 y 2147483647.',
  ],
  nodeCount: [
    '{layout} requires {min}–{max} nodes.',
    '{layout}에는 노드 {min}~{max}개가 필요합니다.',
    '{layout} 需要 {min}–{max} 个节点。',
    '{layout} には {min}〜{max} 個のノードが必要です。',
    '{layout} necesita entre {min} y {max} nodos.',
  ],
  nodeId: [
    'Node IDs use letters, numbers, underscores, and hyphens.',
    '노드 ID에는 영문자·숫자·밑줄·하이픈만 사용하세요.',
    '节点 ID 只能使用英文字母、数字、下划线和连字符。',
    'ノード ID には英数字・アンダースコア・ハイフンを使ってください。',
    'Los ID de nodo admiten letras ASCII, números, guiones y guiones bajos.',
  ],
  uniqueId: [
    'Node IDs must be unique.',
    '노드 ID는 중복될 수 없습니다.',
    '节点 ID 不能重复。',
    'ノード ID は重複できません。',
    'Los ID de nodo deben ser únicos.',
  ],
  edgeCount: [
    'Provide exactly one edge per step or spoke (nodes minus one).',
    '각 단계·분기마다 연결 하나가 필요합니다(노드 수 - 1개).',
    '每个步骤或分支必须有一条连接（节点数减一）。',
    '各ステップ・枝につき1本の接続が必要です（ノード数 - 1本）。',
    'Usa una conexión por paso o rama (número de nodos menos uno).',
  ],
  edgeRef: [
    'Each edge must connect two different existing node IDs.',
    '연결은 서로 다른 기존 노드 ID 두 개를 이어야 합니다.',
    '每条连接必须连接两个不同的现有节点 ID。',
    '接続は既存の異なる2つのノード ID を指定してください。',
    'Cada conexión debe unir dos ID de nodo existentes y distintos.',
  ],
  pipelineEdge: [
    'Pipeline edges follow the node order, one step at a time.',
    '파이프라인 연결은 노드 순서대로 한 단계씩 이어야 합니다.',
    '流水线连接必须按节点顺序逐步连接。',
    'パイプラインはノードの順番に1ステップずつ接続してください。',
    'Las conexiones de secuencia siguen el orden de los nodos, paso a paso.',
  ],
  hubEdge: [
    'Branch and hub edges connect the first node to each other node.',
    '분기·허브에서는 첫 노드를 나머지 노드 각각에 연결하세요.',
    '分支和中心布局中，第一个节点必须与其余各节点连接。',
    '分岐・ハブでは最初のノードと他の各ノードを接続してください。',
    'En ramificación y centro, conecta el primer nodo con cada uno de los demás.',
  ],
  duplicateEdge: [
    'Duplicate connection.',
    '연결이 중복됩니다.',
    '连接重复。',
    '接続が重複しています。',
    'Conexión duplicada.',
  ],
  sequence: [
    'sequence must contain each node ID exactly once.',
    'sequence에는 각 노드 ID를 정확히 한 번씩 넣으세요.',
    'sequence 必须包含每个节点 ID，且各出现一次。',
    'sequence には各ノード ID を1回ずつ含めてください。',
    'sequence debe incluir cada ID de nodo exactamente una vez.',
  ],
} as const satisfies Record<string, Translations>;

export type MessageKey = keyof typeof messages;
export type MessageParams = Record<string, string | number>;
export function isLanguage(value: unknown): value is Language {
  return languages.includes(value as Language);
}
export function translate(language: Language, key: MessageKey, params: MessageParams = {}): string {
  return messages[key][languages.indexOf(language)].replace(/\{(\w+)\}/g, (match, name) =>
    String(params[name] ?? match),
  );
}
export function initialLanguage(): Language {
  const requested = new URL(location.href).searchParams.get('lang');
  if (isLanguage(requested)) return requested;
  try {
    const saved = localStorage.getItem('wiremotion-language');
    if (isLanguage(saved)) return saved;
  } catch {
    /* Storage is optional; diagram data is never persisted. */
  }
  return 'en';
}
export function applyLanguage(language: Language) {
  document.documentElement.lang = language;
  document.title = translate(language, 'pageTitle');
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', translate(language, 'description'));
  for (const element of document.querySelectorAll<HTMLElement>('[data-i18n]')) {
    element.textContent = translate(language, element.dataset.i18n as MessageKey);
  }
  for (const element of document.querySelectorAll<HTMLElement>('[data-i18n-aria]')) {
    element.setAttribute('aria-label', translate(language, element.dataset.i18nAria as MessageKey));
  }
  const docs = document.getElementById('docs') as HTMLAnchorElement;
  docs.href = `https://github.com/jeffrog-256k1/wiremotion/blob/main/README${language === 'en' ? '' : '.' + language}.md`;
}
