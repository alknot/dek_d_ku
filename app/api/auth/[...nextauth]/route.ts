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
        isAcceptPolicy: false,
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
      console.log('acc,profile', { account, profile });
      try {
        // console.log('acc', account);
        if (account) {
          // console.log('--------------ACCESS TOKEN ---------------');
          const decodedToken = decodeToken(account.access_token as any);
          if (token == null) {
            throw new Error('Unable to decode token');
          }
          // console.log(decodedToken);
          const userId = token.sub as string;
          // console.log('--------------USER ID---------------');
          // console.log(userId);
          // console.log("--------------ROLES---------------");
          profile = decodedToken as Profile;
          // console.log('profile', profile);
          token.account = account;
        }
        if (profile) {
          // console.log("--------------PROFILE---------------");
          // console.log(profile);
          token.profile = profile;
          const clientRoles = profile.realm_access.roles;
          token.client_roles = clientRoles;
        }
        if (profile && account) {
          const userId = token.sub as string;
          const tokenData = profile;

          console.log('--------------USER ID---------------');
          console.log({ userId });
          console.log('working');
          const user = await db.user.findUnique({ where: { id: userId } });
          // console.log({ user });
          if (!user) {
            console.log('User not found, creating user');
            const newUser = await createUserThroughAPI(userId, tokenData);
            token.userProfile = newUser;
          } else {
            token.userProfile = user;
          }
        }
      } catch (error) {
        handleError(error);
      }

      return token;
    },
    async session({ session, token }) {
      console.log('async session accessed');

      session.account = token.account;
      session.profile = token.profile;
      session.roles = token.client_roles;
      session.userProfile = token.userProfile as any;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
