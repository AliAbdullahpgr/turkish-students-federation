import { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim Mesajları - Admin",
};

export default function ContactSubmissionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-6">İletişim Mesajları</h1>
      <p className="text-text-muted text-sm">İletişim formu gönderileri burada listelenecek. Entegrasyon sonrası aktif edilecek.</p>
    </div>
  );
}
