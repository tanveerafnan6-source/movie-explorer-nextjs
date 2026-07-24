"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface MovieDetails {
  Title: string;
  Poster: string;
  Plot: string;
  Released: string;
  imdbRating: string;
  Year: string;
}

export default function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError("");

        // Get the movie ID from the params Promise
        const { id } = await params;

        const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY;

        const response = await fetch(
          `https://www.omdbapi.com/?apikey=${apiKey}&i=${id}&plot=full`
        );

        const data = await response.json();

        if (data.Response === "False") {
          setError(data.Error || "Movie not found.");
        } else {
          setMovie(data);
        }
      } catch (error) {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, []);

  // Loading State
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>

          <p className="text-lg font-semibold text-blue-600">
            Loading movie details...
          </p>
        </div>
      </main>
    );
  }

  // Error State
  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
        <p className="mb-6 text-center text-xl font-semibold text-red-600">
          {error}
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

  // No Movie Found
  if (!movie) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p>Movie not found.</p>
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