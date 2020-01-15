pragma solidity >=0.4.24 <0.6.0;

import "./HRC721.sol";
import "@openzeppelin/contracts/access/roles/MinterRole.sol";

contract HRC721Crowdsale is MinterRole {

	HRC721 token;
	mapping(address => uint256) public contributions;
	struct Item {
        uint8 minted;
		uint8 limit;
		string url;
    }
	Item[] private items;
	uint256 public totalItems;

	constructor(HRC721 _token) public {
		token = _token;
	}

	//inventory management
	function addItem(uint8 limit, string memory url) public onlyMinter {
		items.push(Item(0, limit, url));
		totalItems++;
	}

	//getting data
	function getLimit(uint256 index) public view returns (uint8) {
		return items[index].limit;
	}
	function getMinted(uint256 index) public view returns (uint8) {
		return items[index].minted;
	}
	function getUrl(uint256 index) public view returns (string memory) {
		return items[index].url;
	}
	function getTokenData(uint256 tokenId) public view returns (string memory) {
		return items[token.getItemIndex(tokenId)].url;
	}

	//sales and minting
	function mint(address to, uint256 index) public onlyMinter {
		uint8 minted = items[index].minted;
		uint8 limit = items[index].limit;
		require(minted < limit);
		items[index].minted++;
		token.mintWithIndex(to, index);
    }
	
	/********************************
	Testing, remove later
	721 ref
	function mint(address to, uint256 tokenId) public onlyMinter returns (bool) {
        _mint(to, tokenId);
        return true;
    }
	function totalSupply() public view returns (uint256) {
        return _allTokens.length;
    }

	********************************/
}