import { GiftIcon, Cog8ToothIcon, FireIcon } from '@heroicons/react/20/solid'
import Image from 'next/image';
import { useState, useEffect } from 'react';

const features = [
  {
    name: 'Your Ticket to a Milady',
    description:
      'Every bottle is a chance to win Milady. Once the ticket slots are minted, we draw the prize and the winning bottle number gets sent 1.01 MILADY ERC20',
    icon: GiftIcon,
  },
  {
    name: 'Gas Optimized',
    description: 'No more burning bottles to play, No more balanceOf checks on mint, just the pure ERC721A taste of falling-up sent right to your wallet.',
    icon: Cog8ToothIcon,
  },
  {
    name: 'Recycle your bottle for more fun prizes.',
    description: 'Even if you are a LOSER and the metadata of your bottle is removed after the drawing, you can recycle here to win consolation prizes because we feel sorry for you.',
    icon: FireIcon,
  },
]

export default function Feature() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
    // Function to update state based on window width
    const handleWindowResize = () => {
      setIsSmallScreen(window.innerWidth <= 767);
    };
  
    // Listen for window resize events and update state accordingly
    useEffect(() => {
      handleWindowResize(); // Call initially to set initial state
      window.addEventListener('resize', handleWindowResize); // Add event listener
      return () => {
        window.removeEventListener('resize', handleWindowResize); // Remove event listener on component unmount
      };
    }, []);
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-gayblue-600">Introducing</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">MILADYCOLAv3</p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                This is it. It has never been simpler to win a milady with onchain verifiably random drawings. Whitelisted projects for discounted mint price include Milady, Remilio, Banners, Fumo, Radbro, Oekaki, Kawaiimi, MiladyStation, and so many more!
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <feature.icon className="absolute left-1 top-1 h-5 w-5 text-gayblue-600" aria-hidden="true" />
                      {feature.name}
                    </dt>{' '}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div >
            <Image
              src="/aurangesoda.png"
              alt="Product screenshot"
              className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
              width={2432}
              height={1442}
              style={isSmallScreen ? {
                
                width: '100%', // Set the default width to 100%
                height: 'auto', // Set the default height to auto to maintain aspect ratio
              } : {}}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
