# 09. 배포 및 운영 가이드 (Deployment & Operations)

## 1) 환경 구성
- dev: 개발 환경
- stage: 배포 전 검증 환경
- prod: 운영 환경
- Azure 리소스:
  - API: Azure App Service
  - DB: Azure Database for PostgreSQL
  - 모니터링: Azure Monitor + Application Insights

## 2) 배포 절차
1. 코드 병합
2. 빌드(`npm run build`)
3. 테스트(핵심 시나리오)
4. stage 배포 후 확인(헬스체크/핵심 API 점검)
5. prod 배포
6. 상태 확인(에러율/응답시간)

## 3) 롤백 절차
1. 문제 버전 식별
2. 이전 안정 버전으로 즉시 복구
3. 원인 분석 후 재배포

## 4) 운영 체크리스트
- [ ] 서버 정상 상태
- [ ] API 응답 정상
- [ ] DB 연결 정상
- [ ] 에러율 확인
- [ ] 최근 배포 버전 태그 확인
- [ ] Azure App Service 환경변수 누락 여부 확인
