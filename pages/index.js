import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/landingpage');
  }, [router]);

  return null;
}

// Maintain i18n support
export async function getStaticProps({ locale }) {
  return {
    props: {},
  };
}
