// interface TableProps<T> {
//   columns: { key: keyof T; label: string }[];
//   data: T[];
//   selectedItems: number[];
//   onSelectItem: (id: number) => void;
//   onSelectAll: (checked: boolean) => void;
// }

// const Table = <T extends { id: number }>({
//   columns,
//   data,
//   selectedItems,
//   onSelectedItems,
//   onSelectItem,
//   onSelectAll,
// }: TableProps<T>) => {
//   return (
//     <>
//       <table className="w-full">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="p-3 border w-15">
//               <input type="checkbox" />
//             </th>
//             <th className="p-3 border">회원 아이디</th>
//             <th className="p-3 border">이름</th>
//             <th className="p-3 border">가입 날짜</th>
//           </tr>
//         </thead>
//         <tbody>
//           <td className="p-2 border">username</td>
//           <td className="p-2 border">name</td>
//           <td className="p-2 border">joinedAt</td>
//         </tbody>
//       </table>
//     </>
//   );
// };

// export default Table;
