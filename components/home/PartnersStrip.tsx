"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

import { PartnerType } from "@/types";

export default function PartnersStrip({ partners }: { partners?: PartnerType[] }) {
  return (
    <div className="mil-soft-bg">
      <div className="container mil-p-0-120">
        <Swiper
          className="mil-infinite-show mil-up"
          modules={[Autoplay, FreeMode]}
          slidesPerView={2}
          spaceBetween={30}
          speed={5000}
          autoplay={{ delay: 0 }}
          loop={true}
          freeMode={true}
          breakpoints={{
            992: { slidesPerView: 4 },
          }}
        >
          {partners?.map((partner, index) => (
            <SwiperSlide key={index}>
              <a href={partner.link} className="mil-partner-frame" style={{ width: "60px" }}>
                <img src={partner.logo} alt={partner.name} />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
