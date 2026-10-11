# Wiremotion

**작은 JSON을 README에 넣을 스키매틱 모션 GIF로 만듭니다.**

[플레이그라운드](https://jeffrog-256k1.github.io/wiremotion/) · [English](README.md) · [설정 규격](docs/configuration.md)

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="assets/pipeline.png">
  <img src="assets/pipeline.gif" alt="Capture, Transform, Ship을 도선과 이동 신호로 연결한 모션 그래픽" width="1280">
</picture>

점 무늬, 도선, 이동 신호와 강조 색 하나로 작업 흐름을 표현합니다. 브라우저에서 JSON을 수정하고 GIF·PNG를 내려받으세요. 입력 파일을 서버에 업로드하지 않으며 계정이나 API 키도 필요하지 않습니다.

## 바로 사용하기

1. [플레이그라운드](https://jeffrog-256k1.github.io/wiremotion/)에서 Pipeline·Branch·Hub 중 하나를 선택합니다.
2. JSON의 `label`, `detail`, `title` 등을 수정합니다.
3. `Export GIF`, `Save PNG`로 이미지를 저장합니다.
4. `Copy README snippet`으로 모션 감소 설정용 정지 이미지를 포함한 삽입 코드를 복사합니다.

작업 내용은 자동 저장하지 않습니다. 페이지를 닫기 전에 `Save JSON`으로 저장하세요. 잘못된 입력은 오류를 표시하며 마지막 정상 미리보기를 유지합니다. GIF 생성 중에는 취소할 수 있습니다.

## 로컬 실행

Node.js 22.12 이상과 npm이 필요합니다. Python이나 FFmpeg는 필요하지 않습니다.

```sh
git clone https://github.com/jeffrog-256k1/wiremotion.git
cd wiremotion
npm ci
npm run dev
```

`http://127.0.0.1:4317`에서 접속합니다. 사이트 파일을 처음 내려받는 통신을 제외하면 미리보기와 이미지 처리는 브라우저 내부에서 수행합니다. 최신 Chromium을 기본 검증 대상으로 합니다.

파일에서 GIF·PNG·Markdown을 만들려면:

```sh
npx playwright install chromium
npm run render -- examples/pipeline.json --out renders/my-flow
```

기존 출력 파일은 `--force`를 명시해야 덮어씁니다. npm 패키지로 배포한 상태는 아니며 저장소를 복제한 뒤 실행하는 명령입니다.

## 지원 범위

- 파이프라인 2–5개 노드, 분기 중심 1개와 잎 2–4개, 허브 중심 1개와 주변 2–5개.
- 어두운/밝은 테마, 강조 색, 노드 강조 순서와 seed.
- 4초/6초, 15fps, 960×540 또는 1280×720.
- GIF와 정지 PNG, JSON 저장, README 삽입 코드.
- 임의 그래프 자동 배치, Mermaid 문법, 자유 편집기, AI 생성은 지원하지 않습니다.

노드 이름은 짧게 작성하면 작은 화면에서도 읽기 좋습니다. 같은 환경에서는 같은 입력으로 같은 프레임을 만들지만, 운영체제별 글꼴 차이까지 동일하게 만들지는 않습니다.

구현 구조·검증·기여 방법은 [영문 README](README.md#development)에 있습니다. MIT 라이선스로 공개하며, 내보낸 이미지에는 Wiremotion 로고나 필수 저작자 표시를 넣지 않습니다.
