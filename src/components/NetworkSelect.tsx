import ReactSelect, {
  components,
  OptionProps as ReactSelectOptionsProps,
  Props as ReactSelectProps,
  StylesConfig,

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
  const styleOptions: StylesConfig<NetworkSelectData> = {
    control: (baseStyles: any) => {
      return {
        ...baseStyles,
      backgroundColor: BACKGROUNDS.base,
      borderRadius: "0.375rem",
      height: "3rem",
    }},
    option: (baseStyles: any, { isFocused }) => ({
      ...baseStyles,
      backgroundColor: isFocused ? 'rgb(255 184 0 / var(--tw-bg-opacity));' : BACKGROUNDS.dark,
    })
  }
  return (
    <ReactSelect
      isMulti
      styles={styleOptions}
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
