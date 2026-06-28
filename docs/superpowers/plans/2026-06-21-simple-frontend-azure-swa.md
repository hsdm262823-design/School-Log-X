# Simple Frontend + Azure SWA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** React 기반 최소 단일 페이지(제목/설명/상태 문구)를 만들고 Azure Static Web Apps에 GitHub Actions 자동 배포로 올린다.

**Architecture:** Vite + React 단일 앱을 루트에 생성하고, `App`에서 정적 텍스트만 렌더링한다. 배포는 Azure Static Web Apps 리소스 + GitHub Actions 워크플로로 자동화한다. 런타임 의존성(백엔드/API)은 추가하지 않는다.

**Tech Stack:** React, Vite, Vitest, Testing Library, GitHub Actions, Azure Static Web Apps

---

## 파일 구조/책임

- `package.json` — 스크립트(`dev`, `build`, `test`) 및 의존성 관리
- `vite.config.js` — Vite + 테스트 환경(jsdom) 설정
- `index.html` — 앱 마운트 포인트
- `src/main.jsx` — React 앱 엔트리포인트
- `src/App.jsx` — 제목/설명/상태 문구 렌더링
- `src/App.test.jsx` — UI 요구사항(텍스트 노출) 검증
- `.github/workflows/azure-static-web-apps.yml` — main 푸시 시 SWA 자동 배포
- `README.md` — 실행/배포/필수 Secret 안내

### Task 1: Vite React 앱 골격 만들기

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx`

- [ ] **Step 1: Vite React 템플릿 생성**

```bash
npm create vite@latest . -- --template react
```

- [ ] **Step 2: 의존성 설치**

```bash
npm install
```

- [ ] **Step 3: 기본 실행/빌드 스크립트 확인**

Run: `npm run build`  
Expected: `dist` 생성 및 build success

- [ ] **Step 4: 골격 커밋**

```bash
git add package.json package-lock.json vite.config.js index.html src/main.jsx src/App.jsx
git commit -m "chore: bootstrap minimal React frontend with Vite"
```

### Task 2: TDD로 요구 UI(제목/설명/상태) 구현

**Files:**
- Modify: `package.json`
- Modify: `vite.config.js`
- Modify: `src/App.jsx`
- Create: `src/App.test.jsx`
- Create: `src/test/setup.js`

- [ ] **Step 1: 테스트 의존성 추가**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 2: 실패 테스트 작성**

```jsx
// src/App.test.jsx
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("Landing page", () => {
  it("renders title, description, and status", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "School Log X" })).toBeInTheDocument();
    expect(screen.getByText("학생을 위한 아주 간단한 시작 페이지입니다.")).toBeInTheDocument();
    expect(screen.getByText("상태: 배포 준비 완료")).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: 테스트 환경 설정**

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
  },
});
```

```js
// src/test/setup.js
import "@testing-library/jest-dom";
```

```json
// package.json (scripts 일부)
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest run"
  }
}
```

- [ ] **Step 4: 실패 확인**

Run: `npm run test`  
Expected: FAIL (App 텍스트가 아직 요구와 불일치)

- [ ] **Step 5: 최소 구현으로 테스트 통과**

```jsx
// src/App.jsx
export default function App() {
  return (
    <main>
      <h1>School Log X</h1>
      <p>학생을 위한 아주 간단한 시작 페이지입니다.</p>
      <p>상태: 배포 준비 완료</p>
    </main>
  );
}
```

- [ ] **Step 6: 통과 확인**

Run: `npm run test`  
Expected: PASS

- [ ] **Step 7: Task 2 커밋**

```bash
git add package.json package-lock.json vite.config.js src/App.jsx src/App.test.jsx src/test/setup.js
git commit -m "feat: add minimal landing UI with tests"
```

### Task 3: Azure Static Web Apps 자동 배포 추가

**Files:**
- Create: `.github/workflows/azure-static-web-apps.yml`
- Modify: `README.md`

- [ ] **Step 1: SWA 워크플로 작성**

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v4
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          output_location: "dist"

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        uses: Azure/static-web-apps-deploy@v1
        with:
          action: "close"
```

- [ ] **Step 2: README 배포 섹션 업데이트**

```md
## Azure 배포(Static Web Apps)
1. Azure에서 Static Web Apps 리소스를 생성한다.
2. 배포 토큰을 복사해 GitHub repository secret `AZURE_STATIC_WEB_APPS_API_TOKEN`으로 등록한다.
3. `main` 브랜치에 푸시하면 GitHub Actions가 자동 배포한다.
```

- [ ] **Step 3: Task 3 커밋**

```bash
git add .github/workflows/azure-static-web-apps.yml README.md
git commit -m "ci: add azure static web apps deployment workflow"
```

### Task 4: Azure 리소스 생성 및 배포 검증

**Files:**
- Modify: 없음(운영 실행 단계)

- [ ] **Step 1: Azure 로그인 및 구독 선택**

```bash
az login
az account list --query "[].{name:name,id:id,isDefault:isDefault}" -o table
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
az account set --subscription "$SUBSCRIPTION_ID"
```

- [ ] **Step 2: 리소스 그룹 생성**

```bash
az group create --name rg-schoollogx --location koreacentral
```

- [ ] **Step 3: SWA 리소스 생성**

```bash
az staticwebapp create \
  --name schoollogx-swa \
  --resource-group rg-schoollogx \
  --source https://github.com/hsdm262823-design/School-Log-X \
  --location "East Asia" \
  --branch main \
  --app-location "/" \
  --output-location "dist" \
  --login-with-github
```

- [ ] **Step 4: 배포 토큰 발급 및 GitHub Secret 등록**

```bash
az staticwebapp secrets list --name schoollogx-swa --resource-group rg-schoollogx
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list --name schoollogx-swa --resource-group rg-schoollogx --query properties.apiKey -o tsv)
gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN --repo hsdm262823-design/School-Log-X --body "$DEPLOYMENT_TOKEN"
```

- [ ] **Step 5: 빌드/배포 최종 확인**

Run: `npm run build`  
Expected: build success

Run: `gh run list --repo hsdm262823-design/School-Log-X --limit 5`  
Expected: `Azure Static Web Apps CI/CD` workflow 최근 실행 성공

- [ ] **Step 6: Task 4 커밋(필요 시)**

```bash
# 운영 단계에서 파일 변경이 생긴 경우만 커밋
git status --short
```
