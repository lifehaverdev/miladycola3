import { Disclosure } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'

const faqs = [
  {
    question: "How do I win the Milady?",
    answer:
      "Just by a bottle (or several) and cross your fingers!",
  },
  {
    question: "Can I Redeem my V1 and V2 Bottles?",
    answer: "Yes absolutely. Under your profile, click the Redeem button. You will receive 1 for 1."
  },
  {
    question: "Where do I burn now?",
    answer: "Burning bottles to mint caps is no longer required. Simply mint a bottle and you now have a live ticket for the contest or an upcoming contest."
  },
  {
    question: "What happens to my bottle when the contest ends?",
    answer: "I am going to rug the metadata. If you really like the bottle you can either retire it for free before the contest ends or afterwards for a fee to restore its metadata."
  },
  {
    question: "What happens when I win?",
    answer: "The owner of the winning bottle token ID will be able to claim their 1.01 MILADY erc20 to do with as they please. (please redeem from NFTX vault and tell us which one you got tho...)"
  }
//   {
//     question:,
//     answer:
//   },
  // More questions...
]

export default function FAQ() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">Frequently asked questions</h2>
          <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
            {faqs.map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt>
                      <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                        <span className="text-base font-semibold leading-7">{faq.question}</span>
                        <span className="ml-6 flex h-7 items-center">
                          {open ? (
                            <MinusIcon className="h-6 w-6" aria-hidden="true" />
                          ) : (
                            <PlusIcon className="h-6 w-6" aria-hidden="true" />
                          )}
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
