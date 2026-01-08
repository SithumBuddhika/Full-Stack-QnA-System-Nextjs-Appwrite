// src/app/users/[userId]/[userSlug]/page.tsx
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { answerCollection, db, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";
import NumberTicker from "@/components/ui/number-ticker";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string; userSlug: string }>;
}) {
  const { userId } = await params;

  const [user, questions, answers] = await Promise.all([
    users.get<UserPrefs>(userId),
    databases.listDocuments(db, questionCollection, [
      Query.equal("authorId", userId),
      Query.limit(1),
    ]),
    databases.listDocuments(db, answerCollection, [
      Query.equal("authorId", userId),
      Query.limit(1),
    ]),
  ]);

  const Card = ({ title, value }: { title: string; value: number }) => (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(140,30,255,0.20),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,41,117,0.14),transparent_45%),radial-gradient(circle_at_50%_120%,rgba(255,211,25,0.12),transparent_55%)]" />
      <div className="relative z-10">
        <p className="text-sm font-semibold text-white/70">{title}</p>
        <div className="mt-6 text-5xl font-extrabold [&_*]:text-white">
          <NumberTicker value={value} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
      <Card title="Reputation" value={Number(user.prefs?.reputation ?? 0)} />
      <Card title="Questions asked" value={Number(questions.total ?? 0)} />
      <Card title="Answers given" value={Number(answers.total ?? 0)} />
    </div>
  );
}
