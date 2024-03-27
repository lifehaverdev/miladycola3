const reviver = (serialized: any) => {
    serialized = JSON.parse(serialized);
      if (typeof serialized === 'object' && serialized.value !== null && '__type' in serialized.value && serialized.value.__type === 'bigint') {
        serialized = parseInt(serialized.value.value,10);
        if(serialized > 1000000000000000){
          return (serialized/1000000000000000000).toFixed(4);
        } else {
          return serialized
        }
      }
  };

  export default reviver