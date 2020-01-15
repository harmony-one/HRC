pragma solidity >=0.4.21 <0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721MetadataMintable.sol";

contract HRC721 is ERC721Full, ERC721MetadataMintable {
	constructor(string memory _name, string memory _symbol) ERC721Full(_name, _symbol) public {}
}