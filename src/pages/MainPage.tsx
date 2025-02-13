import CarouselXscroll from "@ui/CarouselXscroll";
import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";

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
  console.log("baseRect", baseRect);
  return (
    <>
      <Outlet />
      <div className="flex justify-center items-center h-96">
        <div ref={baseRef} className="font-extrabold text-6xl">
          메인페이지
        </div>
      </div>
      <CarouselXscroll
        baseRect={baseRect}
        itemWidth={200}
        itemListRef={itemListRef}
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
        <CarouselXscroll.Navigator />
      </CarouselXscroll>
    </>
  );
};

export default MainPage;
