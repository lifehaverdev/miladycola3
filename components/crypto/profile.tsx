import { smol } from '../../utils/biginter'
import { colaCa, colaAbi, chainId } from '../../contract-config';
import { useWriteContract, useReadContract } from 'wagmi';

type ContestArray = [winners: bigint, first: bigint, last: bigint, goldenTicket: bigint]

type ProfileProps = {
  v1Balance: { error: Error; result?: undefined; status: "failure"; } | { error?: undefined; result: unknown; status: "success"; } | undefined;
  v2Balance: { error: Error; result?: undefined; status: "failure"; } | { error?: undefined; result: unknown; status: "success"; } | undefined;
  liveBottles: number | undefined,
  contestStats: {error: undefined, result?: ContestArray, status: "success"} | {
    error: Error,
    result?: undefined;
    status: "failure";
} | {
    error?: undefined;
    result: unknown;
    status: "success";
} | {
    error?: Error;
    result: object;
    status: "failure";
} | undefined,
  totalBottles: number | undefined
}



  export default function Profile({v1Balance, v2Balance, liveBottles, contestStats, totalBottles}:ProfileProps) {
    const { data:hash, isPending, isSuccess, writeContract } = useWriteContract();
    let userBottles = 0;
    let depBottles = 0;
    let ruggedBottles = 0;
    let end = 0;
    let start = 0;
    if(
    typeof contestStats != 'undefined' 
    && typeof contestStats.result != 'undefined'
    && contestStats.result != null
    ){
      const contestArray:Array<BigInt> = Object.values(contestStats.result)
      end = smol('end',contestArray[2]);
      start = smol('start',contestArray[1]);
    }
    if(
      typeof liveBottles != 'undefined'
      && typeof v1Balance != 'undefined'
      && typeof v2Balance != 'undefined'
      && typeof totalBottles != 'undefined'
    ){
      depBottles = smol('v1Balance',v1Balance.result) + smol('v2Balance',v2Balance.result);
      userBottles = liveBottles + depBottles + 1;
      ruggedBottles = totalBottles - liveBottles + 1;
    }
    const stats = [
      { name: 'Live Bottles', stat: JSON.stringify(liveBottles) },
      { name: 'Odds to Win', stat: `${(userBottles*parseFloat((100/(end - start)).toFixed(4))).toFixed(4)}%` },
      { name: 'Total Bottles', stat: JSON.stringify(totalBottles) },
    ]

    const colaContract = {
      address: colaCa,
      abi: colaAbi,
      chainId: chainId
    } as const

    // const recycle = () => {
    //     //console.log(colaContract, BigInt(amount), parseEther(JSON.stringify(bottleAmount * priceInfo.bottlePrice)))
    //   writeContract(
    //     {
    //       ...colaContract,
    //       functionName: 'recycle',
    //     })
    // }

  const redeem = () => {
    writeContract({
      ...colaContract,
      functionName: 'depRedeem'
    })
  }
    // console.log(stats)
    return (
      <div>
        <h3 className="text-base font-semibold leading-6 text-gray-900">Your MiladyCola Bottle Tab</h3>
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats.map((item) => (
            <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
            </div>
          ))}
        </dl>
        { (liveBottles && userBottles > liveBottles) ? 
        depBottles > 0 ? <><button>REDEEM</button></> :
        ruggedBottles > 0 ? <><button>Recycle</button></> : <></> : <></>
        }
      </div>
      
    )
  }