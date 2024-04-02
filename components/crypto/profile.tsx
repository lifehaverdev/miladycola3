import { smol } from '../../utils/biginter'

type ContestArray = [winners: bigint, first: bigint, last: bigint, goldenTicket: bigint]

type ProfileProps = {
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

  export default function Profile({liveBottles, contestStats, totalBottles}:ProfileProps) {
    let userBottles = 0;
    let end = 0;
    let start = 0;
    if(
      typeof liveBottles != 'undefined' 
    && typeof contestStats != 'undefined' 
    && typeof contestStats.result != 'undefined'
    && contestStats.result != null
    ){
      const contestArray:Array<BigInt> = Object.values(contestStats.result)
      userBottles = liveBottles;
      end = smol('end',contestArray[2]);
      start = smol('start',contestArray[1]);
    }
    const stats = [
      { name: 'Live Bottles', stat: JSON.stringify(liveBottles) },
      { name: 'Odds to Win', stat: `${(userBottles*parseFloat((1/(end - start)).toFixed(4)))}%` },
      { name: 'Total Bottles', stat: JSON.stringify(totalBottles) },
    ]
    console.log(stats)
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
      </div>
    )
  }