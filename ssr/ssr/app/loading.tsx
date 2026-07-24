export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">

        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>

        <h2 className="text-xl font-semibold text-gray-800">
          Loading Movies...
        </h2>

        <p className="mt-2 text-gray-500">
          Please wait while we find your movies.
        </p>

      </div>
    </main>
  );
}