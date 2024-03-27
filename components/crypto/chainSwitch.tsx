import { useSwitchChain, useChainId } from 'wagmi';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

type SwitchChainProps = {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function SwitchChain({setOpen}:SwitchChainProps) {
    const chainId = useChainId();
    let open = false;
    
    const { switchChain } = useSwitchChain()
    if(chainId != 11155111){
        open = true
        return (
            <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
              </Transition.Child>
      
              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
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
                      <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                            <div className="sm:rounded-lg lg:w-full">
                                <div className="px-4 py-5 w-11/12 sm:p-6">
                                    <h3 className="text-base font-semibold leading-6 text-gray-900">WRONG CHAIN</h3>
                                    <div className="mt-2 sm:flex sm:items-start sm:justify-between">
                                        <div className="max-w-xl text-sm text-gray-500">
                                            <p>
                                            MiladyColaV3 is under construction. Please switch to sepolia ethereum.
                                            </p>
                                        </div>
                                        <div className="mt-5 ml-9 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
                                            <button
                                            type="button"
                                            className="inline-flex items-center rounded-md bg-gayblue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gayblue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gayblue-500"
                                            onClick={() => switchChain({ chainId: 11155111 })}
                                            >
                                            Change Chain
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>
        )
    } else {return}
  }