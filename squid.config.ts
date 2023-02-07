import { NEXT_PUBLIC_SQUID_URL } from "config/constants";

import { Squid } from "@0xsquid/sdk";

// instantiate the SDK
export const squid: Squid = new Squid({
  baseUrl: NEXT_PUBLIC_SQUID_URL, // for mainnet use "https://api.0xsquid.com"
});

squid.init().catch((e) => console.error("failed"));
