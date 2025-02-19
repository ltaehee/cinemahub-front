import Tabs from "@ui/Tabs";
import { useState } from "react";

const AdminPage = () => {
  const [users, setUsers] = useState();
  const [activeIndex, setActiveIndex] = useState(1);
  const handleChangeTab = (index: number) => {
    setActiveIndex(index);
  };
  return (
    <>
      <div className="w-full flex items-center justify-center h-[calc(100vh-65px)] ">
        <Tabs onChangeTab={handleChangeTab} className="">
          <div className="flex w-[1280px] px-8 h-full">
            <div className="bg-[#D9D9D9] w-[20%] h-[calc(100vh-65px)]">
              <Tabs.MenuList>
                <Tabs.Menu
                  index={1}
                  className="flex justify-center p-5 hover:bg-[#B9B1B1] cursor-pointer text-black"
                >
                  유저관리
                </Tabs.Menu>
                <Tabs.Menu
                  index={2}
                  className="flex justify-center p-5 hover:bg-[#B9B1B1] cursor-pointer text-black"
                >
                  신고리뷰관리
                </Tabs.Menu>
              </Tabs.MenuList>
            </div>
            <div className="w-full flex flex-col relative">
              <Tabs.Pannel index={1}>
                <div className="p-10 w-full">
                  <h1 className="text-2xl mb-3 flex justify-center">
                    유저 관리
                  </h1>
                </div>
                <div className="px-70">
                  <input
                    type="text"
                    placeholder="회원 아이디 또는 이름 검색"
                    className="border p-2 w-full mb-4 rounded"
                  />
                </div>
                <div className="p-10 w-full">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-3 border w-15">
                          <input type="checkbox" />
                        </th>
                        <th className="p-3 border">회원 아이디</th>
                        <th className="p-3 border">이름</th>
                        <th className="p-3 border">가입 날짜</th>
                      </tr>
                    </thead>
                    <tbody>
                      <td className="p-2 border">username</td>
                      <td className="p-2 border">name</td>
                      <td className="p-2 border">joinedAt</td>
                    </tbody>
                  </table>
                </div>
              </Tabs.Pannel>
              <Tabs.Pannel index={2}>신고리뷰</Tabs.Pannel>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default AdminPage;
