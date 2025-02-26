import { FC, useEffect, useRef, useState } from "react";
import Pagination from "@ui/Pagination";
import Modal from "@ui/Modal";
import XIcon from "../icons/XIcon";
import { useNavigate } from "react-router-dom";
import { genres } from "@consts/genres";
import { personCredits, personImages } from "../apis/person";
import MovieCard from "../components/mainpage/MovieCard";

interface PersonDetailPageProps {
  personId: number;
}

interface Credit {
  movieId: number;
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
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
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
    }
  };

  useEffect(() => {
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

  console.log(credits);

  return (
    <>
      <main
        ref={portalref}
        className="flex flex-col gap-8 items-center bg-white w-[1280px] rounded-2xl pb-16"
      >
        <div className="flex flex-col gap-8 items-center w-full px-8">
          <hr className="w-full border border-gray-300"></hr>

          <section className="flex flex-col gap-4 w-full">
            <h2 className="text-2xl text-slate-900">참여 작품</h2>
            <div className="flex flex-col gap-8 items-center w-full justify-between">
              <div className="flex gap-4 w-full justify-around flex-wrap">
                {credits.map((movie) => {
                  return (
                    <MovieCard
                      key={movie.movieId}
                      movieId={movie.movieId}
                      title={movie.title}
                      releaseDate={movie.releaseDate}
                      posterPath={movie.posterPath}
                      genreIds={movie.genreIds}
                    ></MovieCard>
                  );
                })}
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
            <h2 className="text-2xl text-slate-900">스틸이미지</h2>
            <div className="flex flex-col gap-8 items-center w-full justify-between">
              <div className="flex gap-4 w-full justify-between flex-wrap">
                {images.map((image) => {
                  return (
                    <div
                      key={image}
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
            <XIcon fill="#fff" className="fixed top-4 right-4 w-6" />
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
