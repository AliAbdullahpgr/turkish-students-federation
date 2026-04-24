"use client";

export default function FacebookFeedSection() {
  return (
    <section className="py-section bg-surface">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 text-center">
        <h2 className="text-section-title font-heading font-bold text-text-primary mb-8">
          Facebook <span className="text-accent">Page</span>
        </h2>
        <div className="max-w-[500px] mx-auto bg-white rounded-[16px] p-8 shadow-card">
          <p className="text-text-secondary mb-4">
            Follow us on Facebook for the latest updates and events.
          </p>
          <a
            href="https://facebook.com/tsfturkey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-[#1877F2] text-white px-6 py-3 rounded-pill text-sm font-semibold no-underline transition-all hover:bg-[#166fe5]"
          >
            Visit facebook.com/tsfturkey
          </a>
        </div>
      </div>
    </section>
  );
}
