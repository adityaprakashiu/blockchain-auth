// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Auth {
    struct User {
        string username;
        address userAddress;
        string role;
        uint256 lastLogin;
        bool isRegistered;
    }

    mapping(address => User) public users;
    address[] public userAddresses;
    address public superAdmin;

    event UserRegistered(address indexed user, string username);
    event UsernameUpdated(address indexed user, string newUsername);
    event LoginAttempt(address indexed user, bool success, string message);
    event RoleChanged(address indexed user, string newRole);
    event UserDeleted(address indexed user); // New event for user deletion

    constructor() {
        superAdmin = msg.sender;
        users[msg.sender] = User("superadmin", msg.sender, "SuperAdmin", block.timestamp, true);
        userAddresses.push(msg.sender);
        emit UserRegistered(msg.sender, "superadmin");
    }

    modifier onlySuperAdmin() {
        require(
            keccak256(bytes(users[msg.sender].role)) == keccak256(bytes("SuperAdmin")),
            "Only SuperAdmin can perform this action"
        );
        _;
    }

    function registerUser(string memory _username) public {
        require(!users[msg.sender].isRegistered, "User already registered");
        require(bytes(_username).length >= 3, "Username must be at least 3 characters");

        users[msg.sender] = User(_username, msg.sender, "User", 0, true);
        userAddresses.push(msg.sender);
        emit UserRegistered(msg.sender, _username);
    }

    function updateUsername(string memory _newUsername) public {
        require(users[msg.sender].isRegistered, "User not registered");
        require(bytes(_newUsername).length >= 3, "Username must be at least 3 characters");

        users[msg.sender].username = _newUsername;
        emit UsernameUpdated(msg.sender, _newUsername);
    }

    function attemptLogin(string memory _message, bytes memory _signature) public returns (bool) {
        require(users[msg.sender].isRegistered, "User not registered");

        bytes32 messageHash = keccak256(abi.encodePacked(_message));
        bytes32 ethSignedMessageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
        address signer = recoverSigner(ethSignedMessageHash, _signature);

        if (signer != msg.sender) {
            emit LoginAttempt(msg.sender, false, "Invalid signature");
            return false;
        }

        users[msg.sender].lastLogin = block.timestamp;
        emit LoginAttempt(msg.sender, true, "Login successful");
        return true;
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature) internal pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory _sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(_sig.length == 65, "Invalid signature length");
        assembly {
            r := mload(add(_sig, 32))
            s := mload(add(_sig, 64))
            v := byte(0, mload(add(_sig, 96)))
        }
        if (v < 27) {
            v += 27;
        }
    }

    function getUserDetails(address _userAddress) public view returns (string memory, address, string memory, uint256, string memory) {
        User memory user = users[_userAddress];
        if (!user.isRegistered) {
            return ("", address(0), "", 0, "User not found");
        }
        return (user.username, user.userAddress, user.role, user.lastLogin, "User details retrieved successfully");
    }

    function changeUserRole(address _userAddress, string memory _newRole) public onlySuperAdmin {
        require(users[_userAddress].isRegistered, "User not registered");
        require(bytes(_newRole).length > 0, "Role cannot be empty");
        users[_userAddress].role = _newRole;
        emit RoleChanged(_userAddress, _newRole);
    }

    function deleteUser(address _userAddress) public onlySuperAdmin {
        require(users[_userAddress].isRegistered, "User not registered");
        require(_userAddress != superAdmin, "Cannot delete SuperAdmin");

        // Remove the user from the userAddresses array
        for (uint256 i = 0; i < userAddresses.length; i++) {
            if (userAddresses[i] == _userAddress) {
                userAddresses[i] = userAddresses[userAddresses.length - 1];
                userAddresses.pop();
                break;
            }
        }

        // Delete the user from the mapping
        delete users[_userAddress];
        emit UserDeleted(_userAddress);
    }

    function getUserCount() public view returns (uint256) {
        return userAddresses.length;
    }
}