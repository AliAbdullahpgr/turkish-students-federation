import { currentUser } from "@clerk/nextjs/server";

export default async function AdminDashboard() {
  const user = await currentUser();

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
        Admin Paneli
      </h1>
      <p className="text-text-secondary">
        Hoş geldiniz, {user?.firstName ?? "Admin"}. Buradan site içeriğini yönetebilirsiniz.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <DashboardCard title="Blog Yazıları" href="/admin/blog-posts" />
        <DashboardCard title="Etkinlikler" href="/admin/events" />
        <DashboardCard title="Ekip Üyeleri" href="/admin/team-members" />
        <DashboardCard title="Kurslar" href="/admin/courses" />
        <DashboardCard title="Aktiviteler" href="/admin/activities" />
        <DashboardCard title="Rehber Bölümleri" href="/admin/guide-sections" />
        <DashboardCard title="Navigasyon" href="/admin/navigation" />
        <DashboardCard title="Site Ayarları" href="/admin/site-settings" />
        <DashboardCard title="Medya Kütüphanesi" href="/admin/media" />
      </div>
    </div>
  );
}

function DashboardCard({ title, href }: { title: string; href: string }) {
  return (
    <a
      href={href}
      className="block p-6 bg-white rounded-card shadow-card hover:shadow-card-hover transition-shadow border border-border-custom"
    >
      <h2 className="text-lg font-heading font-semibold text-text-primary">{title}</h2>
      <p className="text-sm text-text-muted mt-1">Yönet →</p>
    </a>
  );
}
