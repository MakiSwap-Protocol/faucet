//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract HTClaim is ReentrancyGuard {
  using Address for address;
  address owner;
  uint256 totalBalance;

  uint256 constant public htAmount = 1000000000000000;
  event Received(address, uint);

  constructor() {
    owner = msg.sender;
  }

  receive() external payable {
    totalBalance += msg.value;
    emit Received(msg.sender, msg.value);
  }

  function claim(address receiver) external onlyOwner nonReentrant {
    require(!receiver.isContract(), "Only send HT token to address");
    (bool sent, bytes memory data) = receiver.call{value: htAmount}("");
    require(sent, "Failed to send Ether");
  }

  function totalSupply() external view returns (uint256) {
    return totalBalance;
  }
  
  modifier onlyOwner {
    require(msg.sender == owner, "Not Authorized");
    _;
  }

  function changeOwnership(address newOwner) onlyOwner {
    owner = newOwner;
  }
}
