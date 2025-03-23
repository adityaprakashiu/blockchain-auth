// SPDX-License-Identifier: MIT
// SPDX ka matlab Software Package Data Exchange
pragma solidity ^0.8.0;

contract Auth {
    enum Role {User, Admin} // Role-based access control

    struct User {
        string username;       // Added username field
        address userAddress;
        bytes32 passwordHash;
        bytes32 salt;
        Role role;
    }

    mapping(address => User) private users;
    address public contractOwner;

    event UserRegistered(address indexed user, string username, Role role);
    event UserLoggedIn(address indexed user, string username);
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
        
        // Register contract owner as Admin with default username
        users[msg.sender] = User("Owner", msg.sender, keccak256(abi.encodePacked("admin123", salt)), salt, Role.Admin);
        
        emit UserRegistered(msg.sender, "Owner", Role.Admin);
    }

    // Register User with Username
    function registerUser(string memory username, string memory password) public {
        require(users[msg.sender].userAddress == address(0), "User already registered");
        require(bytes(username).length >= 3, "Username must be at least 3 characters");
        require(bytes(password).length >= 6, "Password must be at least 6 characters");

        bytes32 salt = _generateSalt(msg.sender);
        users[msg.sender] = User(username, msg.sender, keccak256(abi.encodePacked(password, salt)), salt, Role.User);
        
        emit UserRegistered(msg.sender, username, Role.User);
    }

    // Login with Username Emission
    function attemptLogin(string memory password) public returns (string memory) {
        require(users[msg.sender].userAddress != address(0), "User not registered");

        if (users[msg.sender].passwordHash == keccak256(abi.encodePacked(password, users[msg.sender].salt))) {
            emit UserLoggedIn(msg.sender, users[msg.sender].username);
            return users[msg.sender].username;  // Return username on successful login
        }
        revert("Incorrect password");
    }

    // Update Password
    function updatePassword(string memory oldPassword, string memory newPassword) public onlyRegisteredUser {
        require(keccak256(abi.encodePacked(oldPassword, users[msg.sender].salt)) == users[msg.sender].passwordHash, "Incorrect old password");
        require(bytes(newPassword).length >= 6, "Password must be at least 6 characters");

        users[msg.sender].salt = _generateSalt(msg.sender);
        users[msg.sender].passwordHash = keccak256(abi.encodePacked(newPassword, users[msg.sender].salt));
        
        emit PasswordUpdated(msg.sender);
    }

    // Assign Admin Role
    function assignAdmin(address userAddress) public {
        require(msg.sender == contractOwner, "Only contract owner can assign Admin role");
        require(users[userAddress].userAddress != address(0), "User does not exist");

        users[userAddress].role = Role.Admin;
        
        emit RoleChanged(userAddress, Role.Admin);
    }

    // Revoke Admin Role
    function revokeAdminRole(address userAddress) public {
        require(msg.sender == contractOwner, "Only contract owner can revoke Admin role");
        require(users[userAddress].role == Role.Admin, "User is not an Admin");
        require(userAddress != contractOwner, "Cannot revoke contract owner's role");

        users[userAddress].role = Role.User;
        
        emit RoleRevoked(userAddress);
    }

    // Delete User
    function deleteUser(address userAddress) public onlyAdmin {
        require(users[userAddress].userAddress != address(0), "User does not exist");

        if (users[userAddress].role == Role.Admin) {
            require(msg.sender == contractOwner, "Only contract owner can delete Admin accounts");
        }

        delete users[userAddress]; 
        emit UserRemoved(userAddress);
    }

    // Get User Role
    function getUserRole() public view onlyRegisteredUser returns (string memory) {
        return users[msg.sender].role == Role.Admin ? "Admin" : "User";
    }

    // Updated Get User Details to Include Username
    function getUserDetails(address userAddress) public view returns (string memory, address, string memory, string memory) {
        require(users[userAddress].userAddress != address(0), "User not found");

        string memory role = users[userAddress].role == Role.Admin ? "Admin" : "User";

        return (
            users[userAddress].username,
            users[userAddress].userAddress,
            role,
            "User details retrieved successfully"
        );
    }

    // Generate Salt
    function _generateSalt(address userAddress) private view returns (bytes32) {
        return keccak256(abi.encodePacked(block.timestamp, userAddress, block.prevrandao));
    }
}
