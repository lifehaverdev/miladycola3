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

  const account = useAccount(); // Retrieve the connected wallet account from the Wagmi context

  const [mintCard, mintSet] = useState(false);
  const [, chainSet] = useState(false);
  const [party, partySet] = useState(false);

  const celebrate = () => {
    mintSet(false);
    
  }

  const [colaInfo, setColaInfo] = useState(
    {
      saleOn: false,
      promo: false,
      grabbies: 0,
      freebies: 0,
      bottlesMinted: 0
    }
  )

  const [raffleInfo, setRaffleInfo] = useState(
    {
      winners: 1, //make 0 later
      odds: 26,
      accumulated: 0,
      cutoff: 4,
      end: 30,
    }
  )

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
  const colaClassicContract = {
    address: colaClassicCa,
    abi: colaClassicAbi
  } as const
  const colaV2Contract = {
    address: colaV2Ca,
    abi: colaV2Abi
  } as const
  const { data: result, isPending, refetch } = useReadContracts({
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
        functionName: 'promo',
      },
      {
        ...colaContract,
        functionName: 'upForGrabs'
      },
      {
        ...miladyERC,
        functionName: 'balanceOf',
        args: [raffleCa]
      },
      {
        ...raffleContract,
        functionName: 'readContest',
        args: [BigInt(1)]
      }
    ]
  }); // Use the useReadContract hook to read the contract balance for the connected account

  const freeMints = useReadContract({
    ...colaContract,
    query: {enabled: !!account},
    functionName: 'freeMints',
    args: [account.address as `0x${string}`]
  })

  const v3Bottles = useReadContract({
    ...colaContract,
    query: {enabled: !!account},
    functionName: 'tokensOfOwner',
    args: [account.address as `0x${string}`]
  })

  const v1Bottles = useReadContract({
    ...colaClassicContract,
    query: {enabled: !!account},
    functionName: 'balanceOf',
    args: [account.address as `0x${string}`]
  })

  const v2Bottles = useReadContract({
    ...colaV2Contract,
    query: {enabled: !!account},
    functionName: 'balanceOf',
    args: [account.address as `0x${string}`]
  })

  useEffect(() => {
    refetch();
    walletInfo.totalBottles = 0;
    //console.log(game);
    // Trigger the read contract operation when the account changes (i.e., when the user connects their wallet)
    if (account.address) {
      makeMerkle();
      makePromoMerkle();
      if(freeMints.isSuccess == true){
        colaInfo.freebies = smol("freebies", freeMints.data);
      }
      if(v1Bottles.isSuccess == true){
        walletInfo.totalBottles += reviver(serialize({ key: "v1Bottles", value: v1Bottles.data}))
      }
      if(v2Bottles.isSuccess == true){
        walletInfo.totalBottles += reviver(serialize({ key: "v2Bottles", value: v2Bottles.data}));
      }
      if(v3Bottles.isSuccess == true){
        const allV3Bottles = v3Bottles.data.map((id) => {return reviver(serialize({key: "bottleId", value: id}))})
        const liveBottleIds = allV3Bottles.filter((x) => x >= raffleInfo.cutoff);
        // setWalletInfo({
        //   ...walletInfo,
        //   liveBottles: liveBottleIds.length,
        //   totalBottles: allV3Bottles.length
        // }) //idk why this doesnt work tbh
        walletInfo.liveBottles = liveBottleIds.length;
        walletInfo.totalBottles += allV3Bottles.length;
        //console.log('v3 total ', walletInfo.totalBottles)
      }
      setWalletInfo({
        ...walletInfo,
        friendProof: makeProof(account.address),
        promoProof: makePromoProof(account.address),
        isFriend: isList(account.address),
        isPromoFriend: colaInfo.promo && isPromoList(account.address)
      })
    }
    if(result){
      console.log(result);
      if(result[0].status == 'success'){
        colaInfo.bottlesMinted = reviver(serialize({ key: "bottlesMinted", value: result[0].result}));
      }
      //saleOn
      if(result[1].status == 'success'){
        //console.log('saleOn result ',result[1].result);
        if(typeof result[1].result == 'boolean'){
          colaInfo.saleOn = result[1].result
        }
      }
      if(result[2].status == 'success'){
        if(typeof result[2].result == 'boolean'){
          colaInfo.promo = result[2].result;
        }
      }
      if(result[3].status == 'success'){
        colaInfo.grabbies = reviver(serialize({ key: "upForGrabs", value: result[3].result}));
      }
      if(result[4].status == 'success'){
        raffleInfo.accumulated = reviver(serialize({key: "accumulated", value: result[4].result}));
      }
      if(result[5].status == 'success'){
        console.log(result[5].result)
        // if(result[6].result.length > 0)
        //   const end = reviver(serialize({key: "end", value: result[6].result[0]}))
        //   const start = reviver(serialize({key: "start", value: result[6].result[1]}));
        //   setRaffleInfo({
        //     ...raffleInfo,
        //       winners: 1, //make 0 later
        //       odds: end - start,
        //       cutoff: reviver(serialize({key: "start", value: result[6].result[5]})),
        //       end: 0,
        //   })
      }
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.address]) // Dependency array ensures this effect runs when the account changes

  // setColaInfo({
  //   ...colaInfo,
  //   freebies: smol("freebies",freeMints.data)
  // })

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

        <Hero scroll1={scrollToStats} mintOpen={toggleOpen} grabbies={colaInfo.grabbies} freebies={colaInfo.freebies} isPromoFriend={walletInfo.isPromoFriend} isFriend={walletInfo.isFriend} />

        <Stats bottlesMinted={colaInfo.bottlesMinted} winners={raffleInfo.winners} accumulated={raffleInfo.accumulated} odds={raffleInfo.odds} statsRef={statsRef}/>

        {walletInfo.liveBottles > 0 ? 
        <Profile liveBottles={walletInfo.liveBottles} odds={raffleInfo.odds} totalBottles={walletInfo.totalBottles}/>
        :
        <></>
        }

        <Celebration open={party} setOpen={partySet} />

        <Vending open={mintCard} setOpen={mintSet} setCelebrate={partySet} proof={walletInfo.friendProof} promoProof={walletInfo.promoProof} grabbies={colaInfo.grabbies} freebies={colaInfo.freebies} isPromoFriend={walletInfo.isPromoFriend} isFriend={walletInfo.isFriend} totalSupply={colaInfo.bottlesMinted} lastBottle={raffleInfo.end}/>

        <Feature />

        <Team />

      </main>

    </div>
  );
};

export default Home;
