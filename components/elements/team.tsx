import Image from "next/image";

const people = [
    {
      name: 'Arthurt McDonald',
      role: 'Co-Founder / Lead Developer',
      imageUrl:
        '/arthurt.png',
    },
    {
      name: 'Angel Eyes',
      role: 'Co-Founder / Artist Visionary',
      imageUrl:
        '/angel.jpeg',
    },
    // More people...
  ]
  
  export default function Team() {
    return (
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Meet the Team</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              These two miladys have given everything they have to make MiladyCola a reality.
            </p>
          </div>
          <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
            {people.map((person) => (
              <li key={person.name}>
                <div className="flex items-center gap-x-6">
                  <Image width="12" height="12" alt="headshot" className="h-16 w-16 rounded-full" src={person.imageUrl} />
                  <div>
                    <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">{person.name}</h3>
                    <p className="text-sm font-semibold leading-6 text-gayblue-600">{person.role}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
  