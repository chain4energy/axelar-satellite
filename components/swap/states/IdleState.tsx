import React from "react";
import { useSwapStore, useWalletStore } from "../../../store";
import { InputWrapper } from "../../common";
import { AddressFiller, InitialStats } from "../parts";

export const IdleState = () => {
  const { destAddress, setDestAddress } = useSwapStore((state) => state);
  const walletConnected = useWalletStore((state) => state.walletConnected);

  function renderConnectAlert() {
    return (
      <div className="h-10 my-4">
        <div className="text-sm rounded-lg bg-neutral alert">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="flex-shrink-0 w-5 h-5 stroke-info"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Please connect your wallet to use the app</span>
          </div>
        </div>
      </div>
    );
  }

  function renderAddressFiller() {
    return (
      <div className="flex h-10 gap-2 ">
        <InputWrapper className="h-full">
          <div className="h-full">
            <input
              className="w-full h-full text-xs bg-transparent outline-none"
              placeholder="Destination address"
              value={destAddress}
              onChange={(e) => setDestAddress(e.target.value)}
            />
          </div>
        </InputWrapper>
        <div className="h-full">
          <AddressFiller />
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <InitialStats />
      </div>
      {!walletConnected && renderConnectAlert()}
      {walletConnected && renderAddressFiller()}
    </>
  );
};