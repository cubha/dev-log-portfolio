# Supabase CLI 설치 가이드 (Windows)

## 사전 요구사항

1. **Node.js 20 이상** 설치 필요
   - 확인 방법: `node --version`
   - 설치: [Node.js 공식 사이트](https://nodejs.org/)

2. **Docker Desktop** 설치 필요 (로컬 개발용)
   - 설치: [Docker Desktop 다운로드](https://www.docker.com/products/docker-desktop/)
   - 설치 후 Docker Desktop 실행 필요

## 설치 방법

### 방법 1: 프로젝트에 Dev Dependency로 설치 (권장)

```bash
npm install supabase --save-dev
```

설치 후 사용:
```bash
npx supabase --help
```

### 방법 2: npx로 직접 실행 (설치 없이 사용)

```bash
npx supabase --help
```

### 방법 3: 전역 설치

```bash
npm install -g supabase
```

전역 설치 후:
```bash
supabase --help
```

## 설치 확인

```bash
npx supabase --version
```

또는

```bash
supabase --version
```

## 주요 명령어

### 1. Supabase 로그인
```bash
npx supabase login
```

### 2. 프로젝트 연결
```bash
npx supabase link --project-ref your-project-ref
```

### 3. 스키마 동기화 (로컬 → 원격)
```bash
npx supabase db push
```

### 4. 스키마 가져오기 (원격 → 로컬)
```bash
npx supabase db pull
```

### 5. 마이그레이션 생성
```bash
npx supabase migration new migration_name
```

## 현재 프로젝트에서 사용하기

### 스키마 파일 적용하기

1. **Supabase Dashboard에서 직접 실행** (가장 간단)
   - Supabase Dashboard > SQL Editor > New Query
   - `supabase/schema.sql` 파일 내용 복사하여 실행

2. **CLI로 마이그레이션 생성 및 적용**
   ```bash
   # 마이그레이션 파일 생성
   npx supabase migration new init_schema
   
   # 생성된 마이그레이션 파일에 schema.sql 내용 복사
   # 그 후 push
   npx supabase db push
   ```

## 문제 해결

### Docker가 실행되지 않는 경우
- Docker Desktop을 실행하고 대기
- Docker가 완전히 시작될 때까지 기다림

### 권한 오류가 발생하는 경우
- PowerShell을 관리자 권한으로 실행
- 또는 `npm install` 대신 `npm install --global` 사용

### Node.js 버전이 낮은 경우
- Node.js 20 이상으로 업그레이드 필요
- `nvm` 또는 직접 설치로 업그레이드

## 참고 자료

- [Supabase CLI 공식 문서](https://supabase.com/docs/guides/cli)
- [Supabase CLI GitHub](https://github.com/supabase/cli)
