import { useState } from "react";
import { useWeb3ModalState } from '@web3modal/wagmi/react'

import { swap } from "../utils/squid";


const TestPage = () => {
  const { selectedNetworkId } = useWeb3ModalState()
  console.log(selectedNetworkId)
  const [state, setState] = useState('initial');
  return (
    <div>
      <h1>{state}</h1>
      <button onClick={() => setState('test')}>update</button>
      <br/>
      <button onClick={() => swap()}>swap</button>
    </div>
  )
};

export default TestPage;
