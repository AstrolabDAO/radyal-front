const DepositInto = () => {
  const [title, subtitle] = ['Stargate', 'Metastable'];
  const description = 'Algorithmically provides liquidity across stable pools on Stargate.Claiming of reward tokens, rebalancing  and compounding is automated.';
  return (
    <div className="flex flex-col basis-3/5">
      <div className="ms-3 mb-2 text-xl">INTO</div>
      <div className="flex flex-col m-0 p-3 border border-solid border-gray-500 rounded-3xl gilroy">
        <div className="font-bold italic text-4xl -mb-1"> { title } </div>
        <div className="font-light text-2xl"> { subtitle } </div>
        <div className="text-xs">
          { description }
        </div>
      </div>
    </div>
  )
}

export default DepositInto;