// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Auth {
    using ECDSA for bytes32;

    // Enum for roles
    enum Role { SuperAdmin, Admin, User }

    struct User {
        string username;
        address userAddress;

        Role role;  
        uint256 lastLogin;

        bool isRegistered;
    }

    mapping(address => User) public users;
    mapping(address => uint256) private userIndex;  // O(1) user tracking
    address[] public userAddresses;
    
    address public superAdmin;

    // Event for transparency
    event UserRegistered(address indexed user, string username);

    event UsernameUpdated(address indexed user, string newUsername);
    event LoginAttempt(address indexed user, bool success, string message);

    event RoleChanged(address indexed user, Role newRole);
    event UserDeleted(address indexed user);

    event UserDetailsRetrieved(address indexed user, string username, Role role, uint256 lastLogin);

    constructor() {
        superAdmin = msg.sender;
        
        // Assign the superAdmin role during deployment
        users[msg.sender] = User("superadmin", msg.sender, Role.SuperAdmin, block.timestamp, true);
        
        // Add the superAdmin to user list
        userAddresses.push(msg.sender);
        userIndex[msg.sender] = 0;
        
        emit UserRegistered(msg.sender, "superadmin");
    }

    // Modifiers
    modifier onlySuperAdmin() {
        require(users[msg.sender].role == Role.SuperAdmin, "Only SuperAdmin can perform this action");
        _;
    }

    // Register the new user
    function registerUser(string memory _username) public {
        require(!users[msg.sender].isRegistered, "User already registered");
        require(bytes(_username).length >= 3, "Username must be at least 3 characters");

        users[msg.sender] = User(_username, msg.sender, Role.User, 0, true);
        
        // Store index for O(1) deletion
        userIndex[msg.sender] = userAddresses.length;  
        userAddresses.push(msg.sender);

        emit UserRegistered(msg.sender, _username);
    }

    // Update the username


    function updateUsername(string memory _newUsername) public {
        require(users[msg.sender].isRegistered, "User not registered");
        require(bytes(_newUsername).length >= 3, "Username must be at least 3 characters");

        users[msg.sender].username = _newUsername;
        emit UsernameUpdated(msg.sender, _newUsername);
    }

    // User authentication with ECDSA signature verification
    function attemptLogin(string memory _message, bytes memory _signature) public returns (bool) {
        require(users[msg.sender].isRegistered, "User not registered");

        bytes32 messageHash = keccak256(abi.encodePacked(_message));

        // Manually add Ethereum signed message prefix to the message hash

        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));

        address signer = ECDSA.recover(ethSignedMessageHash, _signature);

        if (signer != msg.sender) {
            emit LoginAttempt(msg.sender, false, "Invalid signature");
            return false;
        }

        users[msg.sender].lastLogin = block.timestamp;
        emit LoginAttempt(msg.sender, true, "Login successful");
        return true;
    }

    // Get the user detail
    function getUserDetails(address _userAddress) public view returns (string memory, address, Role, uint256) {
        User memory user = users[_userAddress];
        require(user.isRegistered, "User not found");

        return (user.username, user.userAddress, user.role, user.lastLogin);
    }

    // Change user role (only SuperAdmin)
    function changeUserRole(address _userAddress, Role _newRole) public onlySuperAdmin {
        require(users[_userAddress].isRegistered, "User not registered");

        users[_userAddress].role = _newRole;
        emit RoleChanged(_userAddress, _newRole);
    }

    // Delete user with O(1) complexity
    function deleteUser(address _userAddress) public onlySuperAdmin {
        require(users[_userAddress].isRegistered, "User not registered");
        
        require(_userAddress != superAdmin, "Cannot delete SuperAdmin");

        uint256 index = userIndex[_userAddress];
        uint256 lastIndex = userAddresses.length - 1;

        if (index != lastIndex) {
            address lastUser = userAddresses[lastIndex];
            userAddresses[index] = lastUser;
            userIndex[lastUser] = index;  
        }

        userAddresses.pop();
        delete users[_userAddress];
        delete userIndex[_userAddress];

        emit UserDeleted(_userAddress);
    }

    // Get total user count
    function getUserCount() public view returns (uint256) {
        return userAddresses.length;
    }

    // Fallback function to prevent accidental ETH transfers
    fallback() external payable {
        revert("Direct payments not allowed.");
    }

    // Receive function (if you want to accept ETH)
    receive() external payable {
        emit LoginAttempt(msg.sender, false, "ETH received unexpectedly.");
    }
}
