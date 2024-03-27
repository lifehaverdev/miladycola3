import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Team from '../components/elements/team';
// import Modal from '../components/elements/modal';
import Hero from '../components/crypto/hero';
import Feature from '../components/elements/feature';
import Stats from '../components/crypto/stats';
import Vending from '../components/crypto/vending';
import SwitchChain from '../components/crypto/chainSwitch';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import wl from '../utils/wl';
import reviver from '../utils/biginter';

import { useReadContracts, useAccount, serialize } from 'wagmi';
import { ercMiladyCa, ercMiladyAbi, colaCa, colaAbi, raffleCa, raffleAbi } from '../contract-config';
import React, { useEffect, useRef, useState } from 'react';

const Home: NextPage = () => {

  const [mintCard, mintSet] = useState(false);
  const [, chainSet] = useState(false);

  const saleOn = useRef<boolean>(false);
  const promo = useRef<boolean>(false);
  const grabbies = useRef<number>(0);
  const freebies = useRef<number>(0);
  const isPromoFriend = useRef<boolean>(false);
  const isFriend = useRef<boolean>(false);
  const bottlesMinted = useRef<number>(0);  
  const winners: number = 1;
  const odds = useRef<number>(0);
  const accumulated = useRef<number>(0);
  // const root = useRef<any>();
  // const promoRoot = useRef<any>();

  let siteRoot: any;
  let tree: MerkleTree;
  let root:string;
  let proof = useRef<string[]>([]);
  let promoProof = useRef<string[]>([]);

  const statsRef = useRef<HTMLDListElement>(null)

  const toggleOpen = () => {
    mintSet(!mintCard);
  };

  const makeMerkle = () => {
    const leaves = wl.map((address) => keccak256(address));
    tree = new MerkleTree(leaves, keccak256, {sortPairs: true});
    root = tree.getRoot().toString('hex');
    //const leaf = keccak256(account.address);
    //const proof = tree.getProof(leaf);
    //console.log(siteRoot);
    return {tree,siteRoot,proof,isFriend};
  }

  const makeProof = (address:any) => {
    const leaf = keccak256(address);
    const proof = tree.getHexProof(leaf);
    // console.log(proof);
    return proof
  }

  const isList = (address:any) => {
    //console.log('isList',MerkleTree.verify(proof.current,keccak256(address),root));
    //console.log(keccak256(address).toString('hex'));
    //console.log(root);
    return tree.verify(proof.current, keccak256(address), root)
  }

  const scrollToStats = () => {
    if (statsRef.current) {
      statsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const account = useAccount(); // Retrieve the connected wallet account from the Wagmi context
  const colaContract = {
    address: colaCa,
    abi: colaAbi
  } as const
  const raffleContract = {
    address: raffleCa,
    abi: raffleAbi
  } as const
  const miladyERC = {
    address: ercMiladyCa,
    abi: ercMiladyAbi
  } as const
  const { data: result, refetch } = useReadContracts({
    contracts: [
      {
        ...colaContract,
        functionName: 'totalSupply',
      },
      {
        ...colaContract,
        functionName: 'saleOn',
      },
      {
        ...colaContract,
        functionName: 'isPromo',
      },
      {
      ...raffleContract,
      functionName: 'odds'
      },
      {
        ...miladyERC,
        functionName: 'balanceOf',
        args: ["0x6A0a993cc824457734EC7Cac50744a34EcAf34D4"]
      }
    ]
  }); // Use the useReadContract hook to read the contract balance for the connected account

  useEffect(() => {
    
    // Trigger the read contract operation when the account changes (i.e., when the user connects their wallet)
    if (account) {
      refetch();
      makeMerkle();
      // console.log(account.addresses);
      //proof = makeProof(account.addresses?.[0]);
    }
    if(result){
      if(result[0].status == 'success'){
        bottlesMinted.current = reviver(serialize({ key: "bottlesMinted", value: result[0].result}));
      }
      if(result[1].status == 'success'){
        if(typeof result[1].result == 'boolean'){
          saleOn.current = result[1].result;
        }
      }
      if(result[2].status == 'success'){
        if(typeof result[2].result == 'boolean'){
          promo.current = result[2].result;
        }
      }
      if(result[3].status == 'success'){
        odds.current = reviver(serialize({key: "odds", value: result[3].result}));
      }
      if(result[4].status == 'success'){
        accumulated.current = reviver(serialize({key: "accumulated", value: result[4].result}));
      }

    }
    proof.current = makeProof(account.address);
    isFriend.current = isList(account.address);
    grabbies.current = 0;
    freebies.current = 0;
    isPromoFriend.current = false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]); // Dependency array ensures this effect runs when the account changes


  return (
    <div className={styles.container}>
      <Head>
        <title>MiladyCola</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
        <link rel="shortcut icon" href="/public/cola.gif" ></link>
      </Head>
      
      <main className="">

        {/* <Modal /> */}

        <SwitchChain setOpen={chainSet}/>

        <Hero scroll1={scrollToStats} mintOpen={toggleOpen} grabbies={grabbies} freebies={freebies} isPromoFriend={isPromoFriend} isFriend={isFriend} />

        <Stats bottlesMinted={bottlesMinted.current} winners={winners} accumulated={accumulated.current} odds={odds.current} statsRef={statsRef}/>

        <Vending open={mintCard} setOpen={mintSet} proof={proof.current} promoProof={promoProof.current} grabbies={grabbies} freebies={freebies} isPromoFriend={isPromoFriend} isFriend={isFriend} />

        <Feature />

        <Team />

        
      </main>
      

    </div>
  );
};

export default Home;
