pragma solidity >=0.4.24 <0.6.0;

import "./HRC721.sol";

contract HRC721Crowdsale {

	HRC721 token;
	mapping(address => uint256) public contributions;

	constructor(HRC721 _token) public {
		token = _token;
	}
	//remove later
	function mintWithData(address to, string memory url) public {
        token.mintWithTokenURI(to, token.totalSupply(), url);
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