
  type ProfileProps = {
    liveBottles: number,
    odds: number,
    totalBottles: number
  }

  export default function Profile({liveBottles, odds, totalBottles}:ProfileProps) {
    const stats = [
        { name: 'Live Bottles', stat: JSON.stringify(liveBottles) },
        { name: 'Odds to Win', stat: `${(liveBottles*(1/odds)*100).toFixed(4)}%` },
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