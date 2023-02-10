import { useRouter } from 'next/router';

export default function useQueryString<T>() {
  const router = useRouter();

  return router.query as T;
}
