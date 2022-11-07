pragma solidity >=0.4.21 <0.6.0;

contract Puzzle {
    string internal constant RESTRICTED_MESSAGE = "Unauthorized Access";
    string internal constant LEVEL_LIMIT = "Not Reach Level Limit";

    uint constant thresholdLevel = 10;
    uint constant topK = 10;
    mapping(address => uint) playerLevel;
    mapping(address => string) playerSequence;
    mapping(address => string) boardState;
    address[] topPlayers;
    uint[] topScores;
    uint current;

    address public manager;  // The adress of the owner of this contract

    constructor() public payable {
        manager = msg.sender;
        current = 0;
        topPlayers = new address[](topK);
        topScores = new uint[](topK);
    }

    function payout(address player, uint level, string memory sequence, string memory state) public restricted {
        require(level > thresholdLevel, LEVEL_LIMIT);
        if (playerLevel[player] < level) {
            playerLevel[player] = level;
            playerSequence[player] = sequence;
            boardState[player] = state;

            // the player is already in the topK.
            uint i = current;
            for (uint j=0; j < current; j++) {
                if (topPlayers[j] == player) {
                    i = j;
                    break;
                }
            }
            if (i == current && current < topK) {
                current++;
            }
            // Sorting.
            while (i > 0 && playerLevel[topPlayers[i-1]] < level) {
                if (i < topK) {
                    topPlayers[i] = topPlayers[i-1];
                }
                i--;
            }
            if (i < current) {
                topPlayers[i] = player;
            }
        }   
    }

    modifier restricted() {
        require(msg.sender == manager, RESTRICTED_MESSAGE);
        _;
    }

    function getSequence(address player) public restricted view returns (string memory) {
        return playerSequence[player];
    }

    function getTopPlayer()public view returns(address[] memory){
        return topPlayers;
    }

    function getTopScores()public returns(uint[] memory){
        for(uint i=0;i<topK;i++) {
            topScores[i] = playerLevel[topPlayers[i]];
        }
        return topScores;
    }

    function getLevel(address player) public restricted view returns (uint) {
        return playerLevel[player];
    }
}
