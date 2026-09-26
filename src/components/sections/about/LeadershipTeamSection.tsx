import SectionHeader from "@/components/ui/SectionHeader";
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
    <section className="bg-white py-section border-t border-border-custom">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <SectionHeader
          title={<>Proje <span className="text-accent">Ekibimiz</span></>}
          lede="Kararlı, adanmış ve öğrenci topluluğuna derinden bağlı; Pakistan Öğrenci Rehberi&apos;ni hazırlayan ekiple tanışın."
        />

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
