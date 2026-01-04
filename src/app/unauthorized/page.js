import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                <h1 className="text-2xl font-semibold text-zinc-900 mb-4">Unauthorized</h1>
                <p className="text-zinc-600 mb-6">You do not have permission to access this page.</p>
                <Link href="/dashboard" className="text-zinc-800 underline">
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
}
