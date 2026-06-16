import { notFound } from "next/navigation";
import { getChallengeBySlug } from "@/consts/challenges";
import ChallengeRunner from "@/components/ui/ChallengeRunner";

// server side component to get the challenge by slug and then render the ChallengeRunner with it
export default async function ChallengePage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {

  // get the slug
  const { slug } = await params;
  const challenge = getChallengeBySlug(slug);

  // return 404 if the challenge is not found
  if (!challenge) {
    notFound();
  }

  return <ChallengeRunner challenge={challenge} />;
}
