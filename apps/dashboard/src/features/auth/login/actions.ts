'use server'
import { createToken } from '@/core/lib/utils'
import { adminRepo } from '@packages/server/features/admins/repo'
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')

  if (!email || !password) return

  const admin = await adminRepo.getByEmail(email as string)
  if (!admin) return

  const isMatch = await bcrypt.compare(password as string, admin.password)
  if (!isMatch) return

  const token = await createToken({
    id: admin.id,
    super: admin.isSuper,
    version: admin.tokenVersion
  })

  const cookieStore = await cookies()

  cookieStore.set('token', token, {
    maxAge: 7 * 24 * 60 * 60, 
    httpOnly: true, 
    sameSite: 'lax',
  })
  redirect('/dashboard')
}