interface TableProps<T> {
  columns: { key: keyof T; label: string }[];
  data: T[];
  selectedItems: string[];
  onSelectItem: (email: string) => void;
  onSelectAll: (checked: boolean) => void;
}

const Table = <T extends { email: string }>({
  columns,
  data,
  selectedItems,
  onSelectItem,
  onSelectAll,
}: TableProps<T>) => {
  return (
    <>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 border w-15">
              {/* 전체 선택 */}
              <input
                type="checkbox"
                onChange={(e) => onSelectAll(e.target.checked)}
                checked={
                  selectedItems.length === data.length && data.length > 0
                }
              />
            </th>
            {columns.map((col) => (
              <th key={col.key.toString()} className="p-3 border">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.email} className="text-center">
                {/* 개별 선택 체크박스 */}
                <td className="p-3 border">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.email)}
                    onChange={() => onSelectItem(item.email)}
                  />
                </td>
                {/* {columns.map((col) => (
                  <td key={col.key.toString()} className="p-3 border">
                    {String(item[col.key]) ?? ""}
                  </td>
                ))} */}
                {columns.map((col) => (
                  <td key={col.key.toString()} className="p-3 border">
                    {col.key === "imgUrls"
                      ? (item[col.key] as string[]).map(
                          (imgUrl: string, index: number) => (
                            <img
                              key={index}
                              src={imgUrl}
                              alt={`review-image-${index}`}
                              className="w-20 h-20 object-cover"
                            />
                          )
                        )
                      : String(item[col.key]) ?? ""}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="text-center p-4">
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default Table;
