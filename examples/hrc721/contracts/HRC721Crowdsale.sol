pragma solidity >=0.4.24 <0.6.0;

import "./HRC721.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/roles/MinterRole.sol";

contract HRC721Crowdsale is MinterRole, ReentrancyGuard {

    using SafeMath for uint256;
	//721 tokens
	HRC721 token;
	//sales
    address payable private wallet;
	mapping(address => uint256) public contributions;
	uint256 public raised;
	//inventory
	struct Item {
		//tight pack 256bits
        uint8 minted;
		uint8 limit;
		uint128 price;
		//end tight pack
		string url;
    }
	Item[] private items;
	uint256 public totalItems;

	constructor(HRC721 _token) public {
		wallet = msg.sender;
		token = _token;
	}

	//sales
    function purchase(address to, uint256 index) public nonReentrant payable {
        uint256 weiAmount = msg.value;
		require(to != address(0), "Crowdsale: beneficiary is the zero address");
        require(weiAmount != 0, "Crowdsale: weiAmount is 0");
		uint128 price = items[index].price;
        require(weiAmount == price, "Crowdsale: weiAmount does not equal price");
		_mint(to, index);
        raised = raised.add(weiAmount);
        wallet.transfer(msg.value);
    }
	function mint(address to, uint256 index) public onlyMinter {
		_mint(to, index);
	}
	function _mint(address to, uint256 index) internal {
		uint8 minted = items[index].minted;
		uint8 limit = items[index].limit;
		require(minted < limit, "Crowdsale: item limit reached");
        items[index].minted++;
		token.mintWithIndex(to, index);
	}

	//inventory management
	function addItem(uint8 limit, uint128 price, string memory url) public onlyMinter {
		items.push(Item(0, limit, price, url));
		totalItems++;
	}

	//getting data
	function getMinted(uint256 index) public view returns (uint8) {
		return items[index].minted;
	}
	function getLimit(uint256 index) public view returns (uint8) {
		return items[index].limit;
	}
	function getPrice(uint256 index) public view returns (uint128) {
		return items[index].price;
	}
	function getUrl(uint256 index) public view returns (string memory) {
		return items[index].url;
	}
	function getTokenData(uint256 tokenId) public view returns (string memory) {
		return items[token.getItemIndex(tokenId)].url;
	}

}