import Link from "next/link";

interface MovieDetails {
  Title: string;
  Poster: string;
  Plot: string;
  Released: string;
  imdbRating: string;
  Year: string;
}

async function getMovieDetails(id: string): Promise<MovieDetails | null> {
  try {
    const apiKey = process.env.OMDB_API_KEY;

    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${apiKey}&i=${id}&plot=full`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch movie details");
    }

    const data = await response.json();

    if (data.Response === "False") {
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
}

export default async function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const movie = await getMovieDetails(id);

  // Error / Movie Not Found
  if (!movie) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
        <h1 className="mb-4 text-2xl font-bold text-red-600">
          Movie Not Found
        </h1>

        <p className="mb-6 text-gray-600">
          We could not find the movie you requested.
        </p>

        <Link
          href="/"
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          ← Back to Movies
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Back Button */}
        <Link
          href="/"
          className="mb-6 inline-block font-semibold text-blue-600 hover:underline"
        >
          ← Back to Movies
        </Link>

        {/* Movie Details Card */}
        <div className="grid overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-3">

          {/* Movie Poster */}
          <div className="bg-gray-200">
            {movie.Poster && movie.Poster !== "N/A" ? (
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="h-full min-h-[500px] w-full object-cover"
              />
            ) : (
              <div className="flex min-h-[500px] items-center justify-center text-gray-500">
                No Poster Available
              </div>
            )}
          </div>

          {/* Movie Information */}
          <div className="p-6 sm:p-8 md:col-span-2">

            <h1 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
              {movie.Title}
            </h1>

            {/* Movie Information */}
            <div className="mb-6 space-y-3 text-gray-700">

              <p>
                <strong>Release Date:</strong>{" "}
                {movie.Released}
              </p>

              <p>
                <strong>Year:</strong>{" "}
                {movie.Year}
              </p>

              <p>
                <strong>Rating:</strong>{" "}
                ⭐ {movie.imdbRating}/10
              </p>

            </div>

            {/* Description */}
            <div>
              <h2 className="mb-3 text-2xl font-bold text-gray-900">
                Description
              </h2>

              <p className="leading-7 text-gray-600">
                {movie.Plot}
              </p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}