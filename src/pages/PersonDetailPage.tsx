import { FC } from "react";

interface PersonDetailPageProps {
  personId: number;
}

const PersonDetailPage: FC<PersonDetailPageProps> = ({ personId }) => {
  return <div>인물 상세 페이지 - 인물 ID: {personId}</div>;
};

export default PersonDetailPage;
