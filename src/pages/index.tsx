import { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>cherm</title>
        <meta name="description" content="Chat application." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};

export default Home;
