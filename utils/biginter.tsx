import { serialize } from 'wagmi';

export const reviver = (serialized: any) => {
    serialized = JSON.parse(serialized);
      if (typeof serialized === 'object' && serialized.value !== null) {
        serialized = parseInt(serialized.value.value,10);
        if(serialized > 1000000000000000){
          return (serialized/1000000000000000000).toFixed(4);
        } else {
          return serialized
        }
      }
  };

export const smol = (key:string, value:(bigint | null | undefined | unknown)) => {
  if(typeof value == 'bigint'){
    return reviver(serialize({ key: key, value: value}))
  }
}

// export const solReviver = (serialized: any) => {
//   serialized = JSON.parse(serialized);
//   const deserialized:number = parseInt(serialized.value.value,10);
//   return deserialized;
// }