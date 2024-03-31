'use client'

import React, { Fragment, useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/20/solid';
import { useWriteContract, useReadContract, serialize, useWaitForTransactionReceipt } from 'wagmi';
  //useSimulateContract, useWaitForTransactionReceipt, 
  
import { colaCa, colaAbi } from '../../contract-config';
import { reviver } from '../../utils/biginter';
import { parseEther } from 'viem';

const product = {
  name: 'MiladyColaV3 Bottle',
  price: 'ETH',
  rating: 5,
  href: '#',
  description:
    'Every MiladyCola is bottled with LOVE! Are you feeling like a winner?',
  imageSrc: '/aurangesoda.png',
  imageAlt: 'Back angled view with bag open and handles to the side.',
}

function classNames(...classes:any) {
  return classes.filter(Boolean).join(' ')
}

type VendingProps = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    setCelebrate: React.Dispatch<React.SetStateAction<boolean>>
    proof: string[];
    promoProof: string[];
    grabbies:number; 
    freebies:number; 
    isFriend: boolean;
    isPromoFriend:boolean;
    totalSupply:number;
    lastBottle:number;
}

export default function Vending({ open, setOpen, setCelebrate, proof, promoProof, grabbies, freebies, isFriend, isPromoFriend, totalSupply,  lastBottle }:VendingProps) {
    const [priceInfo, setPriceInfo] = useState({
      bottlePrice: 0,
      friendPrice: 0,
      promoPrice: 0
    })  
    const [bottleAmount, setBottleAmount] = useState(1);
    const { data:hash, isPending, isSuccess, writeContract } = useWriteContract();
    const colaContract = {
        address: colaCa,
        abi: colaAbi
    } as const

    const readBottlePrice = useReadContract({
        ...colaContract,
        functionName: 'price'
    })

    const readFriendPrice = useReadContract({
        ...colaContract,
        functionName: 'friendPrice'
    })

    const readPromoPrice = useReadContract({
      ...colaContract,
      functionName: 'promoPrice'
    })


    // const {
    //   data: mintConfig,
    //   refetch,
    //   isLoading: isMintLoadingSimulate,
    //   isError: isMintErrorSimulate,
    //   error: mintErrorSimulate,
    // } = useSimulateContract({
    //   ...colaContract,
    //   args: [BigInt(bottleAmount)],
    //   functionName: 'mint',
    //   value: BigInt(priceInfo.bottlePrice * bottleAmount),
    // });
  
    // const {
    //   writeContractAsync,
    //   data: transactionHash,
    //   isPending: isLoadingWrite,
    //   isError: isErrorWrite,
    //   error: errorWrite,
    // } = useWriteContract();
  
    // const {
    //   isFetching: isFetchingReceipt,
    //   isLoading: isLoadingReceipt,
    //   data: receipt,
    //   isFetched,
    //   isSuccess,
    //   isError: isErrorReceipt,
    //   error: errorTransaction,
    // } = useWaitForTransactionReceipt({
    //   hash: transactionHash,
    // });
  
  // console.log('errorSimulate', errorSimulate)
  // console.log('errorWrite', errorWrite)
  // console.log('success ', isSuccess);
  // console.log('loading ', isLoadingReceipt);
  // console.log('fetch ', isFetched);
  // console.log('fetching ',isFetchingReceipt);

  const MintButton = () => {
    return (
      <div className="mt-6">
        <button
          className={`flex w-full items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white hover:bg-gayblue-700 focus:outline-none focus:ring-2 focus:ring-gayblue-500 focus:ring-offset-2 focus:ring-offset-gray-50 bg-gayblue-600 
                      ${isPending ? 'opacity-50 cursor-not-allowed': 
                      isSuccess ? 'bg-green-400' : 'bg-gayblue-600'}`}
          type="submit"
        >
          {
            isPending ? "Pending..." : 
            isPromoFriend ? "Promo Mint" : 
            isFriend ? "Friend Mint" : 
            grabbies > 0 ? "Grab Free Mint" :
            freebies > 0 ? "Freebie Mint" :
            isConfirming ? "Confirming..." :
            isConfirmed ? "The Bottles are on your Tab!" :
            "Mint"
          }
        </button>
        {hash && <div>Transaction Hash: <a href={`https://sepolia.etherscan.io/tx/${hash}`}>view on etherscan</a></div>}
      </div>
    )
  }
  

    const mint = (amount:number) => {
        //console.log(colaContract, BigInt(amount), parseEther(JSON.stringify(bottleAmount * priceInfo.bottlePrice)))
      writeContract(
        {
          ...colaContract,
          functionName: 'mint',
          args: [
              BigInt(amount)
          ],
          value: parseEther(JSON.stringify(bottleAmount * priceInfo.bottlePrice))
        })
    }

    const friendMint = (amount:number, proof:string[]) => {
      writeContract({
        ...colaContract,
        functionName: 'friendMint',
        args: [
          BigInt(amount),
          proof as readonly `0x${string}`[]
        ],
        value: parseEther(JSON.stringify(bottleAmount * priceInfo.friendPrice))
      })
    }

    const promoMint = (amount:number, promoProof:string[]) => {
      writeContract({
          ...colaContract,
        functionName: 'promoMint',
        args: [
          BigInt(amount),
          promoProof as readonly `0x${string}`[]
        ],
        value: parseEther(JSON.stringify(bottleAmount * priceInfo.promoPrice))
      })
    }

    const freebieMint = () => {
        writeContract({
            ...colaContract,
            functionName: 'freeMint'
        })
    }

    const grabMint = () => {
        writeContract({
            ...colaContract,
            functionName: 'grabMint'
        })
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } = 
      useWaitForTransactionReceipt({ 
        hash, 
    }) 

    const closeCard = (hash:string | null) => {
      setOpen(false)
      if(hash){
        setCelebrate(true);
      }
    }

    async function submit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault() 
      console.log('submitting?');
      if(grabbies > 0){
        grabMint();
      } else if (freebies > 0){
        freebieMint();
      } else if (isPromoFriend){
        promoMint(bottleAmount,promoProof);
      } else if (isFriend){
        friendMint(bottleAmount,proof);
      } else {
        mint(bottleAmount);
      }
    }

    useEffect(() => {
        //console.log(readFriendPrice,readBottlePrice);
        if(readFriendPrice.isSuccess === true){
            priceInfo.friendPrice = reviver(serialize({key: "friendPrice", value: readFriendPrice.data}));
        }
        if(readBottlePrice.isSuccess === true){
            priceInfo.bottlePrice = reviver(serialize({key: "bottlePrice", value: readBottlePrice.data}));
        }
        if(readPromoPrice.isSuccess === true){
          priceInfo.promoPrice = reviver(serialize({key: "promoPrice", value: readPromoPrice.data}))
        }
    })

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
                  <button
                    type="button"
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                    onClick={() => closeCard(hash as `0x${string}`)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                    <div className="sm:col-span-4 lg:col-span-5">
                      <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100">
                        <Image src={product.imageSrc} alt={product.imageAlt} className="object-cover object-center" width="600" height="600"/>
                      </div>
                    </div>
                    <div className="sm:col-span-8 lg:col-span-7">
                      <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">{product.name}</h2>
                      <section aria-labelledby="information-heading" className="mt-3">
                        <h3 id="information-heading" className="sr-only">
                          Product information
                        </h3>
                        <p className="text-2xl text-gray-900">{(() => {
                            if(freebies > 0){
                                return 0
                            }
                            if(grabbies > 0){
                                return 0
                            }
                            if(isPromoFriend) {
                              return (priceInfo.promoPrice * bottleAmount).toFixed(5);
                            } 
                            if(isFriend) {
                                return (priceInfo.friendPrice * bottleAmount).toFixed(5);
                            }   
                            return (priceInfo.bottlePrice * bottleAmount).toFixed(5);
                        })()}
                        {product.price}</p>
                        <div className="mt-3">
                          <h4 className="sr-only">Reviews</h4>
                          <div className="flex items-center">
                            <div className="flex items-center">
                              {[0, 1, 2, 3, 4].map((rating) => (
                                <StarIcon
                                  key={rating}
                                  className={classNames(
                                    product.rating > rating ? 'text-gray-400' : 'text-gray-200',
                                    'h-5 w-5 flex-shrink-0'
                                  )}
                                  aria-hidden="true"
                                />
                              ))}
                            </div>
                            <p className="sr-only">{product.rating} out of 5 stars</p>
                          </div>
                        </div>
                        <div className="mt-6">
                          <h4 className="sr-only">Description</h4>
                          <p className="text-sm text-gray-700">{product.description}</p>
                        </div>
                      </section>
                      <section aria-labelledby="options-heading" className="mt-6">
                        {
                                    (freebies > 0 || grabbies > 0) ?
                                    (
                                      <MintButton/>
                                    ):(
                                      <div>
                                      <h3 id="options-heading" className="sr-only">
                                        Product options
                                      </h3>
                                      <form 
                                        className="max-w-xs mx-auto"
                                        onSubmit={submit}
                                        >
                                          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Choose quantity:</label>
                                          <div className="relative flex items-center max-w-[11rem]">
                                              <button onClick={() => {setBottleAmount(bottleAmount - 1)}} disabled={bottleAmount==0}
                                              type="button" id="decrement-button" data-input-counter-decrement="bottles-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                                                  <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                                                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                                                  </svg>
                                              </button>
                                              <input type="text" id="bottles-input" data-input-counter data-input-counter-min="1" data-input-counter-max="5" aria-describedby="helper-text-explanation" className="bg-gray-50 border-x-0 border-gray-300 h-11 font-medium text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full pb-6 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                  placeholder="" 
                                                  value={bottleAmount}
                                                  required
                                                  readOnly
                                                  />
                                              <button 
                                              onClick={() => {setBottleAmount(bottleAmount + 1);}}
                                              disabled={totalSupply + bottleAmount == lastBottle}

                                              type="button" id="increment-button" data-input-counter-increment="bottles-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                                                  <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                                                  </svg>
                                              </button>
                                          </div>
                                          <p id="helper-text-explanation" className="mt-2 text-sm text-gray-500 dark:text-gray-400">Please select the number of bottles</p>
                                          <MintButton/>
                                      </form>
                                      </div>
                                      )
                                    }
                      </section>

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
}
