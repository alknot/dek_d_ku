export async function GET(req: { url: string | URL }) {
  const fullUrl = new URL(req.url)
  const newUrl = new URL('/api/auth/callback/keycloak', fullUrl.origin)
  
  // Ensure we pass the same redirect_uri in the state
  newUrl.searchParams.append('redirect_uri', `${process.env.NEXTAUTH_URL}/api/auth/callback/keycloak`)
  
  // Copy all other query parameters
  fullUrl.searchParams.forEach((value, key) => {
    if (key !== 'redirect_uri') {  // Don't override our redirect_uri
      newUrl.searchParams.append(key, value)
    }
  })

  console.log("This is it",newUrl)

  return Response.redirect(newUrl)
}
  