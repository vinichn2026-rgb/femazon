import { redirect } from 'next/navigation';

export default async function ServiceSlugCatchAll({ params }: { params: Promise<{ slug: string }> }) {
  // Direct customers cleanly to the central Femazon managed services booking page
  redirect('/services');
}
