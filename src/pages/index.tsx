import { NextPage } from 'next';
import Head from 'next/head';
import Header from '@/components/header';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>cherm</title>
        <meta name="description" content="Chat application." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
    </>
  );
};

export default Home;
