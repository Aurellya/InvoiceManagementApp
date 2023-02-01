import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongo from "../../../database/conn";
import Users from "../../../model/Schema";
import { compare } from "bcryptjs";
import { BsChevronCompactLeft } from "react-icons/bs";
import { TiArrowSync } from "react-icons/ti";

export default NextAuth({
  providers: [
    // Google Provider
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET,
    }),
    // Credentials Provider
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        connectMongo().catch((error) => {
          error: "Connection Failed...!";
        });

        // check user existance
        const result = await Users.findOne({ email: credentials.email });
        if (!result) {
          throw new Error("No user Found with Email Please Sign Up...!");
        }

        // compare()
        const checkPassword = await compare(
          credentials.password,
          result.password
        );

        // incorrect password
        if (!checkPassword || result.email !== credentials.email) {
          throw new Error("Username or Password doesn't match");
        }
        return result;
      },
    }),
  ],
  secret: "zpxqxOrItmkfonECYRqwxtS/98tYj4SyHeFwsLP0UjU=",
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.username = user.username;
        token.email = user.email;
        token.group_code = user.group_code;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session._id = token._id;
        session.username = token.username;
        session.email = token.email;
        session.group_code = token.group_code;
        session.role = token.role;
      }
      return session;
    },
  },
});
