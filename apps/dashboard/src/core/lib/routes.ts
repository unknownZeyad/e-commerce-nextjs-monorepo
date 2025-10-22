const authRoutes = [
  '/login'
]

const protectedRoutes = [
  '/dashboard'
]

export const isAuthRoute = (pathname: string) => {
  return Boolean(authRoutes.find(route => pathname.startsWith(route)))
}

export const isProtectedRoute = (pathname: string) => {
  return Boolean(protectedRoutes.find(route => pathname.startsWith(route)))
}
