import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Documentation from "../components/elements/documentation/docs";

const Docs: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>MiladyCola Docs</title>
        <meta
          content="Secret Dr. Remilio Recipe"
          name="How MiladyCola Bottles are Made"
        />
        <link rel="shortcut icon" href="/public/cola.gif" ></link>
      </Head>

      <main className="">
        <Documentation />
      </main>
    </div>
  );
};

export default Docs;
