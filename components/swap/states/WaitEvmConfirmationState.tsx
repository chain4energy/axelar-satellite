import React from "react";
import Image from "next/image";

import { SpinnerRoundFilled } from "spinners-react";
import { erc20ABI, useContractEvent } from "wagmi";
import { AXELARSCAN_URL, ENVIRONMENT } from "../../../config/constants";
import {
  getDestChainId,
  getSelectedAssetSymbol,
  useSwapStore,
} from "../../../store";
import { copyToClipboard } from "../../../utils";
import { SwapStatus } from "../../../utils/enums";
import { AddressShortener, InputWrapper, truncate } from "../../common";
import { ProgressBar } from "./parts";
import { getWagmiChains } from "../../../config/web3";
import { TransferStats } from "../parts";
import { truncateEthAddress } from "../../../utils/truncateEthAddress";

export const WaitEvmConfirmationState = () => {
  const {
    asset,
    srcChain,
    destChain,
    destAddress,
    setSwapStatus,
    txInfo,
    setTxInfo,
    depositAddress,
  } = useSwapStore((state) => state);

  const chainAlias = destChain.chainIdentifier[ENVIRONMENT];
  const tokenAddress = asset?.chain_aliases[chainAlias]?.tokenAddress;

  const destChainId = useSwapStore(getDestChainId);
  const selectedAssetSymbol = useSwapStore(getSelectedAssetSymbol);

  useContractEvent({
    chainId: destChainId as number,
    addressOrName: tokenAddress as string,
    contractInterface: erc20ABI,
    eventName: "Transfer",
    listener: (event) => {
      if (event[3].blockNumber < Number(txInfo.destStartBlockNumber)) return;
      if (event[1] === destAddress) {
        setTxInfo({
          destTxHash: event[3]?.transactionHash,
        });
        setSwapStatus(SwapStatus.FINISHED);
      }
    },
  });

  function renderConfirmations() {
    return (
      <div className="flex flex-col justify-center h-full text-center gap-y-1">
        <div className="flex justify-center gap-x-2">
          <div className="flex flex-col text-center">
            <h2 className="text-lg text-center">
              <span>Transfer on</span>
              <strong className="capitalize"> {srcChain.chainName} </strong>
              <span>detected!</span>
            </h2>
            <div className="text-base text-green-300">
              Tokens will soon arrive at <>{truncate(destAddress, 24)}</> on{" "}
              <strong className="capitalize">{destChain.chainName}</strong>
            </div>
            <div className="text-sm text-gray-300">
              You can now safely close Satellite
            </div>
            <div className="my-0 divider" />
            <div className="flex gap-x-2">
              <SpinnerRoundFilled
                className="text-blue-500"
                size={20}
                color="#00a6ff"
              />
              <div className="text-base font-light text-gray-200">
                Transfering your {selectedAssetSymbol} to {destChain.chainName}
                ...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <TransferStats />
      <InputWrapper className="h-auto">
        <div className="h-full space-x-2">
          <div className="flex flex-col w-full h-full">
            <div className="relative flex flex-col h-full">
              <ProgressBar level={2} />
              <div className="flex items-center justify-center h-full py-4 mt-auto text-xs gap-x-2">
                {renderConfirmations()}
              </div>
            </div>
          </div>
        </div>
      </InputWrapper>
    </>
  );
};
