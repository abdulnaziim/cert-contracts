import { ethers } from "hardhat";

async function main() {
    const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const recipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    const cid = "QmXLAs9KbuNdLdtpQsTJeUDs1K4NyukQpnnS1EwSuQwTWz"; // IEDC certificate CID

    const CertificateNFT = await ethers.getContractFactory("CertificateNFT");
    const nft = CertificateNFT.attach(contractAddress);

    console.log("Minting IEDC certificate...");
    const tx = await nft.mint(recipient, cid);
    console.log(`Transaction sent: ${tx.hash}`);

    const receipt = await tx.wait();
    const transferEvent = receipt.logs.find((log: any) => {
        return log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
    });

    if (transferEvent) {
        const tokenId = BigInt(transferEvent.topics[3]).toString();
        console.log(`✅ Minted! Token ID: ${tokenId}`);
        console.log(`Hash: ${tx.hash}`);
    }
}

main().catch(console.error);
