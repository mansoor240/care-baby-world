import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import { storeConfig } from "../config/store";

const TITLES = {
  shipping: "Shipping Policy",
  returns: "Return & Refund Policy",
  privacy: "Privacy Policy",
  terms: "Terms & Conditions",
};

export default function Policies() {
  const { slug } = useParams();
  const [content, setContent] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!TITLES[slug]) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setNotFound(false);
    api
      .get(`/settings/policies/${slug}`)
      .then((r) => {
        setContent(r.data.content || "");
        setLastUpdated(r.data.lastUpdated);
        document.title = `${TITLES[slug]} — ${storeConfig.name}`;
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="skeleton h-8 w-1/3 rounded-2xl" />
        <div className="mt-4 space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton h-4 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl text-ink-900 dark:text-night-50">
          Policy not available
        </h1>
        <p className="mt-2 text-sm text-ink-500 dark:text-night-300">
          This policy hasn't been published yet. Please check back later.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-white dark:bg-blush-500"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <nav className="text-xs text-ink-500 dark:text-night-400">
        <Link
          to="/"
          className="hover:text-ink-900 transition dark:hover:text-night-50"
        >
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink-900 dark:text-night-50">{TITLES[slug]}</span>
      </nav>

      <h1 className="mt-4 font-display text-3xl text-ink-900 dark:text-night-50">
        {TITLES[slug]}
      </h1>
      {lastUpdated && (
        <p className="mt-2 text-xs text-ink-500 dark:text-night-400">
          Last updated:{" "}
          {new Date(lastUpdated).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}

      <div className="prose mt-6 whitespace-pre-line text-sm leading-relaxed text-ink-700 dark:text-night-100">
        {content}
      </div>

      <div className="mt-10 rounded-2xl bg-sand-50 p-5 text-sm dark:bg-night-800 dark:ring-1 dark:ring-white/5">
        <p className="text-ink-700 dark:text-night-100">
          Questions? Message us on WhatsApp at{" "}
          <span className="font-medium">{storeConfig.phone}</span> or email{" "}
          <span className="font-medium">{storeConfig.email}</span>.
        </p>
      </div>
    </article>
  );
}