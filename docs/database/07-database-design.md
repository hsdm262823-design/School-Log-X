# 07. 데이터베이스 설계 (Database Design)

## 1) 테이블 목록
| 테이블명 | 용도 |
|---|---|
| users | 사용자 정보 저장 |
| schedules | 과제/시험 일정 저장 |

## 2) 테이블 상세 템플릿
### users
| 컬럼 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | bigint | PK | 사용자 ID |
| email | varchar | UNIQUE, NOT NULL | 이메일 |
| password_hash | varchar | NOT NULL | 암호화 비밀번호 |
| created_at | datetime | NOT NULL | 생성일 |

### schedules
| 컬럼 | 타입 | 제약조건 | 설명 |
|---|---|---|---|
| id | bigint | PK | 일정 ID |
| user_id | bigint | FK(users.id), NOT NULL | 사용자 ID |
| title | varchar | NOT NULL | 일정 제목 |
| type | varchar | NOT NULL | 일정 유형(exam, assignment) |
| subject | varchar | NOT NULL | 과목명 |
| due_date | date | NOT NULL | 마감/시험 일자 |
| status | varchar | NOT NULL | 진행 상태(pending, done) |
| created_at | datetime | NOT NULL | 생성일 |
| updated_at | datetime | NOT NULL | 수정일 |

## 3) 관계(ERD) 설명
- users 1 : N schedules

## 4) 인덱스 전략
- 자주 조회되는 컬럼에 인덱스 추가
- 과도한 인덱스는 쓰기 성능 저하 주의
- `schedules(user_id, due_date)` 복합 인덱스로 사용자 일정 조회 성능 확보

## 5) 마이그레이션 규칙
- 스키마 변경은 마이그레이션 파일로 관리
- 운영 반영 전 백업/롤백 계획 필수
