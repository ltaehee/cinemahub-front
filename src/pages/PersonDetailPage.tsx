import { FC, useEffect, useRef, useState } from "react";
import Pagination from "@ui/Pagination";
import Modal from "@ui/Modal";
import XIcon from "../icons/XIcon";
import { personCredits, personDetail, personImages } from "../apis/person";
import MovieCard from "../components/mainpage/MovieCard";
import { Helmet } from "react-helmet-async";
import defaultImage from "../assets/images/defaultImage.jpg";
import FavoritesBtn from "../components/mainpage/FavoritesBtn";

interface PersonDetailPageProps {
  personId: string;
}

interface PersonDetails {
  name: string;
  profilePath: string;
  birthday: string;
  deathday: string | null;
  gender: number;
  department: string;
  placeOfBirth: string;
}

interface Credit {
  movieId: string;
  title: string;
  releaseDate: string;
  posterPath: string;
  genreIds: number[];
}

const imagePageSize = 8;
const creditPageSize = 8;
const blockSize = 15;

const PersonDetailPage: FC<PersonDetailPageProps> = ({ personId }) => {
  const [credits, setCredits] = useState<Credit[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [currentCreditPage, setCurrentCreditPage] = useState(0);
  const [currentImagePage, setCurrentImagePage] = useState(0);
  const [creditCount, setCreditCount] = useState(0);
  const [imageCount, setImageCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState("");
  const portalref = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [personDetails, setPersonDetails] = useState<PersonDetails>({
    name: "",
    profilePath: "",
    birthday: "",
    deathday: null,
    gender: 0,
    department: "",
    placeOfBirth: "",
  });

  const fetchPersonDetail = async () => {
    try {
      const details = await personDetail(personId);
      setPersonDetails(details);
    } catch (err) {
      console.error("fetchPersonDetail 에러 ", err);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [credits, images] = await Promise.all([
        personCredits(personId, 0, creditPageSize),
        personImages(personId, 0, imagePageSize),
      ]);
      setCredits(credits.credits);
      setCreditCount(credits.totalCount);
      setImages(images.images);
      setImageCount(images.totalCount);
    } catch (err) {
      console.error("fetchData 에러 ", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonDetail();
    fetchData();
  }, []);

  const creditPageMove = async () => {
    const credits = await personCredits(
      personId,
      currentCreditPage,
      creditPageSize
    );
    setCredits(credits.credits);
  };

  const imagePageMove = async () => {
    const images = await personImages(
      personId,
      currentImagePage,
      imagePageSize
    );
    setImages(images.images);
  };

  useEffect(() => {
    creditPageMove();
  }, [currentCreditPage]);

  useEffect(() => {
    imagePageMove();
  }, [currentImagePage]);

  const handleCreditPageChange = (page: number) => {
    setCurrentCreditPage(page);
  };

  const handleImagePageChange = (page: number) => {
    setCurrentImagePage(page);
  };

  const handleModalOpen = (content: string) => {
    setIsModalOpen(true);
    setContent(content);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      {personDetails && (
        <Helmet>
          <title>{`${personDetails.name} - 인물 상세정보`}</title>
          <meta
            name="description"
            content={`${personDetails.name}의 인물 상세정보 페이지입니다.`}
          />
        </Helmet>
      )}
      <main
        ref={portalref}
        className="flex flex-col gap-8 items-center bg-white w-[1280px] rounded-2xl pb-16"
      >
        <div className="grid grid-cols-[1fr_2fr] gap-8 px-8 pt-8">
          <div>
            <img
              src={
                personDetails.profilePath
                  ? `https://image.tmdb.org/t/p/w500${personDetails.profilePath}`
                  : defaultImage
              }
              alt={personDetails.name}
              className="object-cover w-full h-full rounded-2xl"
              onDragStart={(e) => e.preventDefault()}
            />
            <FavoritesBtn
              favoriteType="Person"
              favoriteId={personId}
              className="absolute top-12 left-12 border border-gray-200 rounded-full"
            />
          </div>
          <div className="flex flex-col justify-center gap-10">
            <h1 className="text-6xl text-gray-900 font-bold">
              {personDetails.name}
            </h1>
            <div className="flex flex-col gap-4 justify-center">
              <dl>
                <dt className="text-xl pb-2">전문분야</dt>
                <dd className="text-lg text-gray-500">
                  {personDetails.department === "Acting" ? "배우" : "감독"}
                </dd>
              </dl>
              <hr className="w-full border border-gray-300"></hr>
              <dl>
                <dt className="text-xl pb-2">성별</dt>
                <dd className="flex gap-4 text-lg text-gray-500">
                  {personDetails.gender === 1 ? "여성" : "남성"}
                </dd>
              </dl>
              <hr className="w-full border border-gray-300"></hr>
              <dl>
                <dt className="text-xl pb-2">출생일</dt>
                <dd className="flex gap-4 text-lg text-gray-500">
                  {personDetails.birthday}
                </dd>
              </dl>
              <hr className="w-full border border-gray-300"></hr>
              {personDetails.deathday && (
                <>
                  <dl>
                    <dt className="text-xl pb-2">사망일</dt>
                    <dd className="flex gap-4 text-lg text-gray-500">
                      {personDetails.deathday}
                    </dd>
                  </dl>
                  <hr className="w-full border border-gray-300"></hr>
                </>
              )}
              <dl>
                <dt className="text-xl pb-2">출생지</dt>
                <dd className="flex gap-4 text-lg text-gray-500">
                  {personDetails.placeOfBirth}
                </dd>
              </dl>
              <hr className="w-full border border-gray-300"></hr>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8 items-center w-full px-8">
          <hr className="w-full border border-gray-300"></hr>

          <section className="flex flex-col gap-4 w-full">
            <h2 className="text-2xl text-slate-900">참여 작품</h2>
            <div className="flex flex-col gap-8 items-center w-full">
              <div className="flex gap-4 w-full flex-wrap">
                {isLoading ? (
                  <div className="flex justify-center items-center w-full h-[980px] text-5xl text-gray-400">
                    로딩중
                  </div>
                ) : (
                  <>
                    {credits.map((movie) => {
                      return (
                        <div
                          key={`person-detail-movie-${movie.movieId}`}
                          className="w-[292px]"
                        >
                          <MovieCard
                            movieId={movie.movieId}
                            title={movie.title}
                            releaseDate={movie.releaseDate}
                            posterPath={movie.posterPath}
                            genreIds={movie.genreIds}
                          />
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
              <Pagination
                total={creditCount}
                value={currentCreditPage}
                onPageChange={handleCreditPageChange}
                blockSize={blockSize}
                pageSize={creditPageSize}
              >
                <Pagination.Navigator className="flex gap-4">
                  <Pagination.Buttons className="PaginationButtons flex gap-4 font-bold text-slate-300" />
                </Pagination.Navigator>
              </Pagination>
            </div>
          </section>
          <hr className="w-full border border-gray-300"></hr>
          <section className="flex flex-col gap-4 w-full">
            <h2 className="text-2xl text-slate-900">인물 사진</h2>
            <div className="flex flex-col gap-8 items-center w-full">
              <div className="flex gap-4 w-full flex-wrap">
                {images.map((image) => {
                  return (
                    <div
                      key={`person-detail-image-${image}`}
                      onClick={() => {
                        handleModalOpen(image), window.scrollTo(0, scrollY);
                      }}
                      className="w-[292px] h-[463px]"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w342${image}`}
                        alt="poster"
                        className="object-cover w-full h-full flex-shrink-0"
                        onDragStart={(e) => e.preventDefault()}
                      />
                    </div>
                  );
                })}
              </div>
              <Pagination
                total={imageCount}
                value={currentImagePage}
                onPageChange={handleImagePageChange}
                blockSize={blockSize}
                pageSize={imagePageSize}
              >
                <Pagination.Navigator className="flex gap-4">
                  <Pagination.Buttons className="PaginationButtons flex gap-4 font-bold text-slate-300" />
                </Pagination.Navigator>
              </Pagination>
            </div>
          </section>
        </div>
      </main>
      <Modal
        onCloseModal={closeModal}
        open={isModalOpen}
        portalref={portalref.current}
      >
        <Modal.Content className="z-4 top-[50%] transform -translate-y-1/2 shadow-2xl">
          <Modal.Close>
            <XIcon className="fixed top-2 right-4 w-8" />
          </Modal.Close>
          <img
            src={`https://image.tmdb.org/t/p/w780${content}`}
            alt="poster"
            onDragStart={(e) => e.preventDefault()}
          />
        </Modal.Content>
      </Modal>
    </>
  );
};

export default PersonDetailPage;
