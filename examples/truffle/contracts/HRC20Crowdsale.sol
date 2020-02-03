pragma solidity >=0.4.24 <0.6.0;

import "openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";

contract HRC20Crowdsale is Crowdsale, MintedCrowdsale, CappedCrowdsale {

	mapping(address => uint256) public contributions;

	constructor(uint256 _rate, address payable _wallet, ERC20 _token, uint256 _cap)
	    Crowdsale(_rate, _wallet, _token)
	    CappedCrowdsale(_cap)
	public{}
}