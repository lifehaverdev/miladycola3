import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { smol } from '../../utils/biginter';
//import { string } from 'prop-types'

type alert = {
    name: string;
    status: boolean;
    value: number;
    desc: string;
}

interface AlertProps {
  grabbies: { error: undefined; result: bigint; status: "success"; } | { error: Error; result: undefined; status: "failure"; } | undefined;
  freebies: { error: Error; result?: undefined; status: "failure"; } | { error: undefined; result: bigint; status: "success"; } | undefined;
  isPromoFriend: boolean
  isFriend: boolean
}

let bottleNoti: alert[] = [
    //{ name: "Up For Grabs", value: 0, status: true, desc: "FREE bottles availble while supplies last!"},
    //{ name: "Freebies", value: 0, status: true, desc: "You have FREE bottles with your name on them"},
    //{ name: "Promo Bottles", value: 0, status: true, desc: "Your community got you a discount!"},
    //{ name: "Friend", value: 0, status: true, desc:"You qualify for the friend discount"}
]

function alertNoti(
  bottleNoti: alert[], 
  grabbies: { error?: undefined; result: bigint; status: "success"; } | { error: Error; result?: undefined; status: "failure"; } | undefined, 
  freebies:{ error: Error; result?: undefined; status: "failure"; } | { error?: undefined; result: bigint; status: "success"; } | undefined, 
  isPromoFriend:boolean, isFriend:boolean) {
    if(grabbies && (smol("grabbies",grabbies.result) > 0 && grabbies.status != 'failure')) {
      //bottleNoti = bottleNoti.filter((x) => x.name != "Up For Grabs");
      bottleNoti.push({ name: "Up For Grabs", value: 0, status: true, desc: "FREE bottles availble while supplies last!"})
    }
    if(freebies && (smol("freebies",freebies.result) > 0 && freebies.status != 'failure')){
      //bottleNoti = bottleNoti.filter((x) => x.name != "Freebies");
      bottleNoti.push({ name: "Freebies", value: 0, status: true, desc: "You have FREE bottles with your name on them"})
    }
    if(isPromoFriend){
      //bottleNoti = bottleNoti.filter((x) => x.name != "Promo Bottles");
      bottleNoti.push({ name: "Promo Bottles", value: 0, status: true, desc: "Your community got you a discount!"})
    }
    if(isFriend){
      //bottleNoti = bottleNoti.filter((x) => x.name != "Friend");
      bottleNoti.push({ name: "Friend", value: 0, status: true, desc:"You qualify for the friend discount"})
    }
    // console.log('freebies in alerts', freebies);
    
    return (
        <div>
        {bottleNoti && bottleNoti.map((alert) => 
        <div id={alert.name} key={alert.name} className="rounded-md bg-green-50 p-2 m-4">
          <div className="flex">
          
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
            </div>
            
            <div className="ml-3">
              <p className="text-sm font-medium text-green-500">{alert.desc}</p>
            </div>
            
            
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  className="inline-flex rounded-md  p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50 bg-green-50"
                  onClick={() => {
                        const element = document.getElementById(alert.name);
                        if (element) {
                        element.style.display = 'none';
                        }
                    }}
                >
                  <span className="sr-only">Dismiss</span>
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          
          </div>
        </div>
        )}
        </div>
      )
}

export default function Alerts({grabbies,freebies,isPromoFriend,isFriend}:AlertProps) {
    return(
  <div className="fixed top-10 mx-auto mx-w-sm -translate-x-1/2 left-1/2">
    {alertNoti(bottleNoti,grabbies,freebies,isPromoFriend,isFriend)}
  </div>
    )
}
