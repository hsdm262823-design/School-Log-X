# 05. 시스템 아키텍처 (System Architecture)

## 1) 구성 요소
- 프론트엔드(UI): 사용자 화면
- 백엔드(API): 비즈니스 로직 처리
- 데이터베이스(DB): 데이터 저장
- 외부 서비스(선택): 푸시 알림, 모니터링

## 2) 데이터 흐름
사용자 요청 → 프론트엔드 → API 서버 → DB → API 서버 → 프론트엔드 → 사용자 응답

## 3) 책임 분리
| 영역 | 책임 |
|---|---|
| 프론트엔드 | 입력/출력, 사용자 상호작용 |
| 백엔드 | 데이터 검증, 권한 검사, 처리 로직 |
| DB | 저장, 조회, 무결성 유지 |

## 4) 기술 스택
- 프론트엔드: React
- 백엔드: Node.js + Express (REST API)
- DB: PostgreSQL
- 인프라: Azure App Service(API), Azure Database for PostgreSQL, Azure Monitor, dev/stage/prod 3개 환경 운영
