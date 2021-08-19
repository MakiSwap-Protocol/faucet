const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HTClaim", function () {
  let htclaim;
  let owner, addr1;
  
  before(async () => {
    const HTClaim = await ethers.getContractFactory("HTClaim");
    [owner, addr1] = await ethers.getSigners();
    htclaim = await HTClaim.connect(owner).deploy();
    await htclaim.deployed();
  })

  it("Should able to deposit from any address", async function () {
    const _before = htclaim.totalSupply()
    addr1.sendTransaction({
      to: htclaim.address,
      value: ethers.utils.parseEther("1")
    });
    
    const _after = htclaim.totalSupply()
    expect(_after - _before == ethers.utils.parseEther("1"), "Amount mismatch!")
  });

  it("Claim test", async function() {
    const _beforeBalance = await addr1.getBalance()
    await htclaim.connect(owner).claim(addr1.address)
    const _afterBalance = await addr1.getBalance()
    expect(ethers.BigNumber.from(_afterBalance).sub(_beforeBalance).toString() == 1000000000000000, "Claim failed")

    await expect(htclaim.connect(addr1).claim(addr1.address)).to.be.revertedWith("Not Authorized")
    await expect(htclaim.connect(owner).claim(htclaim.address)).to.be.revertedWith("Only send HT token to address")
  })
});
