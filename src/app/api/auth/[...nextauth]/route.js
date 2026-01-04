import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Authorized users with roles
const AUTHORIZED_USERS = {
    "rob@launchpadphilly.org": { role: "lpuser1", name: "Rob" },
    "sanaa@launchpadphilly.org": { role: "lpuser2", name: "Sanaa" },
    "taheera@launchpadphilly.org": { role: "lpuser3", name: "Taheera" },
    "alope0091@launchpadphilly.org": { role: "lpuser4", name: "Aaron" },
};

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: { params: { prompt: "consent", access_type: "offline", response_type: "code" } },
        }),
    ],

    callbacks: {
        async signIn({ user }) {
            const email = user?.email?.toLowerCase();
            if (!email) return false;
            return Boolean(AUTHORIZED_USERS[email]);
        },

        async jwt({ token }) {
            const email = token?.email?.toLowerCase();
            if (email && AUTHORIZED_USERS[email]) {
                token.role = AUTHORIZED_USERS[email].role;
                token.name = AUTHORIZED_USERS[email].name;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role;
                if (token.name) session.user.name = token.name;
            }
            return session;
        },
    },

    pages: {
        signIn: "/auth/signin",
    },

    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };