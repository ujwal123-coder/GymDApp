// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title GymMembership
 * @dev Smart contract for managing gym memberships on Ethereum blockchain
 * @author Ujwal Pathak (02650380)
 * @notice This contract handles member registration, payments, and loyalty tokens
 */

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract GymMembership {
    
    // ============ ENUMS ============
    enum MembershipPlan { BASIC, STANDARD, DELUXE, PREMIUM }
    enum MemberStatus { ACTIVE, INACTIVE, SUSPENDED }
    
    // ============ STRUCTS ============
    struct Member {
        uint256 id;
        address walletAddress;
        string name;
        string email;
        MembershipPlan plan;
        MemberStatus status;
        uint256 joinDate;
        uint256 expiryDate;
        uint256 loyaltyPoints;
        uint256 attendance;
        uint256 amountPaid;
        bool isActive;
        string personalTrainer;
    }
    
    struct MembershipPrice {
        uint256 basic;      // 6500 USD equivalent in wei
        uint256 standard;   // 12000 USD equivalent in wei
        uint256 deluxe;     // 15000 USD equivalent in wei
        uint256 premium;    // 50000 USD equivalent in wei
    }
    
    // ============ STATE VARIABLES ============
    address public owner;
    uint256 public memberCount = 0;
    uint256 public totalLoyaltyTokens = 0;
    
    MembershipPrice public prices;
    
    // Mappings
    mapping(uint256 => Member) public members;
    mapping(address => uint256) public memberIdByAddress;
    mapping(address => uint256) public loyaltyTokenBalance;
    mapping(uint256 => bool) public memberExists;
    
    // ============ EVENTS ============
    event MemberRegistered(uint256 indexed memberId, address indexed walletAddress, string name, MembershipPlan plan);
    event MembershipUpgraded(uint256 indexed memberId, MembershipPlan oldPlan, MembershipPlan newPlan);
    event PaymentReceived(uint256 indexed memberId, uint256 amount, MembershipPlan plan);
    event AttendanceMarked(uint256 indexed memberId, uint256 loyaltyPointsEarned);
    event LoyaltyTokensAwarded(uint256 indexed memberId, uint256 tokenAmount);
    event MembershipActivated(uint256 indexed memberId);
    event MembershipDeactivated(uint256 indexed memberId);
    event DiscountApplied(uint256 indexed memberId, uint256 discountAmount);
    
    // ============ MODIFIERS ============
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier memberExists_() {
        require(memberIdByAddress[msg.sender] != 0 || members[memberIdByAddress[msg.sender]].isActive, "Member does not exist");
        _;
    }
    
    modifier validMemberId(uint256 _memberId) {
        require(memberExists[_memberId], "Member ID does not exist");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    constructor() {
        owner = msg.sender;
        
        // Initialize membership prices (in wei, assuming 1 USD = 1 token for simplicity)
        prices.basic = 6500 * 10**18;
        prices.standard = 12000 * 10**18;
        prices.deluxe = 15000 * 10**18;
        prices.premium = 50000 * 10**18;
    }
    
    // ============ MEMBER REGISTRATION ============
    /**
     * @dev Register a new gym member
     * @param _name Member's name
     * @param _email Member's email
     * @param _plan Membership plan (0=BASIC, 1=STANDARD, 2=DELUXE, 3=PREMIUM)
     * @param _personalTrainer Personal trainer name (for premium members)
     */
    function registerMember(
        string memory _name,
        string memory _email,
        uint256 _plan,
        string memory _personalTrainer
    ) public returns (uint256) {
        require(memberIdByAddress[msg.sender] == 0, "Member already registered");
        require(_plan <= 3, "Invalid membership plan");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_email).length > 0, "Email cannot be empty");
        
        memberCount++;
        uint256 newMemberId = memberCount;
        
        Member storage newMember = members[newMemberId];
        newMember.id = newMemberId;
        newMember.walletAddress = msg.sender;
        newMember.name = _name;
        newMember.email = _email;
        newMember.plan = MembershipPlan(_plan);
        newMember.status = MemberStatus.ACTIVE;
        newMember.joinDate = block.timestamp;
        newMember.expiryDate = block.timestamp + 365 days;
        newMember.loyaltyPoints = 0;
        newMember.attendance = 0;
        newMember.amountPaid = 0;
        newMember.isActive = true;
        newMember.personalTrainer = _personalTrainer;
        
        memberIdByAddress[msg.sender] = newMemberId;
        memberExists[newMemberId] = true;
        
        emit MemberRegistered(newMemberId, msg.sender, _name, MembershipPlan(_plan));
        
        return newMemberId;
    }
    
    // ============ PAYMENT FUNCTIONS ============
    /**
     * @dev Process membership payment
     * @param _memberId Member ID
     * @param _amount Amount to pay in wei
     */
    function payMembership(uint256 _memberId, uint256 _amount) public payable validMemberId(_memberId) {
        require(msg.value == _amount, "Incorrect payment amount");
        require(_amount > 0, "Payment amount must be greater than 0");
        
        Member storage member = members[_memberId];
        require(member.walletAddress == msg.sender, "Only member can pay for their membership");
        
        uint256 planPrice = getPlanPrice(member.plan);
        require(member.amountPaid + _amount <= planPrice, "Payment exceeds plan price");
        
        member.amountPaid += _amount;
        
        // Award loyalty tokens based on payment
        uint256 tokensToAward = (_amount / 10**18) / 100; // 1 token per 100 USD
        loyaltyTokenBalance[msg.sender] += tokensToAward;
        totalLoyaltyTokens += tokensToAward;
        
        emit PaymentReceived(_memberId, _amount, member.plan);
        
        // Check if full payment is made and apply discount
        if (member.amountPaid >= planPrice) {
            uint256 discount = (planPrice * 10) / 100; // 10% discount
            emit DiscountApplied(_memberId, discount);
        }
    }
    
    // ============ ATTENDANCE & LOYALTY ============
    /**
     * @dev Mark member attendance and award loyalty points
     * @param _memberId Member ID
     */
    function markAttendance(uint256 _memberId) public onlyOwner validMemberId(_memberId) {
        Member storage member = members[_memberId];
        require(member.isActive, "Member is not active");
        require(member.status == MemberStatus.ACTIVE, "Member status is not active");
        
        member.attendance++;
        
        // Award loyalty points based on membership plan
        uint256 pointsToAward;
        if (member.plan == MembershipPlan.PREMIUM) {
            pointsToAward = 10;
        } else {
            pointsToAward = 5;
        }
        
        member.loyaltyPoints += pointsToAward;
        
        // Award loyalty tokens
        loyaltyTokenBalance[member.walletAddress] += pointsToAward;
        totalLoyaltyTokens += pointsToAward;
        
        emit AttendanceMarked(_memberId, pointsToAward);
        emit LoyaltyTokensAwarded(_memberId, pointsToAward);
    }
    
    // ============ MEMBERSHIP MANAGEMENT ============
    /**
     * @dev Upgrade member's membership plan
     * @param _memberId Member ID
     * @param _newPlan New membership plan
     */
    function upgradeMembership(uint256 _memberId, uint256 _newPlan) public validMemberId(_memberId) {
        Member storage member = members[_memberId];
        require(member.walletAddress == msg.sender, "Only member can upgrade their plan");
        require(_newPlan <= 3, "Invalid membership plan");
        require(_newPlan > uint256(member.plan), "New plan must be higher than current plan");
        
        MembershipPlan oldPlan = member.plan;
        member.plan = MembershipPlan(_newPlan);
        member.amountPaid = 0; // Reset payment for new plan
        
        emit MembershipUpgraded(_memberId, oldPlan, MembershipPlan(_newPlan));
    }
    
    /**
     * @dev Activate member membership
     * @param _memberId Member ID
     */
    function activateMembership(uint256 _memberId) public onlyOwner validMemberId(_memberId) {
        Member storage member = members[_memberId];
        member.isActive = true;
        member.status = MemberStatus.ACTIVE;
        member.expiryDate = block.timestamp + 365 days;
        
        emit MembershipActivated(_memberId);
    }
    
    /**
     * @dev Deactivate member membership
     * @param _memberId Member ID
     */
    function deactivateMembership(uint256 _memberId) public onlyOwner validMemberId(_memberId) {
        Member storage member = members[_memberId];
        member.isActive = false;
        member.status = MemberStatus.INACTIVE;
        
        emit MembershipDeactivated(_memberId);
    }
    
    // ============ GETTER FUNCTIONS ============
    /**
     * @dev Get member details
     * @param _memberId Member ID
     */
    function getMember(uint256 _memberId) public view validMemberId(_memberId) returns (Member memory) {
        return members[_memberId];
    }
    
    /**
     * @dev Get member ID by wallet address
     * @param _walletAddress Wallet address
     */
    function getMemberIdByAddress(address _walletAddress) public view returns (uint256) {
        return memberIdByAddress[_walletAddress];
    }
    
    /**
     * @dev Get loyalty token balance for a member
     * @param _walletAddress Wallet address
     */
    function getLoyaltyTokenBalance(address _walletAddress) public view returns (uint256) {
        return loyaltyTokenBalance[_walletAddress];
    }
    
    /**
     * @dev Get membership plan price
     * @param _plan Membership plan
     */
    function getPlanPrice(MembershipPlan _plan) public view returns (uint256) {
        if (_plan == MembershipPlan.BASIC) {
            return prices.basic;
        } else if (_plan == MembershipPlan.STANDARD) {
            return prices.standard;
        } else if (_plan == MembershipPlan.DELUXE) {
            return prices.deluxe;
        } else {
            return prices.premium;
        }
    }
    
    /**
     * @dev Get total members count
     */
    function getTotalMembers() public view returns (uint256) {
        return memberCount;
    }
    
    /**
     * @dev Get total loyalty tokens in circulation
     */
    function getTotalLoyaltyTokens() public view returns (uint256) {
        return totalLoyaltyTokens;
    }
    
    // ============ ADMIN FUNCTIONS ============
    /**
     * @dev Update membership prices (only owner)
     * @param _basic Basic plan price
     * @param _standard Standard plan price
     * @param _deluxe Deluxe plan price
     * @param _premium Premium plan price
     */
    function updatePrices(uint256 _basic, uint256 _standard, uint256 _deluxe, uint256 _premium) public onlyOwner {
        prices.basic = _basic;
        prices.standard = _standard;
        prices.deluxe = _deluxe;
        prices.premium = _premium;
    }
    
    /**
     * @dev Withdraw contract balance (only owner)
     */
    function withdrawBalance() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        payable(owner).transfer(balance);
    }
    
    /**
     * @dev Get contract balance
     */
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    // ============ FALLBACK FUNCTIONS ============
    receive() external payable {}
    
    fallback() external payable {}
}
