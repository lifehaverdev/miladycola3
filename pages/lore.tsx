import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Lore from "../components/elements/content";

const Docs: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>MiladyCola Lore</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
        <link rel="shortcut icon" href="/public/cola.gif" ></link>
      </Head>

      <main className="">
        <Lore />
      </main>
    </div>
  );
};

export default Docs;
