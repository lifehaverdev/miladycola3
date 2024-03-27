import { Fragment, useState, Dispatch, SetStateAction } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { PlusIcon } from '@heroicons/react/20/solid'
import Link from 'next/link';
import { cola3cont, cola2cont, colacont, ccipcont, vrfcont } from './documents'

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
  }

export interface DocumentationMenuProps {
    //setSelectedContent: React.Dispatch<React.SetStateAction<Element>>;
    setSelectedContent: React.Dispatch<React.SetStateAction<React.JSX.Element>>
}

const userNavigation = [
    {name: "well"}
]

export const navigation = [
    { name: 'MiladyColaV3', href:"#", content: cola3cont, current: true },
    { name: 'CCIP',href:"#", content: ccipcont, current: false },
    { name: 'VRF',href:"#", content: vrfcont, current: false },
    { name: 'MiladyColaV2', href:"#",content: cola2cont, current: false },
    { name: 'MiladyColaV1', href:"#",content: colacont, current: false },
  ]

export function DocumentationMenu({setSelectedContent}: DocumentationMenuProps) {
return (
    <Disclosure as="nav" className="bg-gray-800">
    {({ open }) => (
        <>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
            <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                </Disclosure.Button>
                </div>
                <div className="flex flex-shrink-0 items-center">
                <div className="flex mr-6 lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5">
                    <span className="sr-only">MiladyCola</span>
                    <p className="coke text-white">MiladyCola</p>
                    </Link>
                </div>
                </div>
                <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                {navigation.map((item) => (
                    <a
                    key={item.name}
                    href={item.href}
                    onClick={()=>{setSelectedContent(item.content)}}
                    className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                    >
                    {item.name}
                    </a>
                ))}
                </div>
            </div>
            <div className="flex items-center">
                <div className="flex-shrink-0">
                <button
                    type="button"
                    className="relative inline-flex items-center gap-x-1.5 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                    <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                    MINT
                </button>
                </div>
                <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                    <div>
                    <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        {/* <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" /> */}
                    </Menu.Button>
                    </div>
                    <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                    >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                            
                        </Menu.Item>
                        ))}
                    </Menu.Items>
                    </Transition>
                </Menu>
                </div>
            </div>
            </div>
        </div>

        <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {navigation.map((item) => (
                <Disclosure.Button
                key={item.name}
                href={item.href}
                onClick={()=>{setSelectedContent(item.content)}}
                as="a"
                className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                )}
                aria-current={item.current ? 'page' : undefined}
                >
                {item.name}
                </Disclosure.Button>
            ))}
            </div>
            
        </Disclosure.Panel>
        </>
    )}
    </Disclosure>
)
}