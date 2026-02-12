# Supabase Storage 구조

## 버킷 구조

### project-images (Public)

프로젝트 관련 모든 이미지를 저장하는 통합 버킷입니다.

```
project-images/
├── profile/                    # 프로필 이미지
│   ├── 1770912345678-avatar.jpg
│   └── 1770912345679-photo.png
│
└── [프로젝트 썸네일 - 루트]
    ├── 1770912345680-project1.jpg
    └── 1770912345681-project2.png
```

## 파일 경로 규칙

### 1. 프로필 이미지
- **경로**: `profile/`
- **명명 규칙**: `{timestamp}-{sanitized_filename}.{ext}`
- **예시**: `profile/1770912345678-user_avatar.jpg`
- **업로드 코드**:
  ```typescript
  await uploadImage(file, 'project-images', 'profile/')
  ```

### 2. 프로젝트 썸네일
- **경로**: 루트 (경로 없음)
- **명명 규칙**: `{timestamp}-{sanitized_filename}.{ext}`
- **예시**: `1770912345680-project_thumbnail.jpg`
- **업로드 코드**:
  ```typescript
  await uploadImage(file, 'project-images')
  // 또는
  await uploadImage(file) // 기본값 사용
  ```

## 파일명 정제 규칙

원본 파일명에서 안전하지 않은 문자를 제거합니다:
- 허용: `a-z`, `A-Z`, `0-9`, `.`, `-`
- 제거/변환: 공백 및 특수문자 → `_`
- 예시: `내 프로필 사진.jpg` → `_____.jpg`

## URL 형식

```
https://[project-id].supabase.co/storage/v1/object/public/project-images/[path]/[filename]
```

**예시:**
- 프로필: `https://xxx.supabase.co/storage/v1/object/public/project-images/profile/1770912345678-avatar.jpg`
- 프로젝트: `https://xxx.supabase.co/storage/v1/object/public/project-images/1770912345680-thumbnail.jpg`

## 데이터베이스 매핑

### about_profiles 테이블
```sql
profile_image_url TEXT  -- profile/ 경로의 전체 URL 저장
```

### projects 테이블
```sql
thumbnail_url TEXT  -- 루트 경로의 전체 URL 저장
```

## 권한 설정

### RLS (Row Level Security)
- Storage는 Public 버킷으로 설정되어 있어 모든 사용자가 읽기 가능
- 업로드는 인증된 사용자만 가능 (클라이언트 측에서 제어)

### 업로드 권한
- 관리자만 업로드 가능 (애플리케이션 레벨에서 제어)
- 서버 액션에서 권한 검증

## 파일 관리

### 업로드
```typescript
import { uploadImage } from '@/src/utils/storage/uploadImage'

// 프로필 이미지
const profileUrl = await uploadImage(file, 'project-images', 'profile/')

// 프로젝트 썸네일
const thumbnailUrl = await uploadImage(file, 'project-images')
```

### 삭제
```typescript
import { deleteImage } from '@/src/utils/storage/uploadImage'

// URL에서 자동으로 경로 추출하여 삭제
await deleteImage(imageUrl, 'project-images')
```

## 용량 제한

- 파일당 최대 크기: **5MB**
- 지원 형식: JPG, PNG, GIF, WebP
- 검증 위치: 클라이언트 측 (업로드 전)

## 주의사항

1. **파일명 중복 방지**: 타임스탬프 사용으로 중복 방지
2. **upsert: false**: 동일 이름 파일 덮어쓰기 방지
3. **캐시 제어**: `cacheControl: '3600'` (1시간)
4. **경로 구분**: 프로필은 반드시 `profile/` 경로 사용
5. **URL 저장**: DB에는 전체 Public URL 저장

## 마이그레이션 가이드

기존 별도 버킷(`profile-images`)을 사용하는 경우:

```typescript
// Before
await uploadImage(file, 'profile-images')

// After
await uploadImage(file, 'project-images', 'profile/')
```

모든 기존 이미지를 새 구조로 마이그레이션하려면:
1. Supabase Dashboard에서 파일 다운로드
2. 새 경로로 재업로드
3. DB의 URL 업데이트
