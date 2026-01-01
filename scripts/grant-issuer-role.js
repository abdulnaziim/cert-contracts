const hre = require("hardhat");

async function main() {
    // Get contract addresses from environment or use defaults
    const nftAddress = process.env.CERTNFT_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

    console.log("Granting ISSUER_ROLE to backend wallet...");
    console.log("NFT Contract:", nftAddress);

    const nft = await hre.ethers.getContractAt("CertificateNFT", nftAddress);

    // Get the ISSUER_ROLE hash
    const ISSUER_ROLE = await nft.ISSUER_ROLE();
    console.log("ISSUER_ROLE:", ISSUER_ROLE);

    // Get the first Hardhat account (this is what the backend uses)
    const [deployer] = await hre.ethers.getSigners();
    const backendWallet = deployer.address;
    console.log("Backend Wallet:", backendWallet);

    // Check if already has role
    const hasRole = await nft.hasRole(ISSUER_ROLE, backendWallet);

    if (hasRole) {
        console.log("✅ Backend wallet already has ISSUER_ROLE");
    } else {
        console.log("⏳ Granting ISSUER_ROLE...");
        const tx = await nft.grantRole(ISSUER_ROLE, backendWallet);
        await tx.wait();
        console.log("✅ ISSUER_ROLE granted!");
        console.log("Transaction:", tx.hash);
    }

    // Verify
    const verified = await nft.hasRole(ISSUER_ROLE, backendWallet);
    console.log("\n🔍 Verification:", verified ? "SUCCESS" : "FAILED");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
