# 07. 데이터베이스 설계 (Database Design)

## 1) 테이블 목록
| 테이블명 | 용도 |
|---|---|
| schedules | 과제/시험 일정 저장 |

## 2) 테이블 상세 템플릿
### schedules
| 컬럼 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | bigint | PK | 일정 ID |
| title | varchar | NOT NULL | 일정 제목 |
| type | varchar | NOT NULL | 일정 유형(exam, assignment) |
| subject | varchar | NOT NULL | 과목명 |
| due_date | date | NOT NULL | 마감/시험 일자 |
| status | varchar | NOT NULL | 진행 상태(pending, done) |
| progress_percent | int | NOT NULL, DEFAULT 0, CHECK(0~100) | 과목/일정 진행률(%) |
| created_at | datetime | NOT NULL | 생성일 |
| updated_at | datetime | NOT NULL | 수정일 |

## 3) 관계(ERD) 설명
- MVP는 비로그인 단일 사용자로 운영하므로 schedules 단일 테이블 중심으로 관리

## 4) 인덱스 전략
- 자주 조회되는 컬럼에 인덱스 추가
- 과도한 인덱스는 쓰기 성능 저하 주의
- `schedules(due_date)` 인덱스로 기간 기반 일정 조회 성능 확보
- `schedules(subject, due_date)` 복합 인덱스로 과목별 일정/진행률 조회 성능 확보

## 5) 마이그레이션 규칙
- 스키마 변경은 마이그레이션 파일로 관리
- 운영 반영 전 백업/롤백 계획 필수
