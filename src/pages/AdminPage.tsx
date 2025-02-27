import Tabs from "@ui/Tabs";
import { useEffect, useState } from "react";
import Table from "../components/adminpage/Table";
import Button from "../components/Button";
import SearchBar from "../components/adminpage/SearchBar";
import { getFetchUserInfo } from "../apis/search";
import { getFetchUser, getReportedReview, updateUser } from "../apis/admin";
import Pagination from "@ui/Pagination";

interface UserProps {
  email: string;
  nickname: string;
  createdAt: string;
}

interface ReportProps {
  email: string; // 신고한 유저의 Id
  reason: string; // 신고 사유
  reviewUserId: string; // 신고당한 리뷰 id
  content: string; // 신고된 리뷰 글
  imgUrls: string[]; // 신고된 리뷰 이미지
}

const limit = 4; // 한 페이지에 표시할 항목 수
const blockSize = 10;

const AdminPage = () => {
  const [users, setUsers] = useState<UserProps[]>([]);
  console.log("users: ", users);
  const [reportedUser, setReportedUser] = useState<ReportProps[]>([]); // 신고 리뷰 유저
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>(""); // 검색어 상태
  const [isSearching, setIsSearching] = useState(false); // 검색 중인지 여부
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
    setUsers([]);
    setSearchQuery(query);
    setIsSearching(query.trim() !== ""); // 검색어가 있으면 true, 없으면 false
    setUserPage(0);
  };

  // 유저 삭제
  const handleClickDeleteUser = async () => {
    const isConfirmed = window.confirm("정말로 유저를 삭제하시겠습니까?");

    if (!isConfirmed) {
      return;
    }

    try {
      console.log("selectedUsers: ", selectedUsers);

      const response = await updateUser(selectedUsers);

      setUsers((prevUsers) =>
        prevUsers.filter((user) => !selectedUsers.includes(user.email))
      );
      console.log("delete result", response);
    } catch (err) {
      console.error("삭제 오류", err);
    }
  };

  const [activeindex, setActiveIndex] = useState(1);
  const handleChangeTab = (index: number) => {
    setActiveIndex(index);
  };

  // const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수  수정
  const [totalUsers, setTotalUsers] = useState(0); // 총 유저 데이터 수
  const [totalReported, setTotalReported] = useState(0); // 신고 리뷰 총 개수
  const [userPage, setUserPage] = useState(0);
  const [reviewPage, setReviewPage] = useState(0);
  // console.log("page: ", page);
  const handleChangeUserPage = (page: number) => {
    setUserPage(page);
  };
  const handleChangeReviewPage = (page: number) => {
    setReviewPage(page);
  };
  // 유저데이터 가져오기 (검색 or 전체 조회)
  const getUserData = async () => {
    try {
      let response;
      if (isSearching) {
        response = await getFetchUserInfo(searchQuery, userPage, limit);
        if (!response) return;
      } else {
        response = await getFetchUser(userPage, limit);
      }
      console.log("response: ", response);
      // setTotalPages(response.data.totalPages); // 수정
      setTotalUsers(response.data.totalCount);
      setUsers(response.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  // 신고 리뷰 전체조회
  const getReportedReviewsData = async () => {
    try {
      const response = await getReportedReview(reviewPage, limit);
      console.log("신고리뷰 조회: ", response);
      setReportedUser(response.data.reportResult);
      setTotalReported(response.data.totalCount);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUserData();
  }, [userPage, isSearching, searchQuery]);

  useEffect(() => {
    if (activeindex === 2) {
      getReportedReviewsData();
    }
  }, [activeindex]);
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
                  <Pagination
                    total={totalUsers}
                    value={userPage}
                    onPageChange={handleChangeUserPage}
                    blockSize={blockSize}
                    pageSize={limit}
                    className="flex justify-center p-3 "
                  >
                    <Pagination.Navigator className="flex gap-4">
                      <Pagination.Buttons className="PaginationButtons flex gap-4 font-bold text-slate-300" />
                    </Pagination.Navigator>
                  </Pagination>
                  <div className="mt-7 w-[50%] mx-auto ">
                    <Button onClick={handleClickDeleteUser}>삭제</Button>
                  </div>
                </div>
              </Tabs.Pannel>
              <Tabs.Pannel index={2}>
                <div className="p-10 w-full">
                  <h1 className="text-2xl flex justify-center">
                    신고 리뷰 관리
                  </h1>
                </div>
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
                      { key: "reason", label: "신고 사유" },
                      { key: "imgUrls", label: "리뷰 사진" },
                      { key: "content", label: "리뷰 글" },
                      { key: "email", label: "신고한 회원아이디" },
                      {
                        key: "reviewUserId",
                        label: "신고당한 회원아이디",
                      },
                    ]}
                    data={reportedUser}
                    onSelectAll={handleSelectAllUsers}
                    onSelectItem={handleSelectUser}
                    selectedItems={selectedUsers}
                  />
                  <Pagination
                    total={totalReported}
                    value={reviewPage}
                    onPageChange={handleChangeReviewPage}
                    blockSize={blockSize}
                    pageSize={limit}
                    className="flex justify-center p-3 "
                  >
                    <Pagination.Navigator className="flex gap-4">
                      <Pagination.Buttons className="PaginationButtons flex gap-4 font-bold text-slate-300" />
                    </Pagination.Navigator>
                  </Pagination>
                </div>
              </Tabs.Pannel>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default AdminPage;
