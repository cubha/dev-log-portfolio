-- skills 테이블 쓰기 권한을 admin으로 제한
-- 기존 "Auth write skills" 정책은 auth.role() = 'authenticated'만 확인해
-- 로그인만 하면(관리자 아니어도) insert/update/delete가 가능했음.
-- educations/experiences/trainings와 동일하게 profiles.role = 'admin' 조건으로 강화.

DROP POLICY IF EXISTS "Auth write skills" ON public.skills;

CREATE POLICY "Admin write skills"
  ON public.skills
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
