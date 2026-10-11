# Wiremotion

[English](README.md) · [한국어](README.ko.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [Español](README.es.md)

**간단한 JSON을 README에 넣을 스키매틱 모션 GIF로 만듭니다.**

[플레이그라운드 열기](https://jeffrog-256k1.github.io/wiremotion/?lang=ko) · [상세 설정(영어)](docs/configuration.md) · [예제](examples)

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="assets/pipeline.png">
  <img src="assets/pipeline.gif" alt="Capture, Transform, Ship 노드를 신호가 따라 움직이는 다이어그램" width="1280">
</picture>

[정지 이미지 보기](assets/pipeline.png)

하프톤 배경과 정교한 배선, 움직이는 신호, 하나의 강조색으로 작업 흐름을 표현합니다. JSON을 편집하고 GIF와 정지 PNG를 저장하세요. 다이어그램은 브라우저 내부에서 처리하며 업로드·계정·API 키가 필요하지 않습니다.

## 첫 다이어그램 만들기

1. 플레이그라운드를 엽니다.
2. **파이프라인**, **분기**, **허브** 중 하나를 고르고 JSON의 이름과 설명을 편집합니다.
3. 테마를 고른 뒤 **GIF 내보내기**와 **PNG 저장**을 누릅니다.
4. **README 코드 복사**를 누르고 두 이미지를 저장소의 `assets/` 폴더에 넣습니다.

JSON이 잘못되면 마지막 유효한 미리보기를 유지하고 내보내기를 막습니다. GIF 생성은 Worker에서 실행하며 취소할 수 있습니다. 작성 내용은 자동 저장하지 않으므로 페이지를 떠나기 전에 JSON을 내려받으세요. 언어 선택만 로컬에 저장합니다.

## 다섯 언어

화면과 README는 영어·한국어·중국어 간체·일본어·스페인어로 제공합니다. 상단 언어 메뉴를 사용하거나 `?lang=ko`처럼 언어가 포함된 링크를 공유하세요. 지원 값은 `en`, `ko`, `zh-CN`, `ja`, `es`입니다. 언어를 바꿔도 입력한 JSON·테마·다이어그램은 유지됩니다. 버튼·입력 오류·접근성 이름·진행 상태를 번역했습니다. 예제 내용, 그림 속 기술 캡션, JSON 키, CLI 출력과 상세 설정 문서는 영어를 유지합니다. 다이어그램의 이름과 설명은 운영체제 글꼴이 지원하는 언어로 직접 작성할 수 있습니다.

## 세 가지 템플릿

| 템플릿                             | 용도                  | 구조                       |
| ---------------------------------- | --------------------- | -------------------------- |
| [Pipeline](examples/pipeline.json) | 빌드·배포·데이터 처리 | 순서대로 2~5개 노드        |
| [Branch](examples/branch.json)     | 입력 하나, 여러 출력  | 중심 1개 + 2~4개 말단      |
| [Hub](examples/hub.json)           | 작업 공간·서비스 연결 | 중심 1개 + 2~5개 주변 노드 |

<details>
<summary>분기·허브 모션 보기</summary>

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="assets/branch.png">
  <img src="assets/branch.gif" alt="하나의 콘텐츠가 글·영상·데모로 나뉘는 가상 예제" width="1280">
</picture>

[정지 이미지 보기](assets/branch.png)

<picture>
  <source media="(prefers-reduced-motion: reduce)" srcset="assets/hub.png">
  <img src="assets/hub.gif" alt="메모·파일·작업·사람을 잇는 밝은 테마의 허브" width="1280">
</picture>

[정지 이미지 보기](assets/hub.png)

</details>

## 로컬 실행

**Node.js 22.12 이상**과 npm이 필요합니다. Python·FFmpeg·외부 글꼴·유료 서비스는 필요하지 않습니다.

```sh
git clone https://github.com/jeffrog-256k1/wiremotion.git
cd wiremotion
npm ci
npm run dev
```

**http://127.0.0.1:4317**을 엽니다. 개발 서버는 루프백 주소에만 바인딩합니다. Canvas·Web Workers·OffscreenCanvas 지원 브라우저가 필요하며 Chromium을 기준으로 검증합니다. 사이트와 파일을 처음 불러올 때 네트워크를 사용하지만 다이어그램 처리·내보내기는 로컬에서 수행합니다.

### 파일에서 렌더링

```sh
npx playwright install chromium
npm run render -- examples/pipeline.json --out renders/my-flow
```

앱을 빌드한 다음 임시 루프백 서버로 렌더링해 `my-flow.gif`, `my-flow.png`, `my-flow.md`를 만듭니다. 기존 파일은 `--force`를 명시하지 않으면 덮어쓰지 않습니다. Markdown 경로는 이미지 파일 기준이므로 README로 옮길 때 조정하세요. Linux에서 시스템 의존성이 필요하면 `npx playwright install --with-deps chromium`을 사용합니다. 설치된 Chrome을 쓰려면 `WIREMOTION_BROWSER_CHANNEL=chrome` 환경변수를 지정할 수 있습니다. 아직 npm 패키지는 배포하지 않았으며 위 명령은 복제한 저장소에서 실행합니다.

## 입력은 JSON

```json
{
  "version": 1,
  "title": "작은 아이디어를 제품으로.",
  "layout": "pipeline",
  "nodes": [
    {
      "id": "idea",
      "label": "아이디어"
    },
    {
      "id": "ship",
      "label": "공개"
    }
  ],
  "edges": [
    {
      "from": "idea",
      "to": "ship"
    }
  ]
}
```

선택 필드는 `theme`, `accent`, `subtitle`, `duration`, `width`, `seed`, `sequence`입니다. `sequence`에는 각 노드 ID를 한 번씩 넣습니다. 연결은 노드 수보다 하나 적어야 하며, 파이프라인은 순서대로, 분기·허브는 첫 노드와 나머지를 연결합니다. 입력은 최대 16 KiB, 제목은 52자, 부제는 96자, 노드 이름은 26자, 설명은 42자, 연결 이름은 16자입니다. 필드의 전체 규칙은 [상세 설정](docs/configuration.md)(영어)에 있습니다.

## 지원 범위

- 고정 레이아웃 3종과 어두운·밝은 테마, 6자리 16진수 강조색.
- 4초 또는 6초 반복, 15 fps. 960×540 또는 1280×720 출력.
- GIF·PNG·JSON·README 코드. 출력 이미지에 JavaScript·로고·필수 워터마크가 없습니다.
- 모션 감소 설정에서는 미리보기가 정지 상태로 시작합니다. README 코드는 정지 대체 이미지를 포함합니다.
- 같은 입력·seed·브라우저·글꼴에서는 같은 프레임을 생성합니다. 운영체제별 글꼴 차이로 픽셀까지 동일한 결과는 보장하지 않습니다.
- 긴 이름은 줄여 그린 뒤 필요하면 말줄임 처리합니다. 모바일 가독성을 위해 짧게 작성하세요.

임의 그래프 자동 배치·Mermaid 문법·자유 드로잉 편집기는 제공하지 않습니다. 짧고 일정한 스타일의 모션을 만들어 이미지 파일로 저장하는 도구입니다.

## 개발·검증

```sh
npm test
npm run build
npx playwright install chromium
npm run test:browser
```

입력 제한·연결 구조·레이아웃·재현 가능한 프레임·GIF 프레임 수와 길이·내보내기·취소·모션 감소·모바일 넘침·다국어를 검증합니다. 로컬 앱의 외부 요청 여부도 확인하며 가상 예제만 사용합니다.

미리보기와 내보내기는 같은 `src/renderer.ts`를 사용합니다. GIF 인코딩은 gifenc, 정적 빌드는 Vite, CLI와 브라우저 검증은 Playwright를 사용합니다.

[기여 안내](CONTRIBUTING.md)와 [보안 안내](SECURITY.md)는 영어로 제공됩니다. 작은 예제 JSON과 함께 버그나 번역 개선을 제안해 주세요.

## 라이선스

MIT. [LICENSE](LICENSE)와 [외부 라이선스 고지](THIRD_PARTY_NOTICES.md)를 확인하세요. 출력 이미지는 개인·상업 용도로 사용할 수 있습니다. 공개할 다이어그램에는 비공개 정보를 넣지 마세요.

[jeffrog-256k1](https://github.com/jeffrog-256k1) · [leejungjae.app](https://leejungjae.app)
