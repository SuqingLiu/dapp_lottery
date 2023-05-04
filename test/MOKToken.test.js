const { expect } = require("chai");
const { ethers } = require("hardhat");



const increaseTime = async (seconds) => {
  await ethers.provider.send("evm_increaseTime", [seconds]);
  await ethers.provider.send("evm_mine");
};

describe("MOKToken", function () {
  let MOKToken, owner, accounts;
  before(async () => {
    [owner, ...accounts] = await ethers.getSigners();
  });

  beforeEach(async () => {
    MOKToken = await ethers.getContractFactory("MOKToken");
    mokToken = await MOKToken.deploy(10000);
    await mokToken.deployed();
  });

  it("should put 10000 MOKToken in the first account", async () => {
    const balance = await mokToken.balanceOf(owner.address);
    expect(balance.toNumber()).to.equal(10000);
  });
});

describe("Lottery", function () {
  let MOKToken, Lottery, mokToken, lottery, owner, accounts;

  before(async () => {
    [owner, ...accounts] = await ethers.getSigners();
  });

  beforeEach(async () => {
    MOKToken = await ethers.getContractFactory("MOKToken");
    mokToken = await MOKToken.deploy(10000);
    await mokToken.deployed();

    Lottery = await ethers.getContractFactory("Lottery");
    lottery = await Lottery.deploy(mokToken.address, owner.address, 20, 300);
    await lottery.deployed();
  });

  it("should allow players to buy tickets", async () => {
    const numTickets = 5;
    const ticketPrice = await lottery.getTicketPrice();
    const amount = ticketPrice.mul(numTickets);

    // Transfer MOKToken from owner to accounts[1]
    await mokToken.transfer(accounts[1].address, amount);

    // Approve and buy tickets
    await mokToken.connect(accounts[1]).approve(lottery.address, amount);
    await lottery.connect(accounts[1]).buyTickets(numTickets);

    const playerBalance = await lottery.getNumberOfTickets(accounts[1].address);
    expect(playerBalance.toNumber()).to.equal(numTickets);

    const poolBalance = await lottery.getPrizePool();
    expect(poolBalance.toNumber()).to.equal(amount.mul(95).div(100).toNumber());
  });

  it("should only allow the owner and managers to draw the lottery", async () => {
    const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/GVFZZS3r-1dSw9AlYwNOXf7Ve_mJxnJ5");
    const owner = new ethers.Wallet("2186a00fd5db162e8ac5c18259b92f4abe52ca7c90a0091b125b8245deb4b336", provider);
  
    // Transfer MOKToken from owner to accounts[1] and accounts[2]
    const numTickets = 5;
    const ticketPrice = await lottery.getTicketPrice();
    const amount = ticketPrice.mul(numTickets);
  
    await mokToken.transfer(accounts[1].address, amount);
    await mokToken.transfer(accounts[2].address, amount);
  
    // Approve and buy tickets for accounts[1] and accounts[2]
    await mokToken.connect(accounts[1]).approve(lottery.address, amount);
    await mokToken.connect(accounts[2]).approve(lottery.address, amount);
    await lottery.connect(accounts[1]).buyTickets(numTickets);
    await lottery.connect(accounts[2]).buyTickets(numTickets);
  
    await lottery.setManagers(accounts[2].address, accounts[3].address);
  
    // Increase time by 5 minutes
    await increaseTime(5 * 60);
  
    // Test that owner can draw
    await lottery.connect(owner).drawWinner();
  
    // Test that manager1 can draw
    await lottery.connect(accounts[2]).drawWinner();
  
    // Test that manager2 can draw
    await lottery.connect(accounts[3]).drawWinner();
  
    // Test that other accounts cannot draw
    try {
      await lottery.connect(accounts[4]).drawWinner();
      assert.fail("Non-manager account should not be able to draw the lottery");
    } catch (error) {
      assert.include(error.message, "Not authorized");
    }
  });
  
  
  

  it("should only allow the owner to adjust the ticket price", async () => {
    const newTicketPrice = 30;
  
    // Test that owner can adjust the ticket price
    await lottery.setTicketPrice(newTicketPrice, { from: owner });
  
    // Test that other accounts cannot adjust the ticket price
    try {
      await lottery.setTicketPrice(newTicketPrice, { from: accounts[1] });
      assert.fail("Non-owner account should not be able to adjust the ticket price");
    } catch (error) {
      assert.include(error.message, "Ownable: caller is not the owner");
    }
  });
  
  it("should allow the owner to withdraw usage fees", async () => {
    const numTickets = 5;
    const ticketPrice = await lottery.getTicketPrice();

    const amount = ticketPrice * numTickets;
  
    // Transfer MOKToken from owner to accounts[1] and accounts[2]
    await mokToken.transfer(accounts[1], amount, { from: owner });
    await mokToken.transfer(accounts[2], amount, { from: owner });
  
    // Approve and buy tickets for accounts[1] and accounts[2]
    await mokToken.approve(lottery.address, amount, { from: accounts[1] });
    await mokToken.approve(lottery.address, amount, { from: accounts[2] });
    await lottery.buyTickets(numTickets, { from: accounts[1] });
    await lottery.buyTickets(numTickets, { from: accounts[2] });
  
    const expectedUsageFees = amount * 0.05 * 2;
  
    // Test that owner can withdraw usage fees
    const initialOwnerBalance = await mokToken.balanceOf(owner);
    await lottery.withdrawUsageFees({ from: owner });
    const finalOwnerBalance = await mokToken.balanceOf(owner);
    assert.equal(finalOwnerBalance.sub(initialOwnerBalance).toNumber(), expectedUsageFees, "Usage fees withdrawn is incorrect");
  });
  
  it("should not allow the lottery to be drawn before 5 minutes have passed", async () => {

    // Transfer MOKToken from owner to accounts[1] and accounts[2]
    const numTickets = 5;
    const ticketPrice = await lottery.getTicketPrice();

    const amount = ticketPrice * numTickets;
    await mokToken.transfer(accounts[1], amount, { from: owner });
    await mokToken.transfer(accounts[2], amount, { from: owner });

    // Approve and buy tickets for accounts[1] and accounts[2]
    await mokToken.approve(lottery2.address, amount, { from: accounts[1] });
    await mokToken.approve(lottery2.address, amount, { from: accounts[2] });
    await lottery2.buyTickets(numTickets, { from: accounts[1] });
    await lottery2.buyTickets(numTickets, { from: accounts[2] });

    await lottery2.setManagers(accounts[2], accounts[3], { from: owner });

    // Draw the lottery
    await increaseTime(5 * 60);
    await lottery2.drawWinner({ from: owner });
    
  
    // Attempt to draw the lottery again before 5 minutes have passed
    try {
      await lottery2.drawWinner({ from: owner });
      assert.fail("The lottery should not be drawable before 5 minutes have passed");
    } catch (error) {
      assert.include(error.message, "Cannot draw yet");
    }
  
    // Increase time by 4 minutes and 59 seconds
    await increaseTime(4 * 60 + 59);
  
    // Attempt to draw the lottery again just 1 second before 5 minutes have passed
    try {
      await lottery2.drawWinner({ from: owner });
      assert.fail("The lottery should not be drawable before 5 minutes have passed");
    } catch (error) {
      assert.include(error.message, "Cannot draw yet");
    }
  
    // Increase time by another 2 seconds (total 5 minutes and 1 second)
    await increaseTime(2);
  
    // Now the lottery should be drawable again
    await lottery2.drawWinner({ from: owner });
  });
  
  
  
  
});
