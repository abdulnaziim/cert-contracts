
import { ethers } from "hardhat";

async function main() {
    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const recipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Owner/Backend wallet
    const cid = "QmNTFBu4KTEmWoC9ZHy8PkajrRXe2kRLjdJkb7oxLWp4bf"; // Use the CID from your logs

    console.log(`Attaching to contract at ${contractAddress}...`);
    const CertificateNFT = await ethers.getContractFactory("CertificateNFT");
    const nft = CertificateNFT.attach(contractAddress);

    console.log("Minting...");
    // Mint execution
    const tx = await nft.mint(recipient, cid);
    console.log(`Transaction sent: ${tx.hash}`);

    console.log("Waiting for receipt...");
    const receipt = await tx.wait();

    // Find Transfer event to get Token ID
    const transferEvent = receipt.logs.find((log: any) => {
        // Transfer generic topic
        return log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
    });

    if (transferEvent) {
        // The 3rd topic is tokenID in ERC721 Transfer(from, to, tokenId)
        const tokenId = BigInt(transferEvent.topics[3]).toString();
        console.log(`✅ Minted successfully! Token ID: ${tokenId}`);
    } else {
        console.log("❌ Minted, but Transfer event not found in logs.");
        console.log(receipt.logs);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
