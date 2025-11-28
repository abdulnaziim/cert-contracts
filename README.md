# cert-contracts

Smart contracts for the certification dApp:
- `Cert.sol`: store simple certificate IPFS CIDs per address.
- `CertificateNFT.sol`: ERC-721 certificates with URI set to `ipfs://<CID>`, plus revoke and role-gated minting.

## Prerequisites

- Node.js 18+
- npm 9+
- A funded deployer key for your target testnet/mainnet (for deployment)

## Install

```bash
npm install
```

## Build

```bash
npx hardhat compile
```

## Test

```bash
npx hardhat test
```

## Configure networks

Set up a `.env` file in `cert-contracts/` with your RPC URLs and deployer private key:

```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/<project_id>
MAINNET_RPC_URL=https://mainnet.infura.io/v3/<project_id>
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
```

Then update `hardhat.config.ts` if needed to reference these env vars (sepolia, mainnet, localhost are typical).

## Deploy

Local (anvil/hardhat node):

```bash
# In one terminal
npx hardhat node

# In another terminal
npx hardhat run scripts/deploy.ts --network localhost
```

Sepolia:

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

This should print deployed addresses for both `Cert` and `CertificateNFT`.

## Grant roles (CertificateNFT)

`CertificateNFT` enforces roles:
- `ISSUER_ROLE`: can call `mint(to, ipfsCid)`
- `DEFAULT_ADMIN_ROLE`: can call `revoke(tokenId)` and grant roles

Grant issuer role to an account (Hardhat console):

```bash
npx hardhat console --network sepolia
```

```js
// Inside console (ethers v6)
const nftAddr = "0xYourCertificateNFT";
const issuer = "0xIssuerWallet";
const abi = [
  "function grantRole(bytes32 role, address account)",
  "function ISSUER_ROLE() view returns (bytes32)",
];
const nft = await ethers.getContractAt(abi, nftAddr);
const role = await nft.ISSUER_ROLE();
await nft.grantRole(role, issuer);
```

Revoke a token (admin only):

```js
const nftAddr = "0xYourCertificateNFT";
const abi = ["function revoke(uint256 tokenId)"];
const nft = await ethers.getContractAt(abi, nftAddr);
await nft.revoke(1n);
```

## Frontend wiring

After deployment, copy addresses into `cert-frontend/.env.local`:

```
NEXT_PUBLIC_CERT_ADDRESS=0x...
NEXT_PUBLIC_CERTNFT_ADDRESS=0x...
```

Ensure `NEXT_PUBLIC_WC_PROJECT_ID` is set in the frontend as well. Then run the frontend:

```bash
cd ../cert-frontend
npm install
npm run dev
```

Open `http://localhost:3000`, connect your wallet, and use the Cert and CertificateNFT sections to interact.

## Contract notes

- `Cert.sol`
  - `issue(to, cid)`: adds a CID for an address; emits `Issued(to, cid)`
  - `getCIDs(owner)`: returns `string[]` of CIDs

- `CertificateNFT.sol`
  - `mint(to, ipfsCid)`: mints token and sets tokenURI to `ipfs://<ipfsCid>` (requires `ISSUER_ROLE`)
  - `revoke(tokenId)`: marks a token as revoked (requires `DEFAULT_ADMIN_ROLE`), and causes `tokenURI` to revert for that token
