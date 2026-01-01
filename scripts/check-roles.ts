import { ethers } from "hardhat";

async function main() {
    const nftAddress = "0xB65B7752CD99460E295020850785D2070F0086B7";
    const nft = await ethers.getContractAt("CertificateNFT", nftAddress);
    
    const ISSUER_ROLE = await nft.ISSUER_ROLE();
    const addresses = [
        "0x9E16B3c61bdE5De13458b8C8F6D3D6f025144B7F",
        "0x5D36aD31a39223852B23230940e07685d41ed685",
        "0xE8C8c962A28418639094c9D8974D556D8D2C6aaA"
    ];

    for (const addr of addresses) {
        const hasRole = await nft.hasRole(ISSUER_ROLE, addr);
        console.log(`Address ${addr} has ISSUER_ROLE: ${hasRole}`);
    }
}

main().catch(console.error);
