import { expect } from "chai";
import { ethers } from "hardhat";

describe("Cert", function () {
  it("issues a certificate CID", async function () {
    const [owner, user] = await ethers.getSigners();
    const Cert = await ethers.getContractFactory("Cert");
    const cert = await Cert.deploy();
    await cert.waitForDeployment();
    await expect(cert.issue(user.address, "bafy..."))
      .to.emit(cert, "Issued")
      .withArgs(user.address, "bafy...");
  });
});
