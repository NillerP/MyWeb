import Head from 'next/head';
import styles from '../app/styles/Home.module.css';
import Nav from '@/app/components/Nav';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>My Next.js Website</title>
        <meta name="description" content="A simple website created with Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.navbar}>
      </div>
    
     
    </div>
  );
}
