import ReactSelect, {
  components,
  OptionProps as ReactSelectOptionsProps,
  Props as ReactSelectProps,

} from "react-select";
import { BACKGROUNDS } from "~/styles/constants";
import { Network } from "~/utils/interfaces";



const Option = ({ ...props }: OptionProps) => {
  const { network } = props.data;
  return (
    <components.Option data={network.slug} {...props}>
      <div className="flex whitespace-nowrap">
        <img
          src={network.icon}
          style={{ width: 20, height: 20, marginRight: 10 }}
        />
        {network.name}
      </div>
    </components.Option>
  );
};



const NetworkSelect = ({ networks, ...props }: NetworkSelectProps) => {
  console.log("🚀 ~ file: NetworkSelect.tsx:44 ~ NetworkSelect ~ COLORS_PALETTE:", COLORS_PALETTE["base-550"])
  return (
    <ReactSelect
      isMulti
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          borderRadius: "0.375rem",
          height: "3rem",
          backgroundColor: BACKGROUNDS.base,
        }),
        option: (baseStyles, {  isFocused }) => ({
          ...baseStyles,
          backgroundColor: isFocused ? COLORS_PALETTE["base-550"] : COLORS_PALETTE["base"],
          
          
        })
      }}
      options={networks.map((network) => ({
        value: network.slug,
        label: <img src={network.icon} width={20} height={20} />,
        network: network,
      }))}
      components={{ Option }}
      {...props}
    />
  );
};

interface NetworkSelectProps extends ReactSelectProps {
  networks: Network[];
}

export interface NetworkSelectData {
  value: string;
  label: any;
  network: Network;
}
interface OptionProps extends ReactSelectOptionsProps {
  data: NetworkSelectData;
}

export default NetworkSelect;
