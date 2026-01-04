"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage({ children, allowedRoles = [] }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        if (!session) {
            router.push(`/auth/signin?callbackUrl=${window.location.pathname}`);
            return;
        }

        // If allowedRoles is specified, check if user has the role
        if (allowedRoles.length > 0 && !allowedRoles.includes(session.user?.role)) {
            router.push("/unauthorized");
        }
    }, [session, status, router, allowedRoles]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-zinc-600">Loading...</div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-zinc-600">Redirecting to sign in...</div>
            </div>
        );
    }

    return <>{children}</>;
}
