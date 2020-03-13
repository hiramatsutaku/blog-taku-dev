import React from 'react';
import { Layout } from '../../presentation/components/Layout';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import { PostFields } from '../../domain/post/PostEntity';
import { PostApplicationService } from '../../application/PostApplicationService';
import { Post } from '../../presentation/components/Post';
import { PostRepository } from '../../infrastructure/repositories/PostRepository';

type Props = PostFields;

const PostPage: NextPage<Props> = post => {
  return (
    <Layout description={post.title}>
      <Post post={post} />
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const postRepository = new PostRepository();
  const service = new PostApplicationService(postRepository);
  const posts = await service.getPosts();
  return {
    paths: posts.map(post => `/posts/${post.slug}`),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug;
  if (typeof slug !== 'string') {
    throw new Error('slug does not be defined.');
  }
  const postRepository = new PostRepository();
  const service = new PostApplicationService(postRepository);
  const entry = await service.getPostBySlug(slug);
  return {
    props: { ...entry },
  };
};

export default PostPage;
