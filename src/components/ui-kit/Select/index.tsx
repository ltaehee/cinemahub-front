import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import SelectTrigger from "./SelectTrigger";
import SelectContent from "./SelectContent";
import SelectItem from "./SelectItem";
import { selectBaseCls } from "@consts/className";
import Popover from "@ui/Popover";

interface SelectCompoundProps {
  Trigger: typeof SelectTrigger;
  Content: typeof SelectContent;
  Item: typeof SelectItem;
}

type SelectedItem = {
  label: ReactNode;
  value: string;
};

interface SelectContextProps {
  value: string;
  onChange: (selectedValue: string) => void;
  item: SelectedItem;
  setItem: Dispatch<SetStateAction<SelectedItem>>;
}

export const SelectContext = createContext<SelectContextProps>({
  value: "",
  onChange: () => {},
  item: { label: "선택하세요", value: "" },
  setItem: () => {},
});

interface SelectProps {
  children: ReactNode;
  className?: string;
  onChange: (selectedValue: string) => void;
  value: string;
  item?: SelectedItem;
  setItem?: Dispatch<SetStateAction<SelectedItem>>;
  position?: "bottom-left" | "bottom-center" | "bottom-right";
  fixed?: boolean;
}

const Select: FC<SelectProps> & SelectCompoundProps = (props) => {
  const {
    children,
    className,
    onChange,
    value,
    item: propItem,
    setItem: propSetItem,
    position = "bottom-left",
    fixed,
  } = props;

  const [internalItem, setInternalItem] = useState<SelectedItem>({
    label: "선택하세요",
    value: "",
  });

  const item = propItem ?? internalItem;
  const setItem = propSetItem ?? setInternalItem;

  const contextValue = { value, onChange, item, setItem };

  const selectCls = useMemo(
    () => (className ? `${className} ${selectBaseCls}` : selectBaseCls),
    [className]
  );
  return (
    <SelectContext.Provider value={contextValue}>
      <Popover position={position} className={selectCls} fixed={fixed}>
        {children}
      </Popover>
    </SelectContext.Provider>
  );
};

Select.Trigger = SelectTrigger;
Select.Content = SelectContent;
Select.Item = SelectItem;

export default Select;
