import ReactSelect, {
  components,
  OptionProps as ReactSelectOptionsProps,
  Props as ReactSelectProps,
} from "react-select";

import { Network } from "~/utils/interfaces";

export interface NetworkSelectData {
  value: string;
  label: any;
  network: Network;
}
interface OptionProps extends ReactSelectOptionsProps {
  data: NetworkSelectData;
}

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

interface NetworkSelectProps extends ReactSelectProps {
  networks: Network[];
}
const NetworkSelect = ({ networks, ...props }: NetworkSelectProps) => {
  return (
    <ReactSelect
      isMulti
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          borderRadius: "0.375rem",
          height: "3rem",
        }),
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

export default NetworkSelect;
