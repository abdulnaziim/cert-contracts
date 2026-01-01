import { ethers } from "hardhat";

async function main() {
    const nftAddress = "0xB65B7752CD99460E295020850785D2070F0086B7";
    const nft = await ethers.getContractAt("CertificateNFT", nftAddress);
    
    const ISSUER_ROLE = await nft.ISSUER_ROLE();
    const newIssuers = [
        "0x5D36aD31a39223852B23230940e07685d41ed685",
        "0xE8C8c962A28418639094c9D8974D556D8D2C6aaA"
    ];

    console.log("Granting ISSUER_ROLE to new addresses...");

    for (const addr of newIssuers) {
        console.log(`Granting to ${addr}...`);
        const tx = await nft.grantRole(ISSUER_ROLE, addr);
        await tx.wait();
        console.log(`Done! Hash: ${tx.hash}`);
    }
    
    console.log("All roles granted successfully.");
}

main().catch(console.error);
