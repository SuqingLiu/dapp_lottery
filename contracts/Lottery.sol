pragma solidity ^0.8.0;

import "./MOKToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


contract Lottery is Ownable {
    using SafeMath for uint256;

    MOKToken private mokToken;
    address private feeAddress;
    uint256 private ticketPrice;
    uint256 private drawInterval;
    uint256 private lastDrawTime;
    uint256 private prizePool;
    uint256 private usageFees;

    mapping(address => uint256) private tickets;
    address[] private players;

    modifier onlyManager() {
        require(msg.sender == owner() || msg.sender == manager1 || msg.sender == manager2, "Not authorized");
        _;
    }

    constructor(
        MOKToken _mokToken,
        address _feeAddress,
        uint256 _ticketPrice,
        uint256 _drawInterval
    ) {
        mokToken = _mokToken;
        feeAddress = _feeAddress;
        ticketPrice = _ticketPrice;
        drawInterval = _drawInterval;
        lastDrawTime = block.timestamp;
    }

    // Variables for access control
    address public manager1;
    address public manager2;

    function setManagers(address _manager1, address _manager2) external onlyOwner {
        manager1 = _manager1;
        manager2 = _manager2;

        emit ManagersSet(_manager1, _manager2);
    }

    event ManagersSet(address indexed manager1, address indexed manager2);


    function getTicketPrice() external view returns (uint256) {
        return ticketPrice;
    }

    function getNumberOfTickets(address player) external view returns (uint256) {
        return tickets[player];
    }

    function getPrizePool() external view returns (uint256) {
        return prizePool;
    }

    function buyTickets(uint256 numTickets) external {
        uint256 amount = ticketPrice.mul(numTickets);
        mokToken.transferFrom(msg.sender, address(this), amount);
        prizePool = prizePool.add(amount.mul(95).div(100));
        usageFees = usageFees.add(amount.mul(5).div(100));
        tickets[msg.sender] = tickets[msg.sender].add(numTickets);
        players.push(msg.sender);

        emit TicketsBought(msg.sender, numTickets);
    }

    event TicketsBought(address indexed player, uint256 numTickets);

    function drawWinner() external onlyManager {
        require(block.timestamp >= lastDrawTime + drawInterval, "Cannot draw yet");
        require(players.length > 0, "No players in the lottery");

        uint256 winnerIndex = _pseudoRandom() % players.length;
        address winner = players[winnerIndex];

        mokToken.transfer(winner, prizePool);
        prizePool = 0;

        lastDrawTime = block.timestamp;

        delete players;

        emit WinnerDrawn(winner);
    }

    event WinnerDrawn(address indexed winner);

    function withdrawUsageFees() external onlyOwner {
        mokToken.transfer(feeAddress, usageFees);
        usageFees = 0;
    }

    function setTicketPrice(uint256 _ticketPrice) external onlyOwner {
        ticketPrice = _ticketPrice;

        emit TicketPriceSet(_ticketPrice);
    }

    event TicketPriceSet(uint256 ticketPrice);

    function _pseudoRandom() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, players)));
    }

    function getPlayers() external view returns (address[] memory) {
        return players;

    }

}

