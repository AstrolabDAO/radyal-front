import { WalletIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import IconGroup from "~/components/IconGroup";

type DepositSwapBlockProps = {
  disabled?: boolean;
  label: string;
  symbol: string,
  network: string,
  children: React.ReactNode;
  icons: { background: string, foreground: string };
  onTokenClick: () => void;
}

const DepositSwapBlock = ({
  label,
  symbol,
  icons,
  network,
  children,
  disabled,
  onTokenClick,
} : DepositSwapBlockProps) => {

  const balance = 245000000;
  const dollarEquivalent = 0;

  const iconGroup = [
    { url: icons.background, alt: symbol, },
    { url: icons.foreground, alt: network, small: true },
  ];

  return (
    <div className="flex flex-col my-3">
      <div className="mb-1">{ label }</div>
      <div className="flex flex-col md:flex-row p-3 border border-solid border-gray-500 rounded-xl bg-dark-600">
        <div className={
          clsx("flex flex-row rounded-xl bg-gray-500 px-3 cursor-pointer my-auto py-2",
          { "hover:bg-primary hover:text-dark" : !disabled },
        )}
          onClick={ onTokenClick }
        >
          <div className="my-auto">
            <IconGroup icons={ iconGroup }/>
          </div>
          <div className="flex flex-col ps-3 py-3 bg-medium my-auto">
            <div className="text-2xl font-bold">{ symbol }</div>
            <div className="-mt-2 w-32">on { network }</div>
          </div>
        </div>
        <div className="flex flex-col ms-auto my-auto text-right">
          <div className="text-sm flex flex-row align-middle ms-auto bg-gray-200 rounded px-1">
            <WalletIcon className="flex me-1 my-auto h-4 w-4"/>
            <span className="flex my-auto"> { balance } </span>
          </div>
          <div className="flex ms-auto ms-auto">
            { children }
          </div>
          <div className="text-sm text-gray font-bold">~{ dollarEquivalent }</div>
        </div>
      </div>
    </div>
  )
}

export default DepositSwapBlock;