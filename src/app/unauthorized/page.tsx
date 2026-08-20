export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-pink-50 to-white p-6">
      <div className="w-full max-w-2xl">
        <div className="rounded-3xl bg-white p-8 shadow-md">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-pink-100">
              <svg className="h-10 w-10 text-pink-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h1 className="text-2xl font-semibold text-primary">Access Restricted</h1>

            <p className="max-w-xl text-sm text-zinc-600">You don't have permission to access this page.</p>

            <div className="mt-4 flex w-full justify-center">
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-pink-400 px-6 py-3 text-sm font-medium text-white shadow-sm hover:opacity-95"
              >
                Go to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
