pragma solidity >=0.4.22 <0.7.0;

/// @title Voting with delegation.
contract DAO {
    // This declares a new complex type which will
    // be used for variables later.
    // It will represent a single voter.
    struct Voter {
       mapping(byte32 => bool) voted; // map of the voted proposal
    }

    enum proposalState { Open, Active, Close };

    // a new proposal is created
    event NewProposal (address from, byte32 name);

    // a proposal is activated
    event ActiveProposal (byte32 name, int voteCount);

    // a proposal is closed
    event CloseProposal (byte32 name);

    // a proposal is voted
    event VotedProposal (byte32 name, int voteCount);

    // This is a type for a single proposal.
    struct Proposal {
        bytes32 name;         // short name (up to 32 bytes)
        uint voteCount;       // number of accumulated votes
        uint256 donation;     // amount of donation to this proposal
        proposalState state;  // state of the proposal
        uint minimal;         // mimimal amount of donation
        unit maximal;         // maximal amount of donation
    }

    address public chairperson;

    uint public activeProposal;  // number of proposal will be active
    uint public minimalVoter;    // number of minimal vote needed to make the proposal active

    // This declares a state variable that
    // stores a `Voter` struct for each possible address.
    mapping(address => Voter) public voters;

    // A dynamically-sized array of `Proposal` structs.
    Proposal[] public proposals;

    /// Init the smart contract
    constructor(uint numVoter) public {
       requiree(numVoter > 2, "at least 2 voters needed to activate the proposal")
       chairperson = msg.sender;
       minimalVoter = numVoter;
    }

    // Open a new proposal
    // May only be called by `chairperson`.
    function openProposal(byte32 name, uint min, unit max) public {
        require(
            msg.sender == chairperson,
            "Only chairperson can open proposal."
        );
        require(max > min,
            "max donation has to be greater than min donation."
        );
        proposals.push(Proposal({
            name: name,
            voteCount: 0,
            state: Open,
            minimal: min,
            maximal: max,
        }));
        emit NewProposal(name);
    }

    // Change the state of the proposal to Active
    // if minimal number of vote met
    function activateProposal(byte32 name) public (returns bool activated_) {
        require(
            msg.sender == chairperson,
            "Only chairperson can activate proposal."
        );
        for (uint i = 0; i < proposals.length; i++) {
           if (proposals[i].name == name) {
              if (proposals[i].voteCount > minimalVoter) {
                 proposals[i].state = Active;
                 activated_ = true;
                 emit ActiveProposal(name, proposals[i].voteCount);
                 returns;
              } else {
                 activated_ = false
              }
           }
        }
    }

    // Close the proposal
    function closeProposal(byte32 name) public (returns bool closed_) {
        require(
            msg.sender == chairperson,
            "Only chairperson can activate proposal."
        );
        for (uint i = 0; i < proposals.length; i++) {
           if (proposals[i].name == name) {
              proposals[i].state = Close;
              closed_ = true;
              emit CloseProposal(name);
              returns;
           }
        }
    }

    /// Vote to proposal `proposals[proposal].name`.
    /// Voter can only vote to proposal once
    function vote(byte32 name) public (returns bool voted_) {
        Voter storage sender = voters[msg.sender];

        for (uint i = 0; i < proposals.length; i++) {
           if (proposals[i].name == name) {
              if (voters[msg.sender].voted[name]) {
                 voted_ = false;
                 returns;
              } else {
                 voters[msg.sender].voted[name] = true;
                 voted_ = true;
                 proposals[i].voteCount ++;
                 if (proposals[i].voteCount > minimalVoter) {
                    proposals[i].state = Active;
                 }
                 emit VotedProposal(name, proposals[i].voteCount);
                 emit ActiveProposal(name, proposals[i].voteCount);
                 returns;
              }
           }
        }
    }

    /// @dev Computes all the proposals that are Active
    /// previous votes into account.
    function allActiveProposal() public view
            returns (byte32[] activeProposals_)
    {
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > minimalVoter) {
               proposals[p].state = Active;
               activeProposals_.push(proposals[p].name);
            }
        }
    }

    // return the state of the proposal
    function proposalState(byte32 name) public view
            returns (proposal p)
    {
       for (uint p = 0; p < proposals.length; p++) {
           if (proposals[i].name == name) {
              p = proposals[i];
              returns;
            }
       }
    }
            
    // donate donates to proposal
    function donate(byte32 name) {
    }


    // claim the donation, and maybe close the proposal
    function claim(byte32 name) {

    }
}
