import Link from "next/link";

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

async function getMovies(searchTerm: string) {
  try {
    const apiKey = process.env.OMDB_API_KEY;

    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(
        searchTerm
      )}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }

    const data = await response.json();

    if (data.Response === "False") {
      return {
        movies: [],
        error: data.Error || "No movies found.",
      };
    }

    return {
      movies: data.Search || [],
      error: "",
    };
  } catch (error) {
    return {
      movies: [],
      error: "Something went wrong. Please try again.",
    };
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;

  const searchTerm = params.search || "Titanic";

  const { movies, error } = await getMovies(searchTerm);
  

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            🎬 Movie Explorer
          </h1>

          <p className="mt-3 text-gray-600">
            Server-Side Rendering Movie Explorer
          </p>
        </header>

        {/* Search Form */}
        <form
          action="/"
          method="GET"
          className="mx-auto mb-10 flex max-w-2xl flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            name="search"
            placeholder="Search for a movie..."
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        {/* Error State */}
        {error && (
          <div className="mx-auto max-w-2xl rounded-lg bg-red-100 p-5 text-center">
            <p className="font-semibold text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* Movie List */}
        {!error && movies.length > 0 && (
          <>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Movies
            </h2>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">

              {movies.map((movie: Movie) => (
                <Link
                  key={movie.imdbID}
                  href={`/movie/${movie.imdbID}`}
                  className="group overflow-hidden rounded-xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Poster */}
                  <div className="aspect-[2/3] overflow-hidden bg-gray-200">
                    {movie.Poster && movie.Poster !== "N/A" ? (
                      <img
                        src={movie.Poster}
                        alt={movie.Title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-500">
                        No Poster Available
                      </div>
                    )}
                  </div>

                  {/* Movie Information */}
                  <div className="p-4">
                    <h3 className="line-clamp-2 font-bold text-gray-900">
                      {movie.Title}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      {movie.Year}
                    </p>
                  </div>
                </Link>
              ))}

            </div>
          </>
        )}

        {/* No Movies */}
        {!error && movies.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-lg text-gray-600">
              No movies found.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}