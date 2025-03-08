// SPDX-License-Identifier: MIT
// SPDX ka matlab Software Package Data Exchange
pragma solidity ^0.8.0;

contract Auth {
    enum Role {User, Admin} //Role based access control ke liye

    struct User {
        address userAddress;
        bytes32 passwordHash;
        bytes32 salt;
        Role role;
    }

    mapping(address => User) private users;
    address public contractOwner;

    event UserRegistered(address indexed user, Role role);
    event UserLoggedIn(address indexed user);
    event RoleChanged(address indexed user, Role newRole);
    event PasswordUpdated(address indexed user);
    event RoleRevoked(address indexed user);
    event UserRemoved(address indexed user);

    modifier onlyAdmin() {
        require(users[msg.sender].role == Role.Admin, "Access denied: Admins only");
        _;
    }

    modifier onlyRegisteredUser() {
        require(users[msg.sender].userAddress != address(0), "User not registered");
        _;
    }

    constructor() {
        contractOwner = msg.sender;
        bytes32 salt = _generateSalt(msg.sender);
        users[msg.sender] = User(msg.sender, keccak256(abi.encodePacked("admin123", salt)), salt, Role.Admin);
        emit UserRegistered(msg.sender, Role.Admin);
    }

    function registerUser(string memory password) public {
        require(users[msg.sender].userAddress == address(0), "User already registered");
        require(bytes(password).length >= 6, "Password must be at least 6 characters");

        bytes32 salt = _generateSalt(msg.sender);
        users[msg.sender] = User(msg.sender, keccak256(abi.encodePacked(password, salt)), salt, Role.User);
        emit UserRegistered(msg.sender, Role.User);
    }

    function attemptLogin(string memory password) public returns (bool) {
        require(users[msg.sender].userAddress != address(0), "User not registered");

        if (users[msg.sender].passwordHash == keccak256(abi.encodePacked(password, users[msg.sender].salt))) {
            emit UserLoggedIn(msg.sender);
            return true;
        }
        revert("Incorrect password");
    }

    function updatePassword(string memory oldPassword, string memory newPassword) public onlyRegisteredUser {
        require(keccak256(abi.encodePacked(oldPassword, users[msg.sender].salt)) == users[msg.sender].passwordHash, "Incorrect old password");
        require(bytes(newPassword).length >= 6, "Password must be at least 6 characters");

        users[msg.sender].salt = _generateSalt(msg.sender);
        users[msg.sender].passwordHash = keccak256(abi.encodePacked(newPassword, users[msg.sender].salt));
        emit PasswordUpdated(msg.sender);
    }

    function assignAdmin(address userAddress) public {
        require(msg.sender == contractOwner, "Only contract owner can assign Admin role");
        require(users[userAddress].userAddress != address(0), "User does not exist");

        users[userAddress].role = Role.Admin;
        emit RoleChanged(userAddress, Role.Admin);
    }

    function revokeAdminRole(address userAddress) public {
        require(msg.sender == contractOwner, "Only contract owner can revoke Admin role");
        require(users[userAddress].role == Role.Admin, "User is not an Admin");
        require(userAddress != contractOwner, "Cannot revoke contract owner's role");

        users[userAddress].role = Role.User;
        emit RoleRevoked(userAddress);
    }

    function deleteUser(address userAddress) public onlyAdmin {
        require(users[userAddress].userAddress != address(0), "User does not exist");

        // Only contract owner can delete Admins
        if (users[userAddress].role == Role.Admin) {
            require(msg.sender == contractOwner, "Only contract owner can delete Admin accounts");
        }

        delete users[userAddress]; 
        emit UserRemoved(userAddress); //using UserRemoved for better clarity
    }

    function getUserRole() public view onlyRegisteredUser returns (string memory) {
        return users[msg.sender].role == Role.Admin ? "Admin" : "User";
    }

    function _generateSalt(address userAddress) private view returns (bytes32) {
        return keccak256(abi.encodePacked(block.timestamp, userAddress, block.prevrandao));
    }
}