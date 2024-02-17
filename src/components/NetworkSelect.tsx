import clsx from "clsx";
import ReactSelect, {
  components,
  OptionProps as ReactSelectOptionsProps,
  Props as ReactSelectProps,
  StylesConfig,
} from "react-select";
import { COLORS } from "~/styles/constants";
import { Network } from "~/utils/interfaces";

const Option = ({ ...props }: OptionProps) => {
  const { network } = props.data;
  return (
    <components.Option data={network.slug} {...props}>
      <div className="flex whitespace-nowrap bg-transparent">
        <img
          src={network.icon}
          style={{ width: 20, height: 20, marginRight: 10 }}
        />
        {network.name}
      </div>
    </components.Option>
  );
};

const NetworkSelect = ({
  networks,
  className,
  ...props
}: NetworkSelectProps) => {
  const styleOptions: StylesConfig<NetworkSelectData> = {
    control: (baseStyles: any) => ({
      ...baseStyles,
      backgroundColor: "inherit",
      borderColor: "var(--fallback-bc,oklch(var(--bc)/0.2))",
      borderRadius: "0.375rem",
      height: "3rem",
      "&:hover": {
        boxShadow: "none",
        borderColor: "var(--primary)",
      },
      "&:focus": {
        boxShadow: "none",
        outline: "none",
      },
    }),
    option: (baseStyles: any) => ({
      ...baseStyles,
      backgroundColor: "inherit",
      "&:hover": {
        color: "var(--primary)",
        cursor: "pointer",
      },
    }),
    indicatorSeparator: (baseStyles: any) => ({
      ...baseStyles,
      backgroundColor: "var(--fallback-bc,oklch(var(--bc)/0.2))",
    }),
    menu: (baseStyles: any) => ({
      ...baseStyles,
      zIndex: 1000,
      borderRadius: "0.375rem",
      backgroundColor: COLORS.base,
      "&:focus": { outline: "none" },
    }),
    multiValue: (baseStyles: any) => ({
      ...baseStyles,
      "&:focus": { outline: "none" },
      backgroundColor: "transparent",
    }),
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
      className={clsx(
        className,
        "bg-base/25 bg-base rounded-xl backdrop-blur-3xl"
      )}
      isSearchable={false}
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
