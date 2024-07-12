"use client";
import { useState } from "react";
import { useWeb3Modal } from "@web3modal/ethers/react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { prescriptionContract } from "../../../../utils/config";
import { toast } from "react-toastify";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract } from "ethers";

export default function HospitalPrescription() {
  const router = useRouter();
  const { open } = useWeb3Modal();
  const [loader, setLoader] = useState(false);

  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [prescriptionData, setPrescriptionData] = useState("");
  const [patientAddress, setPatientAddress] = useState("");

  const handleWallet = () => {
    open();
  };

  const handleSubmitPrescription = async () => {
    if (!isConnected) {
      toast.error("Connect Your Wallet");
      return;
    }

    if (!prescriptionData || !patientAddress) {
      toast.error("Please enter prescription data and patient address");
      return;
    }

    try {
      setLoader(true);
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();

      const contract = new Contract(
        prescriptionContract.address,
        prescriptionContract.abi,
        signer
      );

      const isHospitalRegistered = await contract.isHospitalRegistered(address);
      if (!isHospitalRegistered) {
        toast.error("You are not Registered!");
        setLoader(false);
        return;
      }

      const tx = await contract.writePrescription(
        patientAddress,
        prescriptionData
      );
      await tx.wait();

      toast.success("Prescription submitted successfully");
      setLoader(false);
    } catch (error) {
      toast.error(error.message);
      setLoader(false);
    }
  };

  return (
    <div className="flex justify-center p-10 text-black">
      <div>
        <div className="text-5xl font-semibold text-black">
          Write Prescription
        </div>
        <div className="mt-5">
          <input
            type="text"
            className="w-full h-12 p-4 border border-gray-300 rounded-md"
            placeholder="Enter patient address..."
            value={patientAddress}
            onChange={(e) => setPatientAddress(e.target.value)}
          />
        </div>
        <div className="mt-5">
          <textarea
            className="w-full h-40 p-4 border border-gray-300 rounded-md"
            placeholder="Enter prescription data..."
            value={prescriptionData}
            onChange={(e) => setPrescriptionData(e.target.value)}
          ></textarea>
        </div>
        <div className="mt-5">
          <button
            className="px-8 py-2 text-xl font-semibold bg-yellow-500"
            onClick={handleSubmitPrescription}
            disabled={loader}
          >
            {loader ? "Submitting..." : "Submit Prescription"}
          </button>
        </div>
      </div>
    </div>
  );
}
