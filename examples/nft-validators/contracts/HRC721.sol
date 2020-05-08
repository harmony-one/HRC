pragma solidity >=0.4.21 <0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";

contract HRC721 is ERC721Full, ERC721Mintable {
	//maps tokenIds to item indexes
	mapping(uint256 => uint256) private itemIndex;
	//maps tokenIds to salePrice, sale means price of > 0
	mapping(uint256 => uint256) private salePrice;
	
	constructor(string memory _name, string memory _symbol) ERC721Full(_name, _symbol) public {}

	function setSale(uint256 tokenId, uint256 price, address saleContract) public {
		address owner = ownerOf(tokenId);
        require(owner != address(0), "setSale: nonexistent token");
        require(owner == msg.sender, "setSale: msg.sender is not the owner of the token");
		salePrice[tokenId] = price;
		approve(saleContract, tokenId);
	}

	function minterSetSale(uint256 tokenId, uint256 price) public onlyMinter {
		salePrice[tokenId] = price;
	}

	function mintWithIndex(address to, uint256 index) public onlyMinter {
		uint256 tokenId = totalSupply() + 1;
		itemIndex[tokenId] = index;
        mint(to, tokenId);
	}

	function getItemIndex(uint256 tokenId) public view returns (uint256) {
		return itemIndex[tokenId];
	}

	function getSalePrice(uint256 tokenId) public view returns (uint256) {
		return salePrice[tokenId];
	}
}