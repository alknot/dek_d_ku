import { handleError } from '@/app/libs/utils';
import { PrismaClient, Role } from '@prisma/client';
import NextAuth, { NextAuthOptions, Profile, Session } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { decodeToken } from 'react-jwt';

const db = new PrismaClient();

declare module 'next-auth' {
  interface Session {
    account: any;
    profile: any;
    roles: any;
    userProfile: {
      advisor: string;
      createdAt: string;
      department: string;
      departmentId: string;
      email: string;
      faculty: string;
      firstnameEn: string;
      firstnameTh: string;
      gpa: string;
      id: string;
      lastnameEn: string;
      lastnameTh: string;
      major: string;
      mobilePhone: string;
      position: string;
      positionId: string;
      prenameEn: string;
      prenameTh: string;
      role: Role;
      updatedAt: string;
    };
  }

  interface Profile {
    realm_access: any;
  }
}

async function createUserThroughAPI(userId: string, tokenData: any) {
  console.log('--------------CREATE USER VIA API---------------');
  // console.log({ userId, tokenData });

  console.log({
    resultBody: {
      id: userId,
      prenameTh: tokenData.thaiprename || '',
      firstnameTh: tokenData['first-name'] || '',
      lastnameTh: tokenData['last-name'] || '',
      prenameEn: tokenData.prenameEn || '',
      firstnameEn: tokenData.given_name || '',
      lastnameEn: tokenData.family_name || '',
      role: 'NOT_ASSIGNED',
      faculty: tokenData.faculty,
      email: tokenData['google-mail'],
      typePerson: tokenData['type-person'],
    },
  });

  const API_BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${API_BASE_URL}/api/user`, {
      method: 'POST',

      body: JSON.stringify({
        id: userId,
        prenameTh: tokenData.thaiprename || '',
        firstnameTh: tokenData['first-name'] || '',
        lastnameTh: tokenData['last-name'] || '',
        prenameEn: tokenData.prenameEn || '',
        firstnameEn: tokenData.given_name || '',
        lastnameEn: tokenData.family_name || '',
        role: 'NOT_ASSIGNED',
        faculty: tokenData.faculty,
        email: tokenData['google-mail'],
        typePerson: tokenData['type-person'],
      }),
    });
    if (!res.ok) {
      console.error('Failed to create user via API');
    } else {
      console.log('User created via API');
      return res.json();
    }
  } catch (error) {
    console.error('Error calling API:', error);
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      wellKnown: 'https://sso-dev.ku.ac.th/realms/KU-Alllogin/.well-known/openid-configuration',
      clientId: process.env.CLIENT_ID as string,
      clientSecret: process.env.SECRET as string,
      authorization: {
        params: {
          scope: 'basic openid',
          redirect_uri: `${process.env.NEXTAUTH_URL}/auth/redirect`,
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      console.log({ token, account, profile });

      try {
        if (account) {
          console.log('--------------ACCESS TOKEN---------------');

          if (!account.access_token) {
            throw new Error('Access token is missing in account object');
          }

          const decodedToken: any = decodeToken(account.access_token as any);
          if (!decodedToken) {
            throw new Error('Failed to decode access token');
          }

          console.log('Decoded Token:', decodedToken);

          console.log('decodedToken', decodedToken);
          const userId = decodedToken?.sub as string;
          if (!userId) {
            throw new Error('User ID (sub) is missing from the decoded token');
          }

          profile = decodedToken as Profile;
          token.account = account;
          token.profile = profile;
          token.client_roles = profile?.realm_access?.roles || [];

          console.log('User ID:', userId);
          console.log('Client Roles:', token.client_roles);

          // Check if the user exists in the database
          let user;
          try {
            user = await db.user.findUnique({ where: { id: userId } });
            console.log('User found in DB:', user);
          } catch (prismaError) {
            handleError(prismaError);
            throw new Error('Database error while fetching user');
          }

          // If user does not exist, create one
          if (!user) {
            console.log('User not found, creating user via API');
            try {
              const newUser = await createUserThroughAPI(userId, profile);
              if (!newUser) {
                throw new Error('Failed to create user via API');
              }
              token.userProfile = newUser;
              console.log('newUser', newUser);
              console.log('User created successfully:', newUser);
            } catch (apiError) {
              console.error('Error creating user via API:', apiError);
              throw new Error('API user creation failed');
            }
          } else {
            console.log(user);
            token.userProfile = user;
          }
        }
      } catch (error) {
        console.error('JWT Callback Error:', error);
      }

      return token;
    },

    async session({ session, token }) {
      console.log('async session accessed');

      session.account = token.account || null;
      session.profile = token.profile || null;
      session.roles = token.client_roles || [];
      session.userProfile = token.userProfile as any;

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
