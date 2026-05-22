import SectionEyebrow from "@/components/ui/SectionEyebrow";
import TeamCard from "@/components/ui/TeamCard";

interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  bio?: string | null;
  photo?: string | null;
  order: number;
}

interface LeadershipTeamSectionProps {
  members: TeamMemberItem[];
}

export default function LeadershipTeamSection({ members }: LeadershipTeamSectionProps) {
  return (
    <section className="bg-white py-section">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <div className="mb-12 text-center">
          <SectionEyebrow text="EKIP" />
          <h2 className="text-section-title font-heading font-bold text-text-primary">
            Proje <span className="text-accent">Ekibimiz</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-body text-text-secondary">
            Kararli, adanmis ve ogrenci topluluguna derinden bagli; Pakistan Ogrenci Rehberi&apos;ni
            hazirlayan ekiple tanisin.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <TeamCard
              key={member.id}
              photo={member.photo ?? undefined}
              name={member.name}
              role={member.role}
              bio={member.bio ?? ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
