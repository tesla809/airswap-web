import { ethers, Transaction } from "ethers";
import { Registry, Light, ERC20 } from "@airswap/protocols";
import { LightOrder } from "@airswap/types";
import { toAtomicString } from "@airswap/utils";

export async function requestOrder(
  chainId: number,
  signerToken: string,
  senderToken: string,
  senderAmount: string,
  senderWallet: string,
  provider: ethers.providers.Web3Provider
): Promise<LightOrder[]> {
  const servers = await new Registry(chainId, provider).getServers(
    signerToken,
    senderToken
  );
  const orders = servers.map(async (server) => {
    const order = await server.getSignerSideOrder(
      toAtomicString(senderAmount, 18),
      signerToken,
      senderToken,
      senderWallet
    );
    return order as any as LightOrder;
  });
  return Promise.all(orders);
}

export async function approveToken(
  senderToken: string,
  provider: ethers.providers.Web3Provider
) {
  const spender = Light.getAddress(provider.network.chainId);
  const approvalTxHash = await new ERC20(senderToken).approve(
    spender,
    provider.getSigner()
  );
  return approvalTxHash;
}

export async function takeOrder(
  order: LightOrder,
  provider: ethers.providers.Web3Provider
) {
  const tx = await new Light(provider.network.chainId, provider).swap(
    order,
    provider.getSigner()
  );
  return tx as any as Transaction;
}
