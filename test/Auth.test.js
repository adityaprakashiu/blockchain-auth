const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Auth Contract", () => {
    let Auth, auth, owner, user1, user2;

    beforeEach(async () => {
        [owner, user1, user2] = await ethers.getSigners();
        const AuthFactory = await ethers.getContractFactory("Auth");
        auth = await AuthFactory.deploy();
        await auth.waitForDeployment();
    });

    // ✅ Deployment tests
    describe("Deployment", () => {
        it("Should set the contract owner as Admin", async () => {
            expect(await auth.getUserRole()).to.equal("Admin");
        });

        it("Should allow new user registration", async () => {
            await auth.connect(user1).registerUser("User123");
            const role = await auth.connect(user1).getUserRole();
            expect(role).to.equal("User");
        });

        it("Should revert if user tries to register twice", async () => {
            await auth.connect(user1).registerUser("User123");
            await expect(auth.connect(user1).registerUser("User123"))
                .to.be.revertedWith("User already registered");
        });
    });

    // ✅ Login tests
    describe("Login Functionality", () => {
        it("Should allow a user to log in with correct password", async () => {
            await auth.connect(user1).registerUser("User123");

            // Check for UserLoggedIn event
            await expect(auth.connect(user1).attemptLogin("User123"))
                .to.emit(auth, "UserLoggedIn")
                .withArgs(user1.address);
        });

        it("Should revert login with incorrect password", async () => {
            await auth.connect(user1).registerUser("User123");

            await expect(auth.connect(user1).attemptLogin("WrongPassword"))
                .to.be.revertedWith("Incorrect password");
        });
    });

    // ✅ Admin Role Management tests
    describe("Admin Role Management", () => {
        it("Should allow contract owner to assign Admin role", async () => {
            // Register user first
            await auth.connect(user1).registerUser("User123");

            await auth.connect(owner).assignAdmin(user1.address);

            const role = await auth.connect(user1).getUserRole();
            expect(role).to.equal("Admin");
        });

        it("Should revert when non-owner tries to assign Admin role", async () => {
            await auth.connect(user1).registerUser("User123");

            await expect(auth.connect(user1).assignAdmin(user2.address))
                .to.be.revertedWith("Only contract owner can assign Admin role");
        });

        it("Should allow contract owner to revoke Admin role", async () => {
            // Register and assign Admin role first
            await auth.connect(user1).registerUser("User123");
            await auth.connect(owner).assignAdmin(user1.address);

            await auth.connect(owner).revokeAdminRole(user1.address);

            const role = await auth.connect(user1).getUserRole();
            expect(role).to.equal("User");
        });

        it("Should prevent contract owner from revoking their own Admin role", async () => {
            await expect(auth.connect(owner).revokeAdminRole(owner.address))
                .to.be.revertedWith("Cannot revoke contract owner's role");
        });
    });

    // ✅ Password Management tests
    describe("Password Management", () => {
        it("Should allow a user to update their password", async () => {
            await auth.connect(user1).registerUser("User123");

            // Emit event for password update
            await expect(auth.connect(user1).updatePassword("User123", "NewPassword456"))
                .to.emit(auth, "PasswordUpdated")
                .withArgs(user1.address);

            // Ensure the user can log in with the new password
            await expect(auth.connect(user1).attemptLogin("NewPassword456"))
                .to.emit(auth, "UserLoggedIn")
                .withArgs(user1.address);
        });

        it("Should revert password update with incorrect old password", async () => {
            await auth.connect(user1).registerUser("User123");

            await expect(auth.connect(user1).updatePassword("WrongOldPassword", "NewPassword456"))
                .to.be.revertedWith("Incorrect old password");
        });
    });

    // ✅ User Deletion tests
    describe("User Deletion", () => {
        it("Should allow Admin to delete a user", async () => {
            await auth.connect(user1).registerUser("User123");

            // Admin (owner) deletes user1
            await auth.connect(owner).deleteUser(user1.address);

            await expect(auth.connect(user1).getUserRole())
                .to.be.revertedWith("User not registered");
        });

        it("Should prevent unauthorized user deletions", async () => {
            await auth.connect(user1).registerUser("User123");

            await expect(auth.connect(user1).deleteUser(user2.address))
                .to.be.revertedWith("Access denied: Admins only");
        });
    });
});