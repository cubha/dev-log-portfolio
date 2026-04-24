'use client'

import { useState, useCallback } from 'react'

/**
 * 2단계 삭제 확인 훅 (첫 클릭: 확인 상태 진입, 두 번째 클릭: 실제 삭제)
 *
 * @param onConfirmedDelete - 두 번째 클릭 시 호출되는 삭제 함수. id를 받아 실행.
 */
export function useDeleteConfirm<T extends number | string>(
  onConfirmedDelete: (id: T) => Promise<void>
) {
  const [deletingId, setDeletingId] = useState<T | null>(null)

  const handleDelete = useCallback(
    async (id: T) => {
      if (deletingId !== id) {
        setDeletingId(id)
        return
      }
      setDeletingId(null)
      await onConfirmedDelete(id)
    },
    [deletingId, onConfirmedDelete]
  )

  const cancelDelete = useCallback(() => setDeletingId(null), [])

  return { deletingId, handleDelete, cancelDelete }
}
