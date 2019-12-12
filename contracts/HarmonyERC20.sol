pragma solidity >=0.4.21 <0.6.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract HarmonyERC20 is ERC20, ERC20Detailed {

    event MintingEvent(address indexed owner, uint256 amount);
    // event TransferEvent(address indexed owner, uint256 amount);

    constructor(string memory _name, string memory _symbols, uint8 _decimals, uint256 _amount) 
      ERC20Detailed(_name, _symbols, _decimals)
      public {

      _mint(msg.sender, _amount);

      emit MintingEvent(msg.sender, _amount);
    }

    // function transfer(address recipient, uint256 amount) public returns (bool) {
    //   emit TransferEvent(recipient, amount);
    //   _transfer(_msgSender(), recipient, amount);
    //   return true;
    // }
}