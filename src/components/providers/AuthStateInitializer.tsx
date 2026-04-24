'use client'

import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { isAdminAtom, isLoggedInAtom } from '@/src/store/authAtom'
import { createClient } from '@/src/utils/supabase/client'

interface AuthStateInitializerProps {
  isAdmin: boolean
  isLoggedIn: boolean
}

export function AuthStateInitializer({ isAdmin, isLoggedIn }: AuthStateInitializerProps) {
  const setIsAdmin = useSetAtom(isAdminAtom)
  const setIsLoggedIn = useSetAtom(isLoggedInAtom)

  useEffect(() => {
    setIsAdmin(isAdmin)
    setIsLoggedIn(isLoggedIn)
  }, [isAdmin, isLoggedIn, setIsAdmin, setIsLoggedIn])

  return null
}

export function AuthStateInitializerClient() {
  const setIsAdmin = useSetAtom(isAdminAtom)
  const setIsLoggedIn = useSetAtom(isLoggedInAtom)

  useEffect(() => {
    const supabase = createClient()

    const syncAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setIsLoggedIn(false)
          setIsAdmin(false)
          return
        }
        setIsLoggedIn(true)
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        setIsAdmin(profile?.role === 'admin')
      } catch {
        setIsLoggedIn(false)
        setIsAdmin(false)
      }
    }

    syncAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      syncAuth()
    })

    return () => subscription.unsubscribe()
  }, [setIsAdmin, setIsLoggedIn])

  return null
}
