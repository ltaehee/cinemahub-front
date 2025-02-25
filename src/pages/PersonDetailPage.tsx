import { FC } from "react";

interface PersonDetailPageProps {
  personId: number;
}

const PersonDetailPage: FC<PersonDetailPageProps> = ({ personId }) => {
  return (
    <div className="bg-white w-[1280px] h-[1000px] rounded-2xl">{personId}</div>
  );
};

export default PersonDetailPage;
