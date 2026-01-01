import { ethers } from "hardhat";

async function main() {
    const nftAddress = "0xB65B7752CD99460E295020850785D2070F0086B7";
    const nft = await ethers.getContractAt("CertificateNFT", nftAddress);
    
    for (let i = 1; i <= 10; i++) {
        try {
            const uri = await nft.tokenURI(i);
            console.log(`Token ${i}: ${uri}`);
        } catch (e) {
            // maybe doesn't exist
        }
    }
}

main().catch(console.error);
