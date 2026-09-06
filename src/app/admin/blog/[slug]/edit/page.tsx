import { notFound } from 'next/navigation';
import { getPost } from '@/lib/blogStorage';
import PostForm from '../../_components/PostForm';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

export default function EditPostPage({ params }: Props) {
  const post = getPost(params.slug);
  if (!post) notFound();

  return <PostForm mode="edit" slug={params.slug} initial={post} />;
}
