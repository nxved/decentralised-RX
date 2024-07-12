"use client";

import { useState, useEffect } from "react";
import { prescriptionContract } from "../../utils/config";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { useWeb3Modal } from "@web3modal/ethers/react";
import { BrowserProvider, Contract } from "ethers";

import { toast } from "react-toastify";

export default function PatientPrescriptions() {
  const { open, close } = useWeb3Modal();
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const [prescriptions, setPrescriptions] = useState([]);
  const [loader, setLoader] = useState(false);
  const [noPresections, setNoPresections] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, [address]);

  const fetchPrescriptions = async () => {
    setLoader(true);
    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const prescriptionContractInstance = new Contract(
        prescriptionContract.address,
        prescriptionContract.abi,
        signer
      );

      const data = await prescriptionContractInstance.getPrescriptionHistory(
        address
      );
      console.log(data);
      setPrescriptions(data);
      if (data == 0) {
        setNoPresections(true);
      } else {
        setNoPresections(false);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoader(false);
    }
  };

  const handleWallet = () => {
    open();
  };

  return (
    <div className="flex justify-center p-10 text-black">
      <div>
        <div className="mt-5">
          {!address && (
            <button
              className="px-8 py-2 text-xl font-semibold bg-yellow-500"
              onClick={handleWallet}
            >
              Connect Wallet
            </button>
          )}
          {loader && <p>Loading prescriptions...</p>}
          {address && noPresections && (
            <div className="pt-24 text-5xl font-semibold text-center">
              You do not have any Prescription
            </div>
          )}
          {address && prescriptions?.length > 0 && (
            <div>
              <div className="py-4 pb-8 text-5xl font-semibold text-center">
                Your Prescriptions
              </div>
              <div className="flex flex-wrap justify-center">
                {prescriptions.map((prescription, index) => (
                  <div
                    key={index}
                    className="p-4 m-2 border border-yellow-500 rounded-lg shadow-lg"
                  >
                    <div className="mb-4 font-semibold">Prescription:</div>
                    <div>
                      {prescription.prescriptionData
                        .split(",")
                        .map((medicine, i) => (
                          <div key={i}>{medicine.trim()}</div>
                        ))}
                    </div>
                    <div className="mt-4">
                      <div>Written By: {prescription.hospitalAddress}</div>
                      {prescription.filled && (
                        <div>Filled By: {prescription.filledBy}</div>
                      )}
                      <div>
                        Status:{" "}
                        <span
                          className={`rounded-md px-2 ${
                            prescription.filled ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          {prescription.filled ? "Filled" : "Not Filled"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
