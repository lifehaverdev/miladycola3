'use client'

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Function to generate random position
const getRandomPosition = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const randomX = Math.floor(Math.random() * (screenWidth - 50));
    const randomY = Math.floor(Math.random() * (screenHeight - 50));
    return { x: randomX, y: randomY };
};

type CelebrationProps = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Celebration = ({open, setOpen}:CelebrationProps) => {
    const [gifPositions, setGifPositions] = useState([{x: 0, y: 0}]);
    //const [topPix, setTopPix] = useState(0)
      // Generate random positions for gifs when the dialog opens
  useEffect(() => {
    if (open) {
      const newGifPositions = Array.from({ length: 15 }, () => getRandomPosition());
      setGifPositions(newGifPositions);
      //setTopPix(calcTopPix());
    }
  }, [open]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 overflow-y-auto" onClose={setOpen}>
        {/* <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"> */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-80 transition-opacity md:block sm:bg-gray-900" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          {gifPositions.map((position, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={index}
                  src={`/gifs/gif${index}.gif`}
                  alt={`GIF ${index}`}
                  className="absolute z-2"
                  style={{ left: position.x, top: position.y }}
                />
              ))}
          <div className="flex items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              enterTo="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 md:scale-100"
              leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            >
              <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
                
                <div className="relative flex w-full items-center h-1/3 overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8"
                    // style={{"top": `${ window ? (window.innerHeight/2)-(window.innerHeight/3) : 100}px`}} //doesnt load all teh time
                    style={{'top': '200px'}}
                >
                    <button
                        type="button"
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                        onClick={() => setOpen(false)}
                    >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                        <div className="block items-center justify-between">
                            <h2 className="text-lg font-bold">LET EM KNOW! &#128495;</h2>
                            <p className="mt-6 text-sm text-gray-500">AFFRIM: I JUST MINTED THE WINNING @MILADYCOLA BOTTLE SO DONT EVEN BOTHER</p>
                            <button
                                className="rounded-md mt-6 bg-gayblue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gayblue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                <a className="twitter-share-button"
                                href={`https://twitter.com/intent/tweet?text=I%20just%20minted%20the%20winning%20@miladycola%20bottle%20so%20dont%20even%20bother`}
                                data-size={"large"}
                                >TWEET IT</a>
                            </button>
                        </div>
                    </div>
                    </Dialog.Panel>
                </Transition.Child>
            </div>
          </div>
        {/* </div> */}
      </Dialog>
    </Transition.Root>
  );
};

export default Celebration;