// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RegistrationVault {
    address public owner;
    mapping(address => uint) public registrationFees;

    event RegistrationFeeDeposited(address indexed sender, uint amount);
    event RegistrationFeeWithdrawn(address indexed receiver, uint amount);

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only contract owner can call this function"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function depositRegistrationFee() external payable {
        require(msg.value > 0, "Must send a non-zero amount");
        registrationFees[msg.sender] += msg.value;
        emit RegistrationFeeDeposited(msg.sender, msg.value);
    }

    function withdrawRegistrationFee(
        address _receiver,
        uint _amount
    ) external onlyOwner {
        require(
            _amount <= address(this).balance,
            "Insufficient balance in vault"
        );
        require(
            _amount <= registrationFees[_receiver],
            "Insufficient registration fees available"
        );

        registrationFees[_receiver] -= _amount;
        payable(_receiver).transfer(_amount);
        emit RegistrationFeeWithdrawn(_receiver, _amount);
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}
