import React from 'react';
import {smol} from '../../utils/biginter'

type Stat = {
  name: string;
  value: number;
};

type ContestArray = [winners: bigint, first: bigint, last: bigint, goldenTicket: bigint]

interface StatProps {
  bottlesMinted: { error: Error; result?: undefined; status: "failure"; } | { error?: undefined; result: bigint; status: "success"; } | undefined;
  accumulated: {
        error: Error;
        result?: undefined;
        status: "failure";
    } | {
        error?: undefined;
        result: unknown;
        status: "success";
    } | undefined;
  contestStats: {error: Error; result?: ContestArray; status: "success"} | {
        error: Error;
        result?: undefined;
        status: "failure";
    } | {
        error?: undefined;
        result: unknown;
        status: "success";
    } | {
        error?: Error;
        result: null;
        status: "null";
    } | undefined;
      statsRef: React.RefObject<HTMLDListElement>;
}

type StatPropAgain = {
  totalSupply: number;
  winners: number;
  accumulated: number;
  odds: number;
  statsRef: React.RefObject<HTMLDListElement>;
}

const Stats
//: React.FC<StatProps> 
= ({ bottlesMinted, accumulated, contestStats, statsRef }:StatProps) => {
  //console.log('stats props', bottlesMinted, accumulated, contestStats, statsRef)
  let odds = 1;
  let winners = 1;
  if(
  typeof contestStats != 'undefined' 
  && typeof contestStats.result != 'undefined'
  && contestStats.result != null
  ){
    const contestArray:Array<BigInt> = Object.values(contestStats.result)
    const end = smol('end',contestArray[2]);
    const start = smol('start',contestArray[1]);
    odds = parseFloat((1/(end - start)).toFixed(4));
    winners = smol('winners',contestArray[0]) + 1;
  }
  
  let stats: Stat[] = [
    { name: 'Bottles Minted', value: smol("totalSupply", bottlesMinted?.result) },
    //{ name: 'Bottles Minted', value: warChest },
    { name: 'MiladyCola Winners', value: winners},
    { name: 'Milady Accumulated', value: smol("raffleBalance", accumulated?.result) },
    //{ name: 'Milady Accumulated', value: warChest},
    { name: 'Current Raffle Odds', value: odds},
  ]
  
  return (
    <div id="stats" className="max-w-xl m-auto">
    <dl ref={statsRef} className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-4">
      {stats && stats.map((stat: Stat) => (
        <div
          key={stat.name}
          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8 p-4"
        >
          <dt className="text-sm font-medium leading-6 text-gray-500">{stat.name}</dt>
          <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900 text-right ml-auto">
            {stat.value === 0 ? 
            <div role="status">
                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
            : stat.value}
          </dd>
        </div>
      ))}
    </dl>
    </div>
  )
}

// const Stats: StatPropAgain = ({totalSupply, winners, accumulated, odds, statsRef}) => {
//   return(
    
//       {statBlock({totalSupply, winners, accumulated, odds, statsRef})}
    
//   )
// }

export default Stats