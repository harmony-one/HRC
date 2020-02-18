pragma solidity >=0.4.21 <0.6.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";

contract Faucet is Ownable {

    uint256 public rate;
    uint256 public freq;
    //maps addresses to last funded block number
	mapping(address => uint256) private lastBlock;
    
    constructor() public payable {
        rate = 100000000000000000; //fund with 0.1 ONE
        freq = 4; //will fund address every 4th block
    }

    function addFunds() public payable {}

    function fund(address to) public {
        uint256 currentBlock = block.number;
        require(currentBlock - lastBlock[to] >= freq);
        lastBlock[to] = currentBlock;
        address payable receiver = address(uint160(to));
		receiver.transfer(rate);
	}
    /********************************
    Getters / Setters
    ********************************/
    function getBalance() public view returns (uint256) {
		return address(this).balance;
	}
    function setRate(uint256 _rate) public onlyOwner {
		rate = _rate;
	}
    function setFreq(uint256 _freq) public onlyOwner {
		rate = _freq;
	}
}