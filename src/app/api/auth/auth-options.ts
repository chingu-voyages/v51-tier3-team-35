import { compare, hash } from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "../../../lib/mongodb/mongodb";
import { UserModel } from "../../../lib/schemas/user.schema";
export const authOptions: NextAuthOptions = {
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },

  providers: [
    GoogleProvider({
      id: "google",
      name: "Google",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        password: {
          label: "Password",
          type: "password",
        },
        email: {
          label: "Email",
          type: "text",
        },
      },

      async authorize(credentials) {
        await dbConnect();

        const user = await UserModel.findOne({
          email: credentials?.email,
        });

        if (!user) return null;

        if (await compare(credentials!.password, user.hashedPassword)) {
          return { email: user.email, name: user.name, _id: user._id } as any;
        } else {
          console.error("Password incorrect");
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      if (profile) {
        await dbConnect();

        const user = await UserModel.findOne({
          email: profile.email,
        });

        if (!user) {
          const hashedPassword = await hash(generateRandomPassword(), 10);
          try {
            await UserModel.create({
              email: profile.email,
              name: profile.name,
              hashedPassword: hashedPassword,
              oAuth: true,
            });
          } catch (error) {
            console.error(error);
          }
        }
      }

      return true;
    },
    async jwt({ token }) {
      await dbConnect();

      const userSession = await UserModel.findOne({
        email: token.email,
      });

      token = {
        ...token,
        _id: userSession?._id,
        name: userSession?.name,
      };
      return token;
    },

    async session({ session, token }) {
      session = {
        ...session,
        user: {
          _id: token._id,
          name: token.name,
          email: token.email,
        } as any,
      };
      return session;
    },
  },
};

// This is used to generate a random password for users who sign in with Google as a placeholder in the database
const generateRandomPassword = (length: number = 6): string => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

export default authOptions;
