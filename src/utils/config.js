const {
  PrescriptionManagement,
  RegistrationVault,
} = require("../../contracts/abi.json");

const ChainConfig = {
  core: {
    testnet: {
      id: 1115,
      name: "Core Blockchain Testnet",
      network: "Core Blockchain Testnet",
      nativeCurrency: {
        decimals: 18,
        name: "tCORE",
        symbol: "tCORE",
      },
      rpcUrls: ["https://rpc.test.btcs.network"],
      blockExplorers: ["https://scan.test.btcs.network"],
      PrescriptionContract: {
        address: "0xdA09d91E0C34E4E17e1F012c4c0d2D5180EFCcBB",
        abi: PrescriptionManagement,
      },
      VaultContract: {
        address: "0xBB76Af96713C7EF357d4326818d4d1B2C6B8A08D",
        abi: RegistrationVault,
      },
    },
  },
};

export const chainConfig = ChainConfig.core.testnet;
export const prescriptionContract = chainConfig.PrescriptionContract;
export const vaultContract = chainConfig.VaultContract;
