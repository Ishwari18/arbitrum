/* eslint-disable no-undef */
import { providers, ethers } from "ethers";
import { SwapWidget, darkTheme } from "@uniswap/widgets";

const infuraId = import.meta.env?.REACT_APP_INFURA_ID;
const JsonRpcEndpoint = `https://mainnet.infura.io/v3/${infuraId}`;
const JsonRpcProvider = new providers.JsonRpcProvider(JsonRpcEndpoint);
const provider = new ethers.providers.Web3Provider(JsonRpcProvider);

export default function SwapComponent() {
  return (
    <SwapWidget
      provider={provider}
      JsonRpcEndpoint={JsonRpcEndpoint}
      theme={darkTheme}
      width={"100%"}
    />
  );
}
