import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongo from "../../../database/conn";
import Users from "../../../model/Schema";
import { compare } from "bcryptjs";

export default NextAuth({
  providers: [
    // Google Provider
    // GoogleProvider({
    //   clientId: process.env.NEXT_PUBLIC_GOOGLE_ID,
    //   clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET,
    // }),

    // Credentials Provider
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials, req) {
        await connectMongo().catch((error) => {
          error: "Connection Failed...!";
        });

        // check user existance
        const result = await Users.findOne({
          email: credentials.email,
        }).populate("groupId");

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
          throw new Error("Wrong Password");
        }
        return result;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, //$ openssl rand -base64 32
  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/auth/error", // Error code passed in query string as ?error=
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.username = user.username;
        token.email = user.email;
        token.group_code = user.groupId ? user.groupId.group_code : "";
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
