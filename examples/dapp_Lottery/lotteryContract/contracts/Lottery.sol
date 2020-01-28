pragma solidity  >=0.5.8;

contract Lottery {
    address payable public manager;
    address payable[] public players;

    modifier restricted {
        require(msg.sender == manager);
        _; // '_': run all the reset of codes inside the function.
    }

    constructor() public {
        manager = msg.sender;
    }

    function enter() public payable {
        players.push(msg.sender);
    }

    // Pseudo Random Number Generator (Not exist in solidity, should write by ourself)
    function random() private view returns (uint) {
        return uint(uint(keccak256(abi.encodePacked(block.difficulty,now,players))));
    }

    function pickWinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(address(this).balance);
        resetPlayers();
    }

    function resetPlayers() private {
        players = new address payable[](0);
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }
}
