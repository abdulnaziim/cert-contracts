// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract CertificateNFT is ERC721URIStorage, AccessControl {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    uint256 private nextTokenId;

    event CertificateMinted(uint256 indexed tokenId, address indexed to, string cid);
    event CertificateRevoked(uint256 indexed tokenId);

    mapping(uint256 => bool) public revoked;

    constructor() ERC721("CertificateNFT", "CERT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        nextTokenId = 99; // Start from 100
    }

    function mint(address to, string calldata ipfsCid) external returns (uint256) {
        uint256 tokenId = ++nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, string.concat("ipfs://", ipfsCid));
        emit CertificateMinted(tokenId, to, ipfsCid);
        return tokenId;
    }

    function revoke(uint256 tokenId) external {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || hasRole(ISSUER_ROLE, msg.sender),
            "Not authorized"
        );
        require(_ownerOf(tokenId) != address(0), "Invalid token");
        require(!revoked[tokenId], "Already revoked");
        revoked[tokenId] = true;
        emit CertificateRevoked(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(!revoked[tokenId], "Revoked");
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
