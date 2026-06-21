# 📚 School Log X

> 학생을 위한 학교 생활 종합 관리 웹 애플리케이션

---

## 📖 프로젝트 소개

**School Log X**는 학생이 학교 생활을 더 체계적으로 관리할 수 있도록 도와주는 웹 앱입니다.  
React 기반으로 제작되었으며, 개인 학습 및 학교 관련 정보를 한 곳에서 관리할 수 있습니다.

---

## 🛠️ 기술 스택

| 분류 | 기술 |
|------|------|
| 프론트엔드 | React |
| 백엔드 | Node.js + Express (REST API) |
| 데이터베이스 | PostgreSQL |
| 배포 | Azure App Service + Azure Database for PostgreSQL (dev/stage/prod) |

---

## ✨ 주요 기능

- [x] 과제·시험 일정 통합 캘린더
- [x] 다가오는 마감/시험 D-day 알림
- [x] 과목별 과제 진행률 체크

---

## 🚀 시작하기

### 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/hsdm262823-design/School-Log-X.git

# 프로젝트 폴더로 이동
cd School-Log-X

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

---

## 📁 프로젝트 구조

```
School-Log-X/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

---

## ☁️ Azure Static Web Apps 자동 배포

1. Azure Portal에서 **Azure Static Web Apps** 리소스를 생성합니다.
2. 생성 과정에서 발급된 배포 토큰을 GitHub 저장소 시크릿에 `AZURE_STATIC_WEB_APPS_API_TOKEN` 이름으로 추가합니다.
3. `master` 브랜치에 푸시하면 GitHub Actions 워크플로우가 실행되어 `dist` 산출물이 자동 배포됩니다.

---

## 📝 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

---

## 👤 개발자

- **hsdm262823-design** — [@hsdm262823-design](https://github.com/hsdm262823-design)
