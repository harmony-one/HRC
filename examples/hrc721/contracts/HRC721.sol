pragma solidity >=0.4.21 <0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";

contract HRC721 is ERC721Full, ERC721Mintable {
	//maps tokenIds to item indexes
	mapping(uint256 => uint256) private itemIndex;
	
	constructor(string memory _name, string memory _symbol) ERC721Full(_name, _symbol) public {}

	function mintWithIndex(address to, uint256 index) public onlyMinter {
		uint256 tokenId = totalSupply() + 1;
		itemIndex[tokenId] = index;
        mint(to, tokenId);
	}

	function getItemIndex(uint256 tokenId) public view returns (uint256) {
		return itemIndex[tokenId];
	}
}