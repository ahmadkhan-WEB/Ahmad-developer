import { useState, type FormEvent } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { Eyebrow } from "../components/Eyebrow";

type Review = {
  name: string;
  rating: number;
  text: string;
  date: string;
};

const storageKey = "navisense-reviews-v1";

function loadReviews(): Review[] {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
    if (!Array.isArray(value)) return [];
    return value.filter((review): review is Review => (
      typeof review?.name === "string" &&
      typeof review?.text === "string" &&
      Number.isInteger(review?.rating) && review.rating >= 1 && review.rating <= 5 &&
      typeof review?.date === "string" && Number.isFinite(Date.parse(review.date))
    ));
  } catch {
    return [];
  }
}

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(loadReviews);
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const review: Review = {
      name: String(formData.get("name")).trim(),
      rating: Number(formData.get("rating")),
      text: String(formData.get("text")).trim(),
      date: new Date().toISOString(),
    };
    if (!review.name || !review.text || review.rating < 1 || review.rating > 5) return;

    const nextReviews = [review, ...reviews];
    setReviews(nextReviews);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextReviews));
      setStatus("Your review has been saved in this browser.");
    } catch {
      setStatus("Your review has been added for this visit.");
    }
    form.reset();
  }

  return (
    <section className="reviews-section section-wrap" id="reviews" aria-labelledby="reviews-title">
      <div className="section-heading reviews-heading">
        <div><Eyebrow>Tell us what you think</Eyebrow><h2 id="reviews-title">A better way to get there?</h2><p className="section-lede">Share a thought about finding your way around.</p></div>
        <p className="review-count"><span>{reviews.length}</span> REVIEWS</p>
      </div>
      <div className="reviews-grid">
        <form className="review-form" onSubmit={handleSubmit}>
          <label className="review-field">Your name<input name="name" type="text" autoComplete="name" maxLength={60} placeholder="e.g. Alex" required /></label>
          <label className="review-field">Your rating<select name="rating" defaultValue="5" required><option value="5">5 - Excellent</option><option value="4">4 - Good</option><option value="3">3 - Okay</option><option value="2">2 - Could be better</option><option value="1">1 - Poor</option></select></label>
          <label className="review-field">Your review<textarea name="text" rows={4} maxLength={1000} placeholder="What made your visit easier?" required /></label>
          <button className="button button-primary review-submit" type="submit">Submit review <ArrowUpRight size={16} aria-hidden="true" /></button>
          <p className="review-status" role="status" aria-live="polite">{status}</p>
        </form>
        <div className="review-list" aria-live="polite" aria-label="Visitor reviews">
          {reviews.length === 0 ? <p className="review-empty">No reviews yet. Be the first to share your experience.</p> : reviews.map((review, index) => (
            <article className="review-item" key={`${review.date}-${index}`}>
              <div className="review-item-heading"><strong>{review.name}</strong><span className="review-stars" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: review.rating }, (_, starIndex) => <Star key={starIndex} size={13} fill="currentColor" aria-hidden="true" />)}</span></div>
              <time dateTime={review.date}>{new Date(review.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</time>
              <p>{review.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}