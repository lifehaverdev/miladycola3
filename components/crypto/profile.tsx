import { smol } from '../../utils/biginter'

type ContestArray = [winners: bigint, first: bigint, last: bigint, goldenTicket: bigint]

type ProfileProps = {
  liveBottles: number | undefined,
  contestStats: {error: Error, result?: ContestArray, status: "success"} | {
    error: Error,
    result?: undefined;
    status: "failure";
} | {
    error?: undefined;
    result: unknown;
    status: "success";
} | {
    error?: undefined;
    result: ContestArray;
    status: "success";
} | undefined,
  totalBottles: number
}

  export default function Profile({liveBottles, contestStats, totalBottles}:ProfileProps) {
    const stats = [
        { name: 'Live Bottles', stat: JSON.stringify(liveBottles) },
        { name: 'Odds to Win', stat: `${(liveBottles*parseFloat((1/smol("end",contestStats?.result[2] - contestStats?.result[1])).toFixed(4)))}%` },
        { name: 'Total Bottles', stat: JSON.stringify(totalBottles) },
      ]
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