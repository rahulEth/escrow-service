// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract TrustlessEscrow {
    using ECDSA for bytes32;

    // Struct to store deposit information
    struct Deposit {
        address depositor;
        uint256 amount;
        address token; // Address(0) indicates ETH
        bytes32 beneficiaryHash;
        bool isReleased;
    }

    mapping(uint256 => Deposit) public deposits; // Mapping of depositId to Deposit
    uint256 public depositCount;

    event Deposited(
        uint256 indexed depositId,
        address indexed depositor,
        uint256 amount,
        address token,
        bytes32 beneficiaryHash
    );
    event Released(uint256 indexed depositId, address indexed beneficiary);

    /**
     * @notice Deposit ETH or ERC20 token with a hashed beneficiary address.
     * @param _token The ERC20 token address (use address(0) for ETH).
     * @param _amount The amount of ETH or tokens to deposit.
     * @param _beneficiaryHash The hash of the beneficiary address.
     */
    function depositFunds(address _token, uint256 _amount, bytes32 _beneficiaryHash) external payable {
        require(_beneficiaryHash != bytes32(0), "Beneficiary hash is required");

        if (_token == address(0)) {
            // ETH deposit
            require(msg.value == _amount, "ETH amount mismatch");
        } else {
            // ERC20 deposit
            require(msg.value == 0, "ETH not accepted with ERC20");
            require(IERC20(_token).transferFrom(msg.sender, address(this), _amount), "ERC20 transfer failed");
        }

        // Store deposit information
        deposits[depositCount] = Deposit({
            depositor: msg.sender,
            amount: _amount,
            token: _token,
            beneficiaryHash: _beneficiaryHash,
            isReleased: false
        });

        emit Deposited(depositCount, msg.sender, _amount, _token, _beneficiaryHash);
        depositCount++;
    }

    /**
     * @notice Release funds to the beneficiary if they provide a valid signature.
     * @param _depositId The ID of the deposit.
     * @param _beneficiary The actual beneficiary address.
     * @param _signature The off-chain signature from the beneficiary to authorize release.
     */
    function releaseFunds(uint256 _depositId, address _beneficiary, bytes memory _signature) external {
        Deposit memory deposit = deposits[_depositId];

        require(!deposit.isReleased, "Funds already released");
        require(
            deposit.beneficiaryHash == keccak256(abi.encodePacked(_beneficiary)),
            "Invalid beneficiary address"
        );

        // Construct the message hash and recover the signer's address
        bytes32 messageHash = keccak256(abi.encodePacked(_depositId, _beneficiary, address(this)));
        bytes32 ethSignedMessageHash = signMessageHash(messageHash);
        require(ECDSA.recover(ethSignedMessageHash, _signature) == _beneficiary, "Invalid signature");

        // Mark deposit as released and send funds
        deposit.isReleased = true;
        if (deposit.token == address(0)) {
            payable(_beneficiary).transfer(deposit.amount); // Transfer ETH
        } else {
            IERC20(deposit.token).transfer(_beneficiary, deposit.amount); // Transfer ERC20 tokens
        }

        emit Released(_depositId, _beneficiary);
    }


    function signMessageHash(bytes32 msgHash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", msgHash)); 
    } 
}