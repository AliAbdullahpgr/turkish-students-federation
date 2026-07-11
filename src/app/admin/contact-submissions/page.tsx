import { Metadata } from "next";
import { getContactSubmissions } from "@/db/queries/contact-submissions";

export const metadata: Metadata = {
  title: "İletişim Mesajları - Admin",
};

export default async function ContactSubmissionsPage() {
  const submissions = await getContactSubmissions();

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-6">İletişim Mesajları</h1>
      {submissions.length === 0 ? (
        <p className="text-text-muted text-sm">Henüz form gönderisi bulunmuyor.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <article key={submission.id} className="rounded-lg bg-white p-5 shadow-sm">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-bold text-text-primary">{submission.name}</h2>
                  <a href={`mailto:${submission.email}`} className="text-sm text-action">{submission.email}</a>
                </div>
                <div className="text-right text-xs text-text-muted">
                  <span className="block font-semibold text-primary">
                    {submission.kind === "membership" ? "Üyelik Başvurusu" : "İletişim Mesajı"}
                  </span>
                  <time>{submission.createdAt}</time>
                </div>
              </div>
              {submission.subject ? <h3 className="mb-2 font-semibold text-text-primary">{submission.subject}</h3> : null}
              <p className="whitespace-pre-wrap text-sm leading-6 text-text-secondary">{submission.message}</p>
              {submission.phone ? <p className="mt-3 text-sm text-text-secondary">Telefon: {submission.phone}</p> : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
