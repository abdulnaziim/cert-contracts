import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy Cert contract
  const Cert = await ethers.getContractFactory("Cert");
  const cert = await Cert.deploy();
  await cert.waitForDeployment();
  const certAddress = await cert.getAddress();
  console.log("Cert deployed to:", certAddress);

  // Deploy CertificateNFT contract
  const CertificateNFT = await ethers.getContractFactory("CertificateNFT");
  const certificateNFT = await CertificateNFT.deploy();
  await certificateNFT.waitForDeployment();
  const nftAddress = await certificateNFT.getAddress();
  console.log("CertificateNFT deployed to:", nftAddress);

  console.log("\n=== Deployment Summary ===");
  console.log("Cert Address:", certAddress);
  console.log("CertificateNFT Address:", nftAddress);
  console.log("\nCopy these addresses to your frontend .env.local:");
  console.log(`NEXT_PUBLIC_CERT_ADDRESS=${certAddress}`);
  console.log(`NEXT_PUBLIC_CERTNFT_ADDRESS=${nftAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
