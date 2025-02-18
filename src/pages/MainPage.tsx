import CarouselXscroll from "@ui/CarouselXscroll";
import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import ChevronIcon from "../icons/ChevronIcon";
import MainCard from "../components/mainpage/MainCard";
import Carousel from "@ui/CarouselInfinite";
import CarouselItem from "@ui/CarouselInfinite/CarouselInfiniteItem";
import CarouselItemList from "@ui/CarouselInfinite/CarouselInfiniteItemList";

const MainPage = () => {
  const baseRef = useRef<HTMLDivElement>(null);
  const itemListRef = useRef<HTMLDivElement>(null);
  const [baseRect, setBaseRect] = useState(new DOMRect());

  const calculateBaseDivRect = () => {
    if (!baseRef.current) return;
    setBaseRect(baseRef.current.getBoundingClientRect());
  };

  useEffect(() => {
    calculateBaseDivRect();

    const handleResize = () => {
      calculateBaseDivRect();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Outlet />
      <Carousel className="relative">
        <Carousel.ItemContainer>
          <CarouselItemList>
            <CarouselItem index={0}>
              <div className="bg-red-300 h-80">1</div>
            </CarouselItem>
            <CarouselItem index={1}>
              <div className="bg-amber-300 h-80">2</div>
            </CarouselItem>
            <CarouselItem index={2}>
              <div className="bg-emerald-400 h-80">3</div>
            </CarouselItem>
          </CarouselItemList>
        </Carousel.ItemContainer>
        <Carousel.Navigator className=" absolute bottom-0 flex items-center">
          {(handlePrev, handleNext, displayIndex, itemLength) => (
            <>
              <button
                className="bg-[rgba(0,0,0,0.5)] rounded-full opacity-50 hover:opacity-100 duration-300 ease-in-out b backdrop-blur-sm"
                onClick={handlePrev}
              >
                <ChevronIcon height="40px" color="#fff" thickness="3" />
              </button>
              <div>
                {displayIndex}/{itemLength}
              </div>
              <button
                className="bg-[rgba(0,0,0,0.5)] rounded-full opacity-50 hover:opacity-100 duration-300 ease-in-out backdrop-blur-sm"
                onClick={handleNext}
              >
                <ChevronIcon
                  height="40px"
                  color="#fff"
                  thickness="3"
                  className="rotate-180"
                />
              </button>
            </>
          )}
        </Carousel.Navigator>
      </Carousel>
      <div className="flex justify-center items-center h-96">
        <div ref={baseRef} className="font-extrabold text-6xl"></div>
      </div>
      <CarouselXscroll
        baseRect={baseRect}
        itemWidth={200}
        itemListRef={itemListRef}
        className="group"
      >
        <CarouselXscroll.ItemContainer className="h-52">
          <CarouselXscroll.Items>
            <div className="w-52 h-52 bg-red-200">1</div>
            <div className="w-52 h-52 bg-red-200">2</div>
            <div className="w-52 h-52 bg-red-200">3</div>
            <div className="w-52 h-52 bg-red-200">4</div>
            <div className="w-52 h-52 bg-red-200">5</div>
            <div className="w-52 h-52 bg-red-200">6</div>
            <div className="w-52 h-52 bg-red-200">7</div>
            <div className="w-52 h-52 bg-red-200">8</div>
            <div className="w-52 h-52 bg-red-200">9</div>
            <div className="w-52 h-52 bg-red-200">10</div>
          </CarouselXscroll.Items>
        </CarouselXscroll.ItemContainer>
        <CarouselXscroll.Navigator>
          {(prev, next, leftStyle, rightStyle) => (
            <>
              <button
                className="bg-[rgba(255,255,255,0.5)] rounded-full opacity-0 group-hover:opacity-100 duration-300 ease-in-out b backdrop-blur-sm"
                style={leftStyle}
                onClick={prev}
              >
                <ChevronIcon height="56px" />
              </button>
              <button
                className="bg-[rgba(255,255,255,0.5)] rounded-full opacity-0 group-hover:opacity-100 duration-300 ease-in-out backdrop-blur-sm"
                style={rightStyle}
                onClick={next}
              >
                <ChevronIcon height="56px" className="rotate-180" />
              </button>
            </>
          )}
        </CarouselXscroll.Navigator>
      </CarouselXscroll>
    </>
  );
};

export default MainPage;
