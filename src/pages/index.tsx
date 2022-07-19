import { useEffect } from 'react';
import useStore from '@/store';
import { NextPage } from 'next';
import Head from 'next/head';
import Header from '@/components/header';
import ChatBox from '@/components/chatbox';

const Home: NextPage = () => {
  const setIp = useStore((state) => state.setIp);

  useEffect(() => {
    const getIp = async () =>
      (await (await fetch('https://ident.me/json')).json()).ip;

    const set = async () => setIp(await getIp());

    set();
  }, []);

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
