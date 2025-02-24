import Tabs from "@ui/Tabs";
import { useState } from "react";
import Table from "../components/adminpage/Table";
import Button from "../components/Button";
import SearchBar from "../components/adminpage/SearchBar";
import { getFetchUserInfo } from "../apis/search";
import { deleteFetchUser } from "../apis/admin";

interface UserProps {
  email: string;
  nickname: string;
  createdAt: string;
}

const AdminPage = () => {
  const [users, setUsers] = useState<UserProps[]>([]);
  console.log("users: ", users);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const handleSelectUser = (email: string) => {
    setSelectedUsers((prev) =>
      prev.includes(email)
        ? prev.filter((userId) => userId !== email)
        : [...prev, email]
    );
  };

  const handleSelectAllUsers = (checked: boolean) => {
    setSelectedUsers(checked ? users.map((user) => user.email) : []);
  };

  // 유저 검색
  const handleSearch = async (query: string) => {
    if (query.trim() === "") return;
    try {
      const response = await getFetchUserInfo(query);
      setUsers(response);
    } catch (err) {
      setUsers([]);
      console.error(err);
    }
  };

  // 유저 삭제
  const handleClickDeleteUser = async () => {
    const isConfirmed = window.confirm("정말로 유저를 삭제하시겠습니까?");

    if (!isConfirmed) {
      return;
    }

    try {
      console.log("selectedUsers: ", selectedUsers);

      const response = await deleteFetchUser(selectedUsers);

      setUsers((prevUsers) =>
        prevUsers.filter((user) => !selectedUsers.includes(user.email))
      );
      console.log("delete result", response);
    } catch (err) {
      console.error("삭제 오류", err);
    }
  };

  const [_, setActiveIndex] = useState(1);
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
                  <h1 className="text-2xl flex justify-center">유저 관리</h1>
                </div>
                {/* <div className="px-70 flex justify-center">
                  <div className="ml-2 w-[20%]">
                    <Button className="">검색</Button>
                  </div>
                </div> */}
                <div className="p-10 w-full">
                  <div className="p-2 flex flex-row-reverse">
                    <SearchBar
                      onSearch={handleSearch}
                      placeholder="회원 이름 검색"
                      useDebounce={true}
                    />
                  </div>

                  <Table
                    columns={[
                      { key: "email", label: "회원아이디" },
                      { key: "nickname", label: "이름" },
                      { key: "createdAt", label: "가입날짜" },
                    ]}
                    data={users}
                    onSelectAll={handleSelectAllUsers}
                    onSelectItem={handleSelectUser}
                    selectedItems={selectedUsers}
                  />
                  <div className="mt-7 w-[50%] mx-auto ">
                    <Button onClick={handleClickDeleteUser}>삭제</Button>
                  </div>
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
