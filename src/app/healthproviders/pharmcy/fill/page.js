"use client";
import { useState, useEffect } from "react";
import { useWeb3Modal } from "@web3modal/ethers/react";
import { BrowserProvider, Contract } from "ethers";
import { toast } from "react-toastify";
import { prescriptionContract } from "../../../../utils/config";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";

export default function PharmacyPrescriptions() {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const [patientAddress, setPatientAddress] = useState("");
  const [pharmacyAddress, setPharmacyAddress] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loader1, setLoader1] = useState(false);

  useEffect(() => {
    if (isConnected) {
      setPharmacyAddress(address);
    }
  }, [address, isConnected]);

  useEffect(() => {
    if (pharmacyAddress) {
      fetchPrescriptions();
    }
  }, [pharmacyAddress]);

  const fetchPrescriptions = async () => {
    try {
      setLoader1(true);
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const contract = new Contract(
        prescriptionContract.address,
        prescriptionContract.abi,
        signer
      );

      const data = await contract.getPrescriptionHistory(patientAddress);
      setPrescriptions(data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoader1(false);
    }
  };

  const handleWallet = () => {
    open();
  };

  const handleGetPrescriptions = () => {
    if (!patientAddress) {
      toast.error("Please enter a patient address.");
      return;
    }
    fetchPrescriptions();
  };

  const handleStatusChange = async (prescriptionIndex) => {
    try {
      setLoader(true);

      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const contract = new Contract(
        prescriptionContract.address,
        prescriptionContract.abi,
        signer
      );

      const isPharmacyRegistered = await contract.isPharmacyRegistered(address);
      if (!isPharmacyRegistered) {
        toast.error("You are not Registered!");
        return;
      }

      const tx = await contract.markPrescriptionFilled(
        patientAddress,
        prescriptionIndex
      );
      await tx.wait();

      toast.success("Prescription status changed successfully");
      fetchPrescriptions();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="flex justify-center p-10 text-black">
      <div>
        <div className="mt-5">
          {!pharmacyAddress && (
            <button
              className="px-8 py-2 text-xl font-semibold bg-yellow-500"
              onClick={handleWallet}
            >
              Connect Wallet
            </button>
          )}
          {pharmacyAddress && (
            <div>
              <div className="mb-4">
                <label htmlFor="patientAddress" className="mr-2 font-semibold">
                  Patient Address:
                </label>
                <input
                  type="text"
                  id="patientAddress"
                  value={patientAddress}
                  onChange={(e) => setPatientAddress(e.target.value)}
                  className="p-1 border rounded-md"
                />
                <button
                  className="px-4 py-1 ml-2 font-semibold text-white bg-yellow-500 rounded-md"
                  onClick={handleGetPrescriptions}
                >
                  Get Prescriptions
                </button>
              </div>
              {loader1 && <p>Loading prescriptions...</p>}
              {prescriptions?.length == 0 && !loader1 && (
                <div className="py-8 font-bold text-center">
                  No prescriptions available.
                </div>
              )}
              {prescriptions?.length > 0 && (
                <div>
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
                        <div>
                          {prescription.filled
                            ? "Status : "
                            : "Change Status : "}
                          <button
                            className={`rounded-md px-2 ${
                              prescription.filled
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                            disabled={prescription.filled}
                            onClick={() => handleStatusChange(index)}
                          >
                            {prescription.filled ? "Filled" : "Not Filled"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
