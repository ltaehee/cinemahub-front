import { FC } from "react";
import { useNavigate } from "react-router-dom";

interface PopularPerson {
  personId: number;
  name: string;
  profilePath: string;
}

const PersonCard: FC<PopularPerson> = ({ personId, name, profilePath }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/person/${personId}`)}
      className="w-[340px] h-[340px]"
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${profilePath}`}
        alt={name}
        className="object-cover rounded-full select-none"
      />
    </div>
  );
};

export default PersonCard;
