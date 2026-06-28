# 06. API 명세 (API Specification)

## 1) 공통 규칙
- Base URL:
  - local: `http://localhost:4000/api/v1`
  - stage/prod: `https://<app-name>.azurewebsites.net/api/v1`
- 인증 방식: 없음 (MVP는 비로그인 단일 사용자)
- 응답 형식: JSON

### 성공 응답 예시
```json
{
  "success": true,
  "data": {}
}
```

### 실패 응답 예시
```json
{
  "success": false,
  "message": "오류 내용"
}
```

## 2) 엔드포인트 목록
| 기능 | Method | Path | 설명 |
|---|---|---|---|
| 일정 목록 조회 | GET | /schedules | 사용자의 일정 목록 조회 |
| 일정 등록 | POST | /schedules | 새 과제/시험 일정 등록 |
| 일정 수정 | PATCH | /schedules/{id} | 기존 일정 수정 |
| 일정 삭제 | DELETE | /schedules/{id} | 일정 삭제 |
| 다가오는 일정 조회 | GET | /schedules/upcoming | D-day 계산용 다가오는 일정 조회 |

## 3) 상세 명세 템플릿
### GET /schedules
- 설명: 과제/시험 일정 목록을 조회한다.
- 요청 파라미터:
  - `dateFrom` (optional): 조회 시작일(YYYY-MM-DD)
  - `dateTo` (optional): 조회 종료일(YYYY-MM-DD)
- 성공 응답:
```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "title": "수학 수행평가",
      "type": "exam",
      "subject": "수학",
      "dueDate": "2026-06-20",
      "status": "pending",
      "progressPercent": 80
    }
  ]
}
```

### POST /schedules
- 설명: 과제/시험 일정을 등록한다.
- 요청 바디:
```json
{
  "title": "영어 단어 시험",
  "type": "exam",
  "subject": "영어",
  "dueDate": "2026-06-25",
  "status": "pending",
  "progressPercent": 0
}
```
- 성공 응답:
```json
{
  "success": true,
  "data": {
    "id": 202
  }
}
```

### PATCH /schedules/{id}
- 설명: 기존 일정을 수정한다.
- 요청 바디(예시):
```json
{
  "title": "영어 단어 시험(범위 수정)",
  "dueDate": "2026-06-26",
  "status": "pending",
  "progressPercent": 40
}
```
- 성공 응답:
```json
{
  "success": true,
  "data": {
    "id": 202
  }
}
```

### GET /schedules/upcoming
- 설명: 오늘 기준 N일 이내의 과제/시험 일정을 조회해 D-day 계산에 사용한다.
- 요청 파라미터:
  - `days` (optional): 조회 일수(기본 7일)
- 성공 응답:
```json
{
  "success": true,
  "data": [
    {
      "id": 301,
      "title": "국어 발표",
      "type": "assignment",
      "subject": "국어",
      "dueDate": "2026-06-24",
      "dDay": 3
    }
  ]
}
```

### DELETE /schedules/{id}
- 설명: 일정을 삭제한다.
- 성공 응답:
```json
{
  "success": true,
  "data": {
    "id": 202
  }
}
```
