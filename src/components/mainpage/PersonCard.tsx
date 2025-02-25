import { FC } from "react";
import { useNavigate } from "react-router-dom";
import FavoritesBtn from "./FavoritesBtn";

interface PopularPerson {
  personId: number;
  name: string;
  profilePath?: string;
}

const PersonCard: FC<PopularPerson> = ({ personId, name, profilePath }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`?person=${personId}`)}
      className="cursor-pointer relative"
    >
      <div className="flex flex-col w-56 h-56 rounded-full overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/w500${profilePath}`}
          alt={name}
          className="object-cover  w-full h-full border border-gray-200 shadow-md hover:scale-110 duration-300 ease-in-out "
          onDragStart={(e) => e.preventDefault()}
        />
      </div>
      <FavoritesBtn
        favoriteType="Person"
        favoriteId={personId.toString()}
        className="absolute top-2 left-2 border border-gray-200 rounded-full"
      />
      <h3 className="text-center pt-2 text-lg">{name}</h3>
    </div>
  );
};

export default PersonCard;
