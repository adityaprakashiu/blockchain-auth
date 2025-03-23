// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Auth {
    enum Role { User, Admin, SuperAdmin } // Added SuperAdmin role for more granularity

    struct User {
        string username;       // Username for user identification
        address userAddress;   // Wallet address of the user
        Role role;             // Role for RBAC
        uint256 lastLogin;     // Timestamp of last successful login (for audit logging)
    }

    mapping(address => User) private users;
    address public contractOwner;

    // Events for audit logging and frontend interaction
    event UserRegistered(address indexed user, string username, Role role);
    event LoginAttempt(address indexed user, bool success, string message);
    event RoleChanged(address indexed user, Role newRole);
    event RoleRevoked(address indexed user, Role oldRole);
    event UserRemoved(address indexed user);
    event SignatureVerified(address indexed user, bool success);

    modifier onlyAdmin() {
        require(users[msg.sender].role == Role.Admin || users[msg.sender].role == Role.SuperAdmin, "Access denied: Admins only");
        _;
    }

    modifier onlySuperAdmin() {
        require(users[msg.sender].role == Role.SuperAdmin, "Access denied: SuperAdmins only");
        _;
    }

    modifier onlyRegisteredUser() {
        require(users[msg.sender].userAddress != address(0), "User not registered");
        _;
    }

    constructor() {
        contractOwner = msg.sender;
        // Register contract owner as SuperAdmin with default username
        users[msg.sender] = User("Owner", msg.sender, Role.SuperAdmin, block.timestamp);
        emit UserRegistered(msg.sender, "Owner", Role.SuperAdmin);
    }

    // Register User with Username
    function registerUser(string memory username) public {
        require(users[msg.sender].userAddress == address(0), "User already registered");
        require(bytes(username).length >= 3, "Username must be at least 3 characters");

        users[msg.sender] = User(username, msg.sender, Role.User, 0);
        emit UserRegistered(msg.sender, username, Role.User);
    }

    // Verify Signature for Login (Wallet-Based Authentication)
    function attemptLogin(string memory message, bytes memory signature) public returns (bool) {
        require(users[msg.sender].userAddress != address(0), "User not registered");

        // Verify the signature
        bool isValid = verifySignature(msg.sender, message, signature);
        if (!isValid) {
            emit LoginAttempt(msg.sender, false, "Invalid signature");
            return false;
        }

        // Update last login timestamp
        users[msg.sender].lastLogin = block.timestamp;
        emit LoginAttempt(msg.sender, true, "Login successful");
        emit SignatureVerified(msg.sender, true);
        return true;
    }

    // Assign Admin Role
    function assignAdmin(address userAddress) public onlySuperAdmin {
        require(users[userAddress].userAddress != address(0), "User does not exist");
        require(users[userAddress].role != Role.SuperAdmin, "Cannot change SuperAdmin role");

        users[userAddress].role = Role.Admin;
        emit RoleChanged(userAddress, Role.Admin);
    }

    // Assign SuperAdmin Role (Only by contract owner)
    function assignSuperAdmin(address userAddress) public {
        require(msg.sender == contractOwner, "Only contract owner can assign SuperAdmin role");
        require(users[userAddress].userAddress != address(0), "User does not exist");

        users[userAddress].role = Role.SuperAdmin;
        emit RoleChanged(userAddress, Role.SuperAdmin);
    }

    // Revoke Admin or SuperAdmin Role
    function revokeAdminRole(address userAddress) public onlySuperAdmin {
        require(users[userAddress].userAddress != address(0), "User does not exist");
        require(users[userAddress].role == Role.Admin || users[userAddress].role == Role.SuperAdmin, "User is not an Admin or SuperAdmin");
        require(userAddress != contractOwner, "Cannot revoke contract owner's role");

        Role oldRole = users[userAddress].role;
        users[userAddress].role = Role.User;
        emit RoleRevoked(userAddress, oldRole);
    }

    // Delete User
    function deleteUser(address userAddress) public onlyAdmin {
        require(users[userAddress].userAddress != address(0), "User does not exist");
        require(users[userAddress].role != Role.SuperAdmin, "Cannot delete SuperAdmin accounts");

        if (users[userAddress].role == Role.Admin) {
            require(users[msg.sender].role == Role.SuperAdmin, "Only SuperAdmins can delete Admin accounts");
        }

        delete users[userAddress];
        emit UserRemoved(userAddress);
    }

    // Get User Role
    function getUserRole() public view onlyRegisteredUser returns (string memory) {
        if (users[msg.sender].role == Role.SuperAdmin) return "SuperAdmin";
        if (users[msg.sender].role == Role.Admin) return "Admin";
        return "User";
    }

    // Get User Details (Including Last Login for Audit)
    function getUserDetails(address userAddress) public view returns (string memory username, address userAddr, string memory role, uint256 lastLogin, string memory message) {
        require(users[userAddress].userAddress != address(0), "User not found");

        string memory userRole = users[userAddress].role == Role.SuperAdmin ? "SuperAdmin" : users[userAddress].role == Role.Admin ? "Admin" : "User";

        return (
            users[userAddress].username,
            users[userAddress].userAddress,
            userRole,
            users[userAddress].lastLogin,
            "User details retrieved successfully"
        );
    }

    // Verify Signature (For Wallet-Based Authentication)
    function verifySignature(address user, string memory message, bytes memory signature) public pure returns (bool) {
        bytes32 messageHash = keccak256(abi.encodePacked(message));
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
        address signer = recoverSigner(ethSignedMessageHash, signature);
        return signer == user;
    }

    // Recover Signer from Signature
    function recoverSigner(bytes32 messageHash, bytes memory signature) internal pure returns (address) {
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(signature);
        return ecrecover(messageHash, v, r, s);
    }

    // Split Signature into v, r, s Components
    function splitSignature(bytes memory sig) internal pure returns (uint8 v, bytes32 r, bytes32 s) {
        require(sig.length == 65, "Invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
        if (v < 27) v += 27;
    }
}