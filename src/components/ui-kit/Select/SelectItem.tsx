import { ReactNode, useContext, useMemo } from "react";
import { SelectContext } from ".";
import { selectItemCls } from "@consts/className";
import { PopoverContext } from "@ui/Popover";

interface SelectItemProps {
  children: ReactNode;
  className?: string;
  value: string;
}

const SelectItem = (props: SelectItemProps) => {
  const { children, className, value } = props;
  const { setItem, onChange } = useContext(SelectContext);
  const { closePopover } = useContext(PopoverContext);
  const handleClick = () => {
    setItem({ label: children, value });
    onChange(value);
    closePopover();
  };

  const cls = useMemo(
    () => (className ? `${className} ${selectItemCls}` : selectItemCls),
    [className]
  );

  return (
    <div onClick={handleClick} className={cls}>
      {children}
    </div>
  );
};
export default SelectItem;
// 셀렉트내부에서는 라벨,벨류 둘다 알고있어야한다 트리거에는 라벨이 표시
