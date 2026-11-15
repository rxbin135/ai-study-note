# AI 강의노트 · 모몽가님 맞춤판

임용 1차 커리큘럼·기출 8,000문항을 다루는 AI 파이프라인을 **처음부터 끝까지** 다루는 정적 사이트입니다.
프롬프트 설계 → 문서 전처리 → RAG → 평가(eval)·자동 채점의 4개 모듈 + 부록으로 구성되어 있고,
링크 모음이 아니라 **읽는 것만으로 학습되는 교재**로 쓰였습니다.

## 구성

| 페이지 | 내용 | 레슨 |
| --- | --- | --- |
| `index.html` | 코스 홈 · 학습 경로 · 준비물 | 5 |
| `module-1.html` | 클로드 프롬프트 설계 정석 | 14 |
| `module-2.html` | 교육과정·기출 문서 전처리 & 비전 | 13 |
| `module-3.html` | 8,000문항 RAG 파이프라인 (코랩) | 16 |
| `module-4.html` | 프롬프트 평가(Eval)와 자동 채점 | 13 |
| `appendix.html` | 코랩 세팅 · 레포 로드맵 · 복붙 스니펫 | 6 |

## 기능

- 라이트/다크 모드 (시스템 설정 따름, 선택은 브라우저에 저장)
- 코드 블록 **복사** 버튼 · 언어 라벨
- 레슨별 **학습 완료 체크**와 진도 표시 (`localStorage`, 서버 전송 없음)
- 모듈별 **자가 점검 퀴즈** (정답·해설 즉시 표시)
- 모바일에서 접히는 사이드바, 인쇄용 스타일

## 로컬에서 보기

정적 파일이라 별도 빌드가 없습니다. 폴더에서 간단한 서버를 띄우면 됩니다.

```bash
python3 -m http.server 8000
# http://localhost:8000
```

`index.html`을 파일로 직접 열어도 동작하지만, 브라우저에 따라 `localStorage`가 막혀 진도가 저장되지 않을 수 있습니다.

## GitHub Pages

`.nojekyll`이 포함되어 있어 `main` 브랜치 루트를 그대로 Pages 소스로 쓸 수 있습니다.
모든 경로가 상대 경로라 `https://<user>.github.io/<repo>/` 하위에서도 그대로 동작합니다.

## 참고 자료

- [anthropics/claude-cookbooks](https://github.com/anthropics/claude-cookbooks)
- [anthropics/prompt-eng-interactive-tutorial](https://github.com/anthropics/prompt-eng-interactive-tutorial)
- [anthropics/courses](https://github.com/anthropics/courses)
- [Shubhamsaboo/awesome-llm-apps](https://github.com/Shubhamsaboo/awesome-llm-apps)

## 주의

- 코드의 모델 ID(`claude-sonnet-5-5` 등)는 예시입니다. 세대마다 바뀌므로 콘솔에서 확인해 환경변수로 주입하세요.
- 문항 원문·모의고사 지문은 내부 자료입니다. 외부 API로 전송하기 전에 공유 가능 범위를 먼저 확인하세요.
