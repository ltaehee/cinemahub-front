import {
  ChangeEvent,
  ChangeEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import StarContainer from '../components/reviewpage/StarContainer';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import AspectRatio from '../components/reviewpage/AspectRatio';

import {
  getMovieidCommentArrayFetch,
  RegisterReviewFetch,
  reviewScore,
} from '../apis/review';
import useLoginStore from '../store/useStore';
import { emptyChecker } from '../util/emptyCheck';
import CloseIcon from '../icons/CloseIcon';
import CameraIcon from '../icons/CameraIcon';
import Comments from '../components/reviewpage/comment';
import { getPresignedUrl, uploadImageToS3 } from '../apis/profile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { movieDetail } from '../apis/movie';

type CommentType = {
  _id: string;
  userId: UserType;
  content: string;
  imgUrls: string[];
  starpoint: number;
  like: boolean;
  dislike: boolean;
  totalLike: number;
  totalDisLike: number;
  IsOwner: boolean;
  reportstatus: boolean;
  createdAt: string;
  deletedAt: string;
};

type UserType = {
  nickname: string;
  profile: string;
  _id: string;
};

type MovieType = {
  title: string;
  posterPath: string;
};

type InfoType = {
  reviewScore: string;
  reviewLength: number;
};

const defaultMovie = {
  title: '',
  posterPath: '',
};

const defaultInfo = {
  reviewScore: '0',
  reviewLength: 0,
};

const CinemaReviewPage = () => {
  const IsLogin = useLoginStore((set) => set.IsLogin);

  const [searchParams] = useSearchParams();
  const movieId = searchParams.get('movie') || '';

  const navigator = useNavigate();

  const [movieData, setMovieData] = useState<MovieType>(defaultMovie);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [starRate, setStarRate] = useState(0);
  const [review, setReview] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [imageSrcs, setImageSrcs] = useState<string[]>([]);
  const uploadRef = useRef<HTMLInputElement>(null);
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);
  const [reviewInfo, setReviewInfo] = useState<InfoType>(defaultInfo);

  const SingleFileReader = async (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        try {
          resolve(fileReader.result);
        } catch (err) {
          if (err instanceof Error) {
            reject(new Error(err.message));
          }
        }
      };
    });
  };

  const handleFilePreview = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (typeof files === 'object' && files !== null && files.length <= 2) {
      const filesArr = Array.from(files);
      setFiles((prev) => [...prev, ...filesArr]);

      for (const file of filesArr) {
        const src = await SingleFileReader(file);
        setImageSrcs((prev) => [...prev, `${src}`]);
      }
    }
  };

  const handleResetFileValue = () => {
    if (uploadRef.current) {
      uploadRef.current.value = '';
    }
  };

  const handleRemovePreview = (targetIndex: number) => {
    setImageSrcs(imageSrcs.filter((_, index) => index !== targetIndex));
    setFiles(files.filter((_, index) => index !== targetIndex));
  };

  const handleReviewInput: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const { value } = e.target;
    if (value.length > 2000) {
      return;
    }
    setReview(value);
  };

  const handleRating = (index: number) => {
    setStarRate(index);
  };

  const handleFileUpload = async () => {
    let imgUrls = [];

    if (files.length !== 0) {
      for (const file of files) {
        const presignedUrl = await getPresignedUrl(file.name);
        await uploadImageToS3(presignedUrl, file);
        const imgUrl = presignedUrl.split('?')[0];
        imgUrls.push(imgUrl);
      }
    }
    return imgUrls;
  };

  const handleRegisterReview = async () => {
    if (emptyChecker({ movieId, review, starRate })) {
      alert('별점과 리뷰 내용을 적어주세요.');
      return;
    }

    try {
      setRegisterLoading(true);

      let imgUrls = [];

      if (files.length !== 0) {
        imgUrls = await handleFileUpload();
      }

      const { result, data, message } = await RegisterReviewFetch({
        movieId,
        imgUrls,
        content: review,
        starpoint: starRate,
      });

      if (!result) {
        alert(message);
        return;
      }

      alert(message);
      setReview(''); // 글 초기화
      setStarRate(0); // 별점 초기화
      setImageSrcs([]);
      setFiles([]);
      setComments((prev) => [...prev, { ...data.review }]);
      setReviewInfo((prev) => {
        const length = prev.reviewLength;
        const score = Number(prev.reviewScore);
        const sum = Math.floor(length * score);

        const newScore = (sum + data.review.starpoint) / (length + 1);

        return {
          reviewLength: length + 1,
          reviewScore: newScore.toFixed(1),
        };
      });
    } catch (e) {
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleGetComments = async () => {
    try {
      const { data } = await getMovieidCommentArrayFetch({
        movieId,
      });

      const { reviews } = data;
      setComments(reviews);
    } catch (e) {
    } finally {
    }
  };

  const getMovieData = async (movieId: string) => {
    try {
      const response = await movieDetail(movieId);

      if (emptyChecker({ response })) {
        alert(
          '영화 정보를 참조하지 못했어요. 리뷰 상세보기를 눌러 다시 진행해주세요.'
        );
        navigator('/', { replace: true });
        return;
      }
      setMovieData({ posterPath: response.posterPath, title: response.title });
      handleGetComments();
    } catch (e) {
    } finally {
    }
  };

  const getReviewInfo = async (movieId: string) => {
    try {
      const response = await reviewScore(movieId);

      const finedReviewScore =
        Number(response.reviewScore.totalStarScore) !== 0
          ? response.reviewScore.totalStarScore.toFixed(1)
          : '0';

      setReviewInfo({
        reviewScore: finedReviewScore,
        reviewLength: response.reviewLength,
      });
    } catch (e) {
    } finally {
    }
  };

  useEffect(() => {
    if (emptyChecker({ movieId })) {
      alert(
        '영화 정보를 참조하지 못했어요. 리뷰 상세보기를 눌러 다시 진행해주세요.'
      );
      navigator('/', { replace: true });
      return;
    } else {
      getMovieData(movieId);
      getReviewInfo(movieId);
    }
  }, []);

  return (
    <>
      <div className="p-10 min-w-[480px] max-w-5xl mx-auto">
        <div className="p-10 bg-[#FBFBFB]">
          <div className=" flex justify-between">
            <div>
              <p className="text-3xl font-bold">{movieData.title}</p>

              <div className="flex gap-5 mt-5 items-center flex-col-info">
                {IsLogin ? (
                  <div className="flex gap-2">
                    <p>나의 평점 : </p>
                    <StarContainer
                      starRate={starRate}
                      handleRating={handleRating}
                      defaultStar={0}
                    />
                  </div>
                ) : null}

                <p>{reviewInfo.reviewLength} 개 리뷰</p>
                <p>관람객 평점 : {reviewInfo.reviewScore}</p>
              </div>
            </div>

            <div className="w-[180px] h-full">
              <AspectRatio ratio={1 / 1}>
                <AspectRatio.Image
                  className="w-full h-full rounded-[18px] border border-[#DDDDDD]"
                  src={`https://image.tmdb.org/t/p/original${movieData.posterPath}`}
                  alt={'리뷰 사진'}
                />
              </AspectRatio>
            </div>
          </div>

          {IsLogin ? (
            <div className="mt-5 w-full h-full">
              <p className="text-xl">리뷰 사진 등록하기</p>

              <div className="mt-5 flex gap-5">
                {imageSrcs.map((src, index) => (
                  <div
                    key={`image-src-${index}`}
                    className="relative w-[180px] h-full rounded-[5px] border border-[#DDDDDD]"
                  >
                    <AspectRatio ratio={1 / 1}>
                      <AspectRatio.Image
                        className="w-full h-full"
                        src={src}
                        alt={'리뷰 사진'}
                      />
                    </AspectRatio>

                    <div
                      onClick={() => handleRemovePreview(index)}
                      className="absolute w-[12px] top-1 right-1"
                    >
                      <CloseIcon width={'100%'} height={'100%'} />
                    </div>

                    <div className="absolute top-0 right-0 z-1" />
                  </div>
                ))}

                {imageSrcs.length < 2 ? (
                  <label
                    htmlFor="fileinput"
                    className="block border border-[#DDDDDD] w-[180px] h-full rounded-[5px] hover:bg-[#BDBDBD] cursor-pointer"
                  >
                    <CameraIcon width={'100%'} height={'100%'} />
                  </label>
                ) : null}
              </div>

              <input
                ref={uploadRef}
                style={{ display: 'none' }}
                type="file"
                name="fileinput"
                id="fileinput"
                accept="image/*"
                onChange={handleFilePreview}
                onClick={handleResetFileValue}
                multiple
              />
            </div>
          ) : null}
          <div className="h-[1px] bg-slate-200 my-5"></div>
          {IsLogin ? (
            <div>
              <label htmlFor="review" className="text-lg">
                리뷰 작성하기
              </label>

              <div className="mt-2">
                <div className="px-3 py-5 rounded-md bg-[#F1F1F1] border border-[#BFBFBF]">
                  <Textarea
                    id="review"
                    placeholder="이 콘텐츠의 어떤 점이 좋거나 싫었는지 다른 사용자들에게 알려주세요. 고객님의 리뷰는 다른 사용자들에게 큰 도움이 됩니다."
                    className="w-full h-40 text-md resize-none focus:outline-none"
                    value={review}
                    onChange={handleReviewInput}
                  />

                  <p className="text-slate-400 text-sm float-right">
                    {review.length}/2000
                  </p>
                </div>

                <Button
                  className="mt-2 h-10"
                  disabled={registerLoading}
                  onClick={handleRegisterReview}
                >
                  {registerLoading ? (
                    <div className="flex justify-center items-center">
                      <div className="w-6 h-6 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    '등록하기'
                  )}
                </Button>
              </div>
            </div>
          ) : null}
          <div className="mt-5">
            <p className="text-xl">리뷰 내역 보기</p>
            <Comments comments={comments} setReviewInfo={setReviewInfo} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CinemaReviewPage;
