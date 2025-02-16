# 📌 사용자 맞춤형 다이어리 & 캘린더 앱

## 1️⃣ 프로젝트 소개

이 프로젝트는 **사용자 맞춤형 다이어리 기능을 제공하는 캘린더 기반 웹 애플리케이션**입니다.  
사용자는 특정 날짜를 선택하여 **여러 개의 다이어리를 작성**할 수 있으며, **일정(루틴)도 추가**할 수 있습니다.  
또한, **해당 날짜의 사주(운세) 정보를 확인할 수 있도록 구현**되었습니다.  

---

## 2️⃣ 소스 빌드 및 실행 방법

### 📌 필수 사항
- **Java 17**
- **Spring Boot 3.4.2**
- **MySQL 8.0.36**
- **Gradle**
- **Swagger UI 사용 가능**
- **React & MUI 사용 (프론트엔드)**

### 📌 **DB 스키마 및 초기 데이터**
이 프로젝트의 **DB 스키마 및 초기 데이터**는 GitHub 저장소의 `calendar/` 폴더에 포함되어 있습니다.  
아래 파일을 이용하여 데이터베이스를 설정할 수 있습니다.

- 📂 `calendar/schema.sql` → **데이터베이스 테이블 생성**
- 📂 `calendar/data.sql` → **초기 데이터 삽입**

#### **1️⃣ MySQL 실행 및 데이터베이스 생성**
```sql
CREATE DATABASE IF NOT EXISTS calendardb;
USE calendardb;
mysql -u root -p calendardb < database/schema.sql
mysql -u root -p calendardb < database/data.sql
💡 이렇게 하면 데이터베이스가 자동으로 생성되고, 초기 데이터가 삽입됩니다.
# Gradle 사용 시
gradle build
gradle bootRun

```

## 3️⃣ 사용한 주요 라이브러리 및 사용 이유

### 📌 백엔드 라이브러리 (Spring Boot)
| 라이브러리                  | 사용 이유                                           |
|--------------------------|----------------------------------------------------|
| Spring Boot               | 빠른 개발을 위해 사용 (MVC 패턴)                           |
| Spring Security + JWT      | 로그인/회원 인증을 위해 JWT 기반 인증 적용                   |
| Spring Data JPA            | ORM을 활용한 데이터베이스 연동                               |
| MySQL Driver              | MySQL과의 연결을 위해 사용                               |
| Swagger (Springdoc OpenAPI)| API 문서화를 위해 사용                                 |
| Lombok                    | 코드 간결화를 위해 사용                                  |

### 📌 프론트엔드 라이브러리 (React)
| 라이브러리      | 사용 이유                                           |
|-------------|----------------------------------------------------|
| React       | SPA(Single Page Application) 기반으로 UI 구현            |
| Material-UI (MUI) | 스타일링 및 UI 컴포넌트 활용                           |

## 4️⃣ API 명세서 (Swagger)
이 프로젝트에서는 Swagger를 활용하여 API 문서를 자동 생성하였습니다.

### 📌 Swagger UI 확인 방법
서버 실행 후 브라우저에서 접속
- 🔗 [Swagger UI](http://localhost:8080/swagger-ui.html) : API 목록을 확인하고 테스트 가능
- OpenAPI JSON 문서는 아래에서 확인 가능
- 🔗 [OpenAPI JSON](http://localhost:8080/v3/api-docs)

## 5️⃣ 테스트케이스 작성

### 📌 Swagger를 활용한 API 테스트
이 프로젝트에서는 Swagger를 사용하여 모든 API 테스트를 진행하였습니다.
Swagger UI에서 각 API를 직접 실행하여 정상적으로 동작하는지 검증할 수 있습니다.

### 📌 API 테스트 진행 방법
1. 서버 실행 후 브라우저에서 Swagger UI 접속
   - 🔗 [Swagger UI](http://localhost:8080/swagger-ui.html)
2. API 목록에서 원하는 API 선택
3. 필요한 요청 값 입력 후 "Execute" 버튼 클릭
4. 응답 코드 및 데이터 확인하여 정상 동작 여부 검증

## 6️⃣ 기본 CRUD 이외 추가 기능
기본적인 다이어리 CRUD 기능 외에 다음과 같은 추가 기능을 구현하였습니다.

### 추가 기능
| 추가 기능                     | 설명                                                 |
|----------------------------|----------------------------------------------------|
| 📌 사주(운세) 조회            | 사용자가 특정 날짜를 선택하면 해당 날짜의 사주 정보를 볼 수 있음 |
| 📌 JWT 기반 인증             | 로그인/회원가입 후 JWT를 발급받아 보안 유지               |
| 📌 파일 업로드 (프로필 이미지 등록) | 사용자의 프로필 이미지를 업로드하여 관리 가능               |

