const request = require("supertest");
const app = require("../../backend/server"); // Adjust this path if necessary
import { expect } from "chai";
const VerificationRequest = require("../../models/VerificationRequest"); // Adjust path if necessary

describe("POST /verification", () => {
    it("should create a verification request", async () => {
        const verificationData = {
            userId: "user1_address",
            verificationType: "Identity",
            data: "Passport verification",
        };

        const res = await request(app)
            .post("/api/verification")
            .send(verificationData)
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body).to.have.property("message").that.equals("Verification request created successfully");
        const verificationRequest = await VerificationRequest.findOne({ userId: verificationData.userId });
        expect(verificationRequest).to.not.be.null;
        expect(verificationRequest.verificationType).to.equal(verificationData.verificationType);
    });

    it("should return an error if user does not exist", async () => {
        const invalidVerificationData = {
            userId: "non_existing_user",
            verificationType: "Identity",
            data: "Passport verification",
        };

        const res = await request(app)
            .post("/api/verification")
            .send(invalidVerificationData)
            .expect("Content-Type", /json/)
            .expect(400);

        expect(res.body).to.have.property("error").that.equals("User not found");
    });

    it("should return an error if data is missing", async () => {
        const invalidVerificationData = {
            userId: "user1_address",
            verificationType: "Identity",
        };

        const res = await request(app)
            .post("/api/verification")
            .send(invalidVerificationData)
            .expect("Content-Type", /json/)
            .expect(400);

        expect(res.body).to.have.property("error").that.equals("Verification data is required");
    });
});
