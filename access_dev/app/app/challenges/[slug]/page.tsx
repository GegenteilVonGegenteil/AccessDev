import { notFound } from "next/navigation";
import { getChallengeBySlug } from "@/consts/challenges";
import ChallengeRunner from "@/components/challenge-runner";

export default async function ChallengePage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  const { slug } = await params;
  const challenge = getChallengeBySlug(slug);

  if (!challenge) {
    notFound();
  }

  return <ChallengeRunner key={challenge.slug} challenge={challenge} />;
}
