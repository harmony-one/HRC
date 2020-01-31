pragma solidity >=0.4.21 <0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";

contract HRC721 is ERC721Full, ERC721Mintable {
	//maps tokenIds to item indexes
	mapping(uint256 => uint256) private itemIndex;
	//sales
	// struct Sale {
	// 	//tight pack 256bits
	// 	uint128 price;
	// 	//end tight pack
    // }
	mapping(uint256 => uint256) private salePrice;
	
	constructor(string memory _name, string memory _symbol) ERC721Full(_name, _symbol) public {}

	function setSale(uint256 tokenId, uint256 price) public {
		address owner = ownerOf(tokenId);
        require(owner != address(0), "setSale: nonexistent token");
        require(owner == msg.sender, "setSale: msg.sender is not the owner of the token");
		salePrice[tokenId] = price;
	}

	function buyTokenOnSale(uint256 tokenId) public payable {
		uint256 price = salePrice[tokenId];
        require(price != 0, "buyToken: price equals 0");
        require(msg.value == price, "buyToken: price doesn't equal salePrice[tokenId]");
		address payable owner = address(uint160(ownerOf(tokenId)));
		// approve(address(this), tokenId);
		salePrice[tokenId] = 0;
		_transferFrom(owner, msg.sender, tokenId);
        owner.transfer(msg.value);
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