import { CosmosChain } from "../interface"

export default {
  rpc: "https://testnet-rpc-router.axelar-dev.workers.dev/?chain=cosmoshub",
  rest: "https://vega-rest.interchain.io",
  chainId: "vega-testnet",
  chainName: "Cosmos Testnet",
  chainIdentifier: "cosmoshub",
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: "cosmos",
    bech32PrefixAccPub: "cosmospub",
    bech32PrefixValAddr: "cosmosvaloper",
    bech32PrefixValPub: "cosmosvaloperpub",
    bech32PrefixConsAddr: "cosmosvalcons",
    bech32PrefixConsPub: "cosmosvalconspub",
  },
  currencies: [
    {
      coinDenom: "ATOM",
      coinMinimalDenom: "uatom",
      coinDecimals: 6,
      coinGeckoId: "cosmos",
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "ATOM",
      coinMinimalDenom: "uatom",
      coinDecimals: 6,
      coinGeckoId: "cosmos",
    },
  ],
  stakeCurrency: {
    coinDenom: "ATOM",
    coinMinimalDenom: "uatom",
    coinDecimals: 6,
    coinGeckoId: "cosmos",
  },
  coinType: 118,
  features: ["ibc-transfer", "ibc-go"],
  chainToAxelarChannelId: "channel-238"
} as CosmosChain;