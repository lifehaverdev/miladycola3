'use client';

import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Team from '../components/elements/team';
// import Modal from '../components/elements/modal';
import Hero from '../components/crypto/hero';
import Feature from '../components/elements/feature';
import Stats from '../components/crypto/stats';
import Vending from '../components/crypto/vending';
import Profile from '../components/crypto/profile';
import SwitchChain from '../components/crypto/chainSwitch';
import Celebration from '../components/crypto/celebrate';

import { reviver, smol } from '../utils/biginter';

import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import wl from '../utils/wl';
import promoWl from '../utils/promo';

import { useReadContracts, useReadContract, useAccount, serialize } from 'wagmi';
import { ercMiladyCa, ercMiladyAbi, colaCa, colaAbi, raffleCa, raffleAbi, colaClassicCa, colaClassicAbi, colaV2Ca, colaV2Abi } from '../contract-config';
import React, { useEffect, useRef, useState } from 'react';

const Home: NextPage = () => {
  const chainId = 11155111;

  const account = useAccount(); // Retrieve the connected wallet account from the Wagmi context

  const [mintCard, mintSet] = useState(false);
  const [, chainSet] = useState(false);
  const [party, partySet] = useState(false);

  const celebrate = () => {
    mintSet(false);
  }

  const [walletInfo, setWalletInfo] = useState(
    {
      isFriend: false,
      isPromoFriend: false,
      liveBottles: 0,
      totalBottles: 0,
      friendProof: [''],
      promoProof: ['']
    }
  )

  let tree: MerkleTree;
  let promoTree: MerkleTree;
  let root:string;
  let promoRoot:string;

  const statsRef = useRef<HTMLDListElement>(null)

  const toggleOpen = () => {
    mintSet(!mintCard);
  };

  const makeMerkle = () => {
    const leaves = wl.map((x) => keccak256(x));
    tree = new MerkleTree(leaves, keccak256, {sortPairs: true});
    root = tree.getRoot().toString('hex');
    return {tree};
  }
  makeMerkle();

  const makePromoMerkle = () => {
    const promoLeaves = promoWl.map((x) => keccak256(x));
    promoTree = new MerkleTree(promoLeaves, keccak256, {sortPairs: true});
    promoRoot = tree.getRoot().toString('hex');
    return {tree};
  }
  makePromoMerkle();

  const makeProof = (address:any) => {
    const leaf = keccak256(address);
    const proof = tree.getHexProof(leaf);
    return proof
  }

  const makePromoProof = (address:any) => {
    const promoLeaf = keccak256(address);
    const promoProof = promoTree.getHexProof(promoLeaf);
    return promoProof
  }

  const isList = (address:any) => {
    return tree.verify(walletInfo.friendProof, keccak256(address), root)
  }

  const isPromoList = (address:any) => {
    return tree.verify(walletInfo.promoProof, keccak256(address), promoRoot)
  }

  const scrollToStats = () => {
    if (statsRef.current) {
      statsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const colaContract = {
    address: colaCa,
    abi: colaAbi,
    chainId: chainId
  } as const
  const raffleContract = {
    address: raffleCa,
    abi: raffleAbi,
    chainId: chainId
  } as const
  const miladyERC = {
    address: ercMiladyCa,
    abi: ercMiladyAbi,
    chainId: chainId
  } as const
  const colaClassicContract = {
    address: colaClassicCa,
    abi: colaClassicAbi,
    chainId: 1
  } as const
  const colaV2Contract = {
    address: colaV2Ca,
    abi: colaV2Abi,
    chainId: 1
  } as const
  const { data: result, error:multiError, isPending: multiStillReading, refetch } = useReadContracts({
    contracts: [
      {
        ...colaContract,
        functionName: 'saleOn',
      },
      {
        ...colaContract,
        functionName: 'promo',
      },
      {
        ...colaContract,
        functionName: 'totalSupply',
      },
      {
        ...colaContract,
        functionName: 'upForGrabs'
      },
      {
        ...colaContract,
        functionName: 'freeMints',
        args: [account?.address as `0x${string}`]
      },
      {
        ...colaContract,
        functionName: 'price'
      },
      {
        ...colaContract,
        functionName: 'friendPrice'
      },
      {
        ...colaContract,
        functionName: 'promoPrice'
      },
      {
        ...colaContract,
        functionName: 'cutOffBottle'
      },
      {
        ...colaContract,
        functionName: 'tokensOfOwner',
        args: [account?.address as `0x${string}`]
      },
      {
        ...colaClassicContract,
        functionName: 'balanceOf',
        args: [account?.address as `0x${string}`]
      },
      {
        ...colaV2Contract,
        functionName: 'balanceOf',
        args: [account?.address as `0x${string}`]
      },
      {
        ...raffleContract,
        functionName: 'readContest',
        args: [1]
      },
      {
        ...miladyERC,
        functionName: 'balanceOf',
        args: [raffleCa as `0x${string}`]
      }
    ]
  }); // Use the useReadContract hook to read the contract balance for the connected account

  useEffect(() => {
    refetch();
    //if(account){
      //console.log('account a go in useEffect',account.address);
      // v1Refetch()
      // v2Refetch()
    //}
    
    if (account.address) {
      makeMerkle();
      makePromoMerkle();
      setWalletInfo({
        ...walletInfo,
        friendProof: makeProof(account.address),
        promoProof: makePromoProof(account.address),
        isFriend: isList(account.address),
        isPromoFriend: isPromoList(account.address)
      })
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.address]) // Dependency array ensures this effect runs when the account changes

  const [
    saleOn, promo,
    totalSupply,
    upForGrabs, freeMintBalance,
    bottlePrice, friendPrice,
    promoPrice, cutOffBottle, v3Tokens, v1Balance,
    v2Balance,
    contestStats, contestBalance
  ] = result || []
  
  //console.log('cutOff number ',smol("cutOff",cutOffBottle.result))
  // bottleNoti.filter((x) => x.name != "Up For Grabs")
  let liveBottles;
  let totalBottles;
  if(v3Tokens && typeof v3Tokens.result != 'undefined' && cutOffBottle && typeof cutOffBottle.result != 'undefined'){
    liveBottles = v3Tokens?.result.filter((x) => x >= cutOffBottle?.result ).length
    totalBottles = v3Tokens.result.length;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>MiladyCola</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
        <link rel="shortcut icon" href="/favicon16x16.png" ></link>
      </Head>
      
      <main className="">

        {/* <Modal /> */}

        <SwitchChain setOpen={chainSet}/>

        <Hero scroll1={scrollToStats} mintOpen={toggleOpen} grabbies={upForGrabs} freebies={freeMintBalance} isPromoFriend={walletInfo.isPromoFriend} isFriend={walletInfo.isFriend} />

        <Stats contestStats={contestStats} bottlesMinted={totalSupply} accumulated={contestBalance} statsRef={statsRef}/>

        {liveBottles && liveBottles > 0 ? 
        <Profile liveBottles={liveBottles} contestStats={contestStats} totalBottles={totalBottles}/>
        :
        <></>
        }

        <Celebration open={party} setOpen={partySet} />

        <Vending open={mintCard} setOpen={mintSet} setCelebrate={partySet} proof={walletInfo.friendProof} promoProof={walletInfo.promoProof} grabbies={upForGrabs} freebies={freeMintBalance} isPromoFriend={walletInfo.isPromoFriend} isFriend={walletInfo.isFriend} totalSupply={totalSupply} contestStats={contestStats}/>

        <Feature />

        <Team />

      </main>

    </div>
  );
};

export default Home;
