
/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

const authOptions = {
  providers: [
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET ? [
      GithubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      }),
    ] : []),
  ],
  callbacks: {
    async redirect({ url, baseUrl }: any) {
      console.log('NextAuth redirect called:', { url, baseUrl })
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
    async session({ session, token }: any) {
      console.log('NextAuth session callback:', { session, token })
      return session
    },
    async jwt({ token, account, profile }: any) {
      console.log('NextAuth JWT callback:', { token, account, profile })
      return token
    },
  },
  pages: {
    signIn: '/',
    error: '/',
  },
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
