interface StrategyDataProps {
  label: string;
  data: string;
}
import { RiQuestionLine } from "react-icons/ri";

const StrategyData = ({ label, data }: StrategyDataProps) => (
  <li className="w-full">
    <span className="text-l block flex align-center">
      {label}
      <RiQuestionLine className="ml-1" />
    </span>
    <span className="text-4xl block">{data}</span>
  </li>
);

export default StrategyData;
