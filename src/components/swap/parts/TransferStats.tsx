import { useEffect, useState } from "react";
import Image from "next/legacy/image";

import { AXELARSCAN_URL } from "~/config/constants";
import { getWagmiChains } from "~/config/web3";

import {
  getSelectedAssetSymbol,
  useSquidStateStore,
  useSwapStore,
} from "~/store";

import { useGetMaxTransferAmount } from "~/hooks/useGetMaxTransferAmount";
import { copyToClipboard } from "~/utils";
import { SwapStatus } from "~/utils/enums";
import { renderGasFee } from "~/utils/renderGasFee";
import { showDepositAddressCondition } from "~/utils/showDepositAddressCondition";

import { USDC_POOLS } from "../../../data/pools";
import { AddressShortener, StatsWrapper } from "../../common";

const InfoIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    className="w-5 h-5 pb-1 mx-1 stroke-current"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const TransferStats = () => {
  const {
    txInfo,
    srcChain,
    destChain,
    asset,
    depositAddress,
    intermediaryDepositAddress,
    destAddress,
    swapStatus,
  } = useSwapStore((state) => state);
  const selectedAssetSymbol = useSwapStore(getSelectedAssetSymbol);
  const max = useGetMaxTransferAmount();
  const [transferFee, setTransferFee] = useState<string>("");
  const isSquidTrade = useSquidStateStore((state) => state.isSquidTrade);

  useEffect(() => {
    renderGasFee(srcChain, destChain, asset).then((res) => {
      setTransferFee(res);
    });
  }, [srcChain, destChain, asset]);

  function renderWaitTime() {
    if (!srcChain) {
      return "";
    }

    if (srcChain.module === "axelarnet") {
      return "~2 minutes";
    }

    if (["ethereum", "polygon"].includes(srcChain?.chainName?.toLowerCase())) {
      return "~15 minutes";
    }

    return "~3 minutes";
  }

  function renderMaxTransferAmount() {
    if (max && Number(max) > 0) {
      const tooltipText =
        "Any transfers in excess may result in longer settlement times. Contact us on Discord if you encounter any issues.";
      return (
        <li className="flex justify-between">
          <span
            className="flex flex-row items-center cursor-pointer tooltip tooltip-warning"
            data-tip={tooltipText}
          >
            <span>Maximum Transfer Amount </span>
            {InfoIcon}
          </span>
          <span className="font-semibold">
            {BigInt(max).toLocaleString()} {selectedAssetSymbol}
          </span>
        </li>
      );
    }
    return null;
  }

  function renderDepositAddress() {
    if (swapStatus === SwapStatus.IDLE) return null;
    if (!depositAddress) return null;
    const showDepositAddress = showDepositAddressCondition({ srcChain, asset });
    return (
      <li className="flex justify-between">
        <span
          className="font-medium text-green-300 cursor-help tooltip"
          data-tip={`Temporary deposit address generated by Axelar. Transfers of ${selectedAssetSymbol} to this address will be monitored by Axelar and forwarded to ${
            destChain.chainName[0].toUpperCase() +
            destChain.chainName.substring(1)
          }`}
        >
          Axelar Deposit Address:
        </span>
        <div className="flex font-bold gap-x-2">
          <AddressShortener value={depositAddress} />
          <div
            className="cursor-pointer"
            onClick={() =>
              showDepositAddress && copyToClipboard(depositAddress)
            }
          >
            {showDepositAddress && (
              <Image src={"/assets/ui/copy.svg"} height={16} width={16} />
            )}
          </div>
        </div>
      </li>
    );
  }

  function renderIntermediateDepositAddress() {
    if (swapStatus === SwapStatus.IDLE) {
      return null;
    }
    if (!intermediaryDepositAddress) {
      return null;
    }
    return (
      <li className="flex justify-between">
        <span
          className="flex flex-row cursor-pointer tooltip tooltip-warning"
          data-tip={`Swap contract that converts wrapped ERC-20 to native tokens on ${destChain.chainName} for recipient.`}
        >
          <span>Swap Contract</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="w-5 h-5 pb-1 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>:</span>
        </span>

        <span className="flex font-bold gap-x-2">
          <AddressShortener value={intermediaryDepositAddress} />
          <div
            className="cursor-pointer"
            onClick={() => copyToClipboard(intermediaryDepositAddress)}
          >
            <Image
              src={"/assets/ui/copy.svg"}
              height={16}
              width={16}
              alt="copy"
            />
          </div>
        </span>
      </li>
    );
  }

  function renderDestinationAddress() {
    if (swapStatus === SwapStatus.IDLE) {
      return null;
    }
    return (
      <li className="flex justify-between">
        <span>Destination Address:</span>
        <span className="flex font-bold gap-x-2">
          <AddressShortener value={destAddress} />
          <div
            className="cursor-pointer"
            onClick={() => copyToClipboard(destAddress)}
          >
            <Image
              src={"/assets/ui/copy.svg"}
              height={16}
              width={16}
              alt="copy"
            />
          </div>
        </span>
      </li>
    );
  }

  function renderDepositConfirmationLink() {
    if (!txInfo.sourceTxHash) {
      return null;
    }
    const evmRpc = getWagmiChains().find(
      (network) =>
        network.networkNameOverride === srcChain.chainName?.toLowerCase()
    );
    const rootUrl =
      srcChain.module === "evm"
        ? `${evmRpc?.blockExplorers?.default.url}tx/`
        : `${AXELARSCAN_URL}/transfer/`;
    return (
      <li className="flex justify-between">
        <span>Deposit Confirmation:</span>
        <a
          href={`${rootUrl}${txInfo.sourceTxHash}`}
          target="_blank"
          rel="noreferrer"
          className="flex font-normal gap-x-2"
        >
          <span className="text-[#00a6ff]">
            View on{" "}
            {srcChain.module === "evm"
              ? evmRpc?.blockExplorers?.default?.name
              : "Axelarscan"}
          </span>
          <Image
            src={"/assets/ui/link.svg"}
            height={16}
            width={16}
            layout="intrinsic"
            alt="link"
          />
        </a>
      </li>
    );
  }

  function renderPoolInfo() {
    if ((asset as any)?.id === "uusdc") {
      const chainName = destChain?.chainName?.toLowerCase();
      const pool = USDC_POOLS[chainName];
      const pair = pool?.pairs[0];

      const tooltipText =
        "axlUSDC is Axelar’s bridged version of Ethereum USDC. For every axlUSDC, there is one USDC locked on Ethereum. When bridging to other chains, please use the liquidity pool linked here to swap for native USDC. When you bridge axlUSDC back to Ethereum, native USDC is unlocked";
      if (!pair) {
        return null;
      }

      return (
        <div className="w-full cursor-pointer ">
          <li className="flex justify-between w-full font-normal">
            <span
              className="flex tooltip tooltip-warning"
              data-tip={tooltipText}
            >
              <span>{pair} pool</span>
              {InfoIcon}
            </span>
            <a
              className="text-[#00a6ff] flex items-center gap-x-2"
              target="_blank"
              rel="noreferrer"
              href={pool.url}
            >
              {pool.dex}
              <Image
                src={"/assets/ui/link.svg"}
                height={16}
                width={16}
                layout="intrinsic"
                alt="link"
              />
            </a>
          </li>
        </div>
      );
    }

    return null;
  }

  if (isSquidTrade) {
    return null;
  }

  return (
    <StatsWrapper>
      <ul className="space-y-2 text-sm">
        <li className="flex justify-between">
          <div
            className="flex items-center cursor-pointer tooltip tooltip-warning"
            data-tip="Satellite does not charge a bridge fee"
          >
            <span>Bridge Fees</span>
            {InfoIcon}
          </div>
          <span className="font-semibold">0</span>
        </li>
        <li className="flex justify-between">
          <div
            className="flex items-center cursor-pointer tooltip tooltip-warning"
            data-tip={
              "The relayer gas fee is set to cover gas fees on average across all interconnected chains but is largely influenced by Ethereum"
            }
          >
            <span>Relayer Gas Fees</span>
            {InfoIcon}
          </div>
          <span className="font-semibold">
            {transferFee} {selectedAssetSymbol}
          </span>
        </li>
        <li className="flex justify-between ">
          <span>Estimated wait time</span>
          <span className="font-semibold">{renderWaitTime()}</span>
        </li>
        {renderPoolInfo()}
        {renderMaxTransferAmount()}
        {renderIntermediateDepositAddress()}
        {renderDestinationAddress()}
        {renderDepositAddress()}
        {renderDepositConfirmationLink()}
      </ul>
    </StatsWrapper>
  );
};
