import { NextPage } from 'next';
import Head from 'next/head';
import Header from '@/components/header';
import ChatBox from '@/components/chatbox';

const Home: NextPage = () => {
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
