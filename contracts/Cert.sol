// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Cert {
    event Issued(address indexed to, string cid);

    mapping(address => string[]) public issuedCIDs;

    function issue(address to, string calldata cid) external {
        issuedCIDs[to].push(cid);
        emit Issued(to, cid);
    }

    function getCIDs(address owner) external view returns (string[] memory) {
        return issuedCIDs[owner];
    }
}
