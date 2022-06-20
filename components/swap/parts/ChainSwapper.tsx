import React from "react";
import Image from "next/image";

export const ChainSwapper = () => {
  return (
    <div className="bg-gradient-to-b from-[#00fbfb] to-[#0066ff] h-10 w-10 p-[1px] rounded-xl cursor-pointer">
      <div className="flex justify-center items-center h-full w-full bg-gradient-to-b from-[#00343d] to-[#001f3f] rounded-xl p-2.5">
        <div className="relative w-full h-full">
          <Image layout="fill" src="/assets/ui/double-arrows.svg" />
        </div>
      </div>
    </div>
  );
};