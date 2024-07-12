// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IRegistrationVault {
    function depositRegistrationFee() external payable;
    function withdrawRegistrationFee(address _receiver, uint _amount) external;
    function getBalance() external view returns (uint);
}

contract PrescriptionManagement {
    address public owner;
    IRegistrationVault public registrationVault;
    uint registrationFee = 0.001 ether;

    struct Hospital {
        bool isRegistered;
    }

    struct Pharmacy {
        bool isRegistered;
    }

    struct Prescription {
        address hospitalAddress;
        address filledBy;
        string prescriptionData;
        bool filled;
    }

    mapping(address => Hospital) public hospitals;
    mapping(address => Pharmacy) public pharmacies;
    mapping(address => Prescription[]) public patientPrescriptions;

    event HospitalRegistered(address indexed hospitalAddress);
    event PharmacyRegistered(address indexed pharmacyAddress);
    event PrescriptionWritten(
        address indexed hospitalAddress,
        string prescriptionData
    );
    event PrescriptionFulfilled(
        address indexed pharmacyAddress,
        uint indexed prescriptionIndex
    );

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only contract owner can call this function"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        registrationVault = IRegistrationVault(
            0xf996c1BcbB4EeB185FA74431f10613B571015d41
        );
    }

    function registerHospital() external payable {
        registrationVault.depositRegistrationFee{value: msg.value}();
        hospitals[msg.sender] = Hospital(true);
        emit HospitalRegistered(msg.sender);
    }

    function registerPharmacy() external payable {
        registrationVault.depositRegistrationFee{value: msg.value}();
        pharmacies[msg.sender] = Pharmacy(true);
        emit PharmacyRegistered(msg.sender);
    }

    function writePrescription(
        address _patientAddress,
        string memory _prescriptionData
    ) external {
        require(
            hospitals[msg.sender].isRegistered,
            "Hospital is not registered"
        );
        Prescription memory newPrescription = Prescription(
            msg.sender,
            address(0),
            _prescriptionData,
            false
        );
        patientPrescriptions[_patientAddress].push(newPrescription);
        emit PrescriptionWritten(msg.sender, _prescriptionData);
    }

    function markPrescriptionFilled(
        address _patientAddress,
        uint _prescriptionIndex
    ) external {
        require(
            pharmacies[msg.sender].isRegistered,
            "Pharmacy is not registered"
        );
        require(
            _prescriptionIndex < patientPrescriptions[_patientAddress].length,
            "Invalid prescription index"
        );
        require(
            !patientPrescriptions[_patientAddress][_prescriptionIndex].filled,
            "Prescription is already marked as filled"
        );

        patientPrescriptions[_patientAddress][_prescriptionIndex].filled = true;
        patientPrescriptions[_patientAddress][_prescriptionIndex].filledBy = msg
            .sender;
        emit PrescriptionFulfilled(msg.sender, _prescriptionIndex);
    }

    function getPrescriptionHistory(
        address _patientAddress
    ) external view returns (Prescription[] memory) {
        return patientPrescriptions[_patientAddress];
    }

    function isHospitalRegistered(
        address _hospitalAddress
    ) external view returns (bool) {
        return hospitals[_hospitalAddress].isRegistered;
    }

    function isPharmacyRegistered(
        address _pharmacyAddress
    ) external view returns (bool) {
        return pharmacies[_pharmacyAddress].isRegistered;
    }
}
