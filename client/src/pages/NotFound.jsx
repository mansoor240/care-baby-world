import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <div className="text-6xl">🧸</div>
      <h1 className="mt-4 font-display text-3xl">Page not found</h1>
      <p className="mt-2 text-sm text-ink-500">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-white"
      >
        Go Home
      </Link>
    </div>
  );
}