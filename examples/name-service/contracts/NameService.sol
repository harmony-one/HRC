pragma solidity >=0.4.21 <0.6.0;

contract NameService {

	mapping(address => bytes32) private names;
	mapping(bytes32 => address) private owners;
    
    constructor() public {}



    /********************************
    Public Interface
    ********************************/
    function setName(bytes32 name) public {
        names[msg.sender] = name;
        owners[name] = msg.sender;
    }
    function getName(address who) public view returns (bytes32) {
        return names[who];
    }
    function getOwner(bytes32 who) public view returns (address) {
        return owners[who];
    }

}