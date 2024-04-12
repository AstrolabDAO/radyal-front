import clsx from "clsx";
import ReactSelect, {
  components,
  OptionProps as ReactSelectOptionsProps,
  Props as ReactSelectProps,
  StylesConfig,
} from "react-select";
import { Network } from "~/model/network";
import { COLORS } from "~/styles/constants";

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
      borderColor: COLORS.dark,
      "::placeholder": COLORS.dark,
      height: "3rem",
      color: COLORS.dark,
      borderRadius: "0.5rem",
      "&:hover": {
        boxShadow: "none",
        borderColor: COLORS.hoverPrimaryBorder,
        background: COLORS.hoverPrimaryBackground,
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
        color: COLORS.primary,
        background: COLORS.hoverPrimaryBackground,
        border: COLORS.hoverPrimaryBorder,
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
      border: COLORS.dark,
      "&:focus": { outline: "none" },
    }),
    multiValue: (baseStyles: any) => ({
      ...baseStyles,
      "&:focus": { outline: "none" },
      backgroundColor: "transparent",
    }),
  };

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
