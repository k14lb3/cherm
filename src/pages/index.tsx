import { useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import useStore from '@/store';
import { autoId } from '@/utils/helpers';
import Header from '@/components/header';
import ChatBox from '@/components/chatbox';

const Home: NextPage = () => {
  const setUid = useStore((state) => state.setUid);

  useEffect(() => setUid(autoId()), []);

  return (
    <>
      <Head>
        <title>cherm</title>
        <meta name="description" content="Chat application." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <ChatBox />
    </>
  );
};

export default Home;
