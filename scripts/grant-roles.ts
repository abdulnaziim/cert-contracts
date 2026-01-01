import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Granting roles with account:", deployer.address);

  const nftAddress = process.env.CERTNFT_ADDRESS || process.argv[2];
  
  if (!nftAddress || !nftAddress.startsWith("0x")) {
    console.error("Error: CertificateNFT address is required");
    console.error("Usage: npx hardhat run scripts/grant-roles.ts --network <network>");
    console.error("Or set CERTNFT_ADDRESS environment variable");
    process.exit(1);
  }

  const issuerAddresses = process.env.ISSUER_ADDRESSES
    ? process.env.ISSUER_ADDRESSES.split(",").map((addr) => addr.trim())
    : process.argv.slice(3);

  if (issuerAddresses.length === 0) {
    console.error("Error: At least one issuer address is required");
    console.error("Usage: npx hardhat run scripts/grant-roles.ts --network <network> <nftAddress> <issuer1> [issuer2] ...");
    console.error("Or set ISSUER_ADDRESSES environment variable (comma-separated)");
    process.exit(1);
  }

  console.log("\nCertificateNFT Address:", nftAddress);
  console.log("Issuer addresses to grant role:", issuerAddresses);

  const CertificateNFT = await ethers.getContractFactory("CertificateNFT");
  const nft = await CertificateNFT.attach(nftAddress);

  // Get ISSUER_ROLE
  const ISSUER_ROLE = await nft.ISSUER_ROLE();
  console.log("\nISSUER_ROLE:", ISSUER_ROLE);

  // Check if deployer has admin role
  const DEFAULT_ADMIN_ROLE = await nft.DEFAULT_ADMIN_ROLE();
  const hasAdminRole = await nft.hasRole(DEFAULT_ADMIN_ROLE, deployer.address);
  
  if (!hasAdminRole) {
    console.error(`Error: Deployer address ${deployer.address} does not have DEFAULT_ADMIN_ROLE`);
    console.error("Only addresses with DEFAULT_ADMIN_ROLE can grant ISSUER_ROLE");
    process.exit(1);
  }

  // Grant ISSUER_ROLE to each address
  for (const issuerAddress of issuerAddresses) {
    try {
      const hasRole = await nft.hasRole(ISSUER_ROLE, issuerAddress);
      
      if (hasRole) {
        console.log(`✓ ${issuerAddress} already has ISSUER_ROLE`);
        continue;
      }

      console.log(`Granting ISSUER_ROLE to ${issuerAddress}...`);
      const tx = await nft.grantRole(ISSUER_ROLE, issuerAddress);
      await tx.wait();
      console.log(`✓ Granted ISSUER_ROLE to ${issuerAddress} (tx: ${tx.hash})`);
    } catch (error: any) {
      console.error(`✗ Failed to grant role to ${issuerAddress}:`, error.message);
    }
  }

  console.log("\n=== Role Grant Summary ===");
  for (const issuerAddress of issuerAddresses) {
    const hasRole = await nft.hasRole(ISSUER_ROLE, issuerAddress);
    console.log(`${issuerAddress}: ${hasRole ? "✓ Has ISSUER_ROLE" : "✗ Does not have ISSUER_ROLE"}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});





