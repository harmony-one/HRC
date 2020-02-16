pragma solidity >=0.4.22 <0.7.0;

/// @title Voting with delegation.
contract DAO {
   // result of vote
   enum voteStatus { No_Vote, No, Yes }
   enum proposalState { Open, Active, Close }

   uint voteTime = 10 minutes; // how long the vote is held for
   // a new proposal is created
   event NewProposal (address from, uint256 id);

   // a proposal is activated
   event ActiveProposal (uint256 id, int voteCount);

   // a proposal is closed
   event CloseProposal (uint256 id);

   // a proposal is voted
   event VotedProposal (uint256 id, int voteCount);

   // This is a type for a single proposal.
   struct Proposal {
        uint256 id;                             // proposal id
        address proposer;                       // address of proposer
        uint128 voteCount;                      // number of accumulated votes
        uint timeframe;                         // expiration time of the proposal
        proposalState state;                    // state of the proposal
        mapping(address => voteStatus) voters;  //see whether voter has voted already
   }

   address public owner;

   uint public activeProposal;  // number of proposal will be active
   uint public minimalVoter;    // number of minimal vote needed to make the proposal active

   // This declares a state variable that
   // stores a `Voter` struct for each possible address.

   // A dynamically-sized array of `Proposal` structs.
   Proposal[] public proposals;

   /// Init the smart contract
   // HARDCODED minimalVoter for quorum
   constructor(uint numVoter) public {
      owner = msg.sender;
      minimalVoter = numVoter;
   }

   // Open a new proposal
   // May only be called by `chairperson`.
   function openProposal() public returns (uint256 id_){
      id_ = uint256(proposals.length) + 1;
      proposals.push(Proposal({
         id: id_,
         voteCount: 0,
         state: proposalState.Open,
         timeframe: now + voteTime,
         proposer: msg.sender
      }));
      emit NewProposal(msg.sender, id_);
   }

   // Change the state of the proposal to Active
   // if minimal number of vote met
   function tallyProposals() public returns (bool activated_) {
      for (uint i = 0; i < proposals.length; i++) {
         if(proposals[i].state == proposalState.Open && now > proposals[i].timeframe){
            if (proposals[i].voteCount > minimalVoter ) {
               proposals[i].state = proposalState.Active;
               activeProposal++;
               activated_ = true;
               emit ActiveProposal(proposals[i].id, proposals[i].voteCount);
            } else {
               activated_ = false;
            }
         }
      }
   }

   // Close the proposal
   // TODO implement delete for scaling
   function closeProposal(uint256 id) public returns (bool closed_) {
      for (uint i = 0; i < proposals.length; i++) {
         if (proposals[i].id == id) {
            proposals[i].state = proposalState.Close;
            closed_ = true;
            emit CloseProposal(id);
         }
      }
   }

   /// Vote to proposal `proposals[proposal].id`.
   /// Voter can only vote to proposal once
   // function voteNo(uint256 id) public returns (bool voted_){
   //    return vote(id, 0, voteStatus.No);
   // }

   // function voteYes(uint256 id, uint256 donation) public returns (bool voted_){
   //    return vote(id, donation, voteStatus.Yes);
   // }

   function vote(uint256 id, voteStatus a_vote) public payable returns (bool voted_) {
      for (uint i = 0; i < proposals.length; i++) {
         if (proposals[i].id == id) {
            
            require(now <= proposals[i].timeframe, "Time to vote has ended.");
            if (proposals[i].voters[msg.sender] != voteStatus.No_Vote) {
               return false;
            } else {
               if(a_vote == voteStatus.Yes){
                  address payable daoAddress = address(uint160(address(this)));
                  daoAddress.transfer(msg.value);
               }
               proposals[i].voters[msg.sender] = a_vote;
               proposals[i].voteCount ++;
               if (proposals[i].voteCount > minimalVoter) {
                  proposals[i].state = proposalState.Active;
                  emit ActiveProposal(id, proposals[i].voteCount);
               }
               emit VotedProposal(id, proposals[i].voteCount);
               return true;
            }
         }
      }
   }

   /// @dev Computes all the proposals that are Active
   /// previous votes into account.
   function allFilteredProposals(proposalState state) public view
         returns (uint256[] memory)
   {
      uint256[] memory activeProposals_ = new uint256[](proposals.length);
      uint256 count = 0;
      for (uint p = 0; p < proposals.length; p++) {
         if (proposals[p].state == state) {
            activeProposals_[count] = proposals[p].id;
            count++;
         }
      }
      return activeProposals_;
   }

   // return the state of the proposal
   function getProposalState(uint256 id) public view
         returns (proposalState p)
   {
      for (uint i = 0; i < proposals.length; i++) {
         if (proposals[i].id == id) {
            p = proposals[i].state;
            return p;
         }
      }
   }
   
   function getNow() public view returns (bool){
       return now > proposals[0].timeframe;
   }
   // donate donates to proposal
   // function donate(byte32 name) {
   // }


   // claim the donation, and maybe close the proposal
   // function claim(byte32 name) {

   // }
   receive () external payable {}
}