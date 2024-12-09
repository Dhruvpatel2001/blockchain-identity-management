import request from "supertest";
import { expect } from "chai";
import app from "../../backend/server.js"; // Adjust path if necessary
import Credential from "../../backend/models/Credential.js";

describe("POST /credentials", () => {
    it("should issue a credential", async () => {
        const credentialData = {
            userId: "63e12345abcd1234567890", // Replace with a valid user ID
            serviceProviderId: "63e67890abcd1234567890", // Replace with a valid provider ID
            credentialType: "Degree",
            credentialData: "Bachelor's Degree in Computer Science",
        };

        const res = await request(app)
            .post("/api/credentials/create")
            .send(credentialData)
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body).to.have.property("message").that.equals("Credential issued successfully");
        expect(res.body).to.have.property("credential");
        const credential = await Credential.findOne({ userId: credentialData.userId });
        expect(credential).to.not.be.null;
        expect(credential.credentialType).to.equal(credentialData.credentialType);
    });

    it("should return an error if user does not exist", async () => {
        const invalidCredentialData = {
            userId: "non_existing_user_id",
            serviceProviderId: "63e67890abcd1234567890",
            credentialType: "Degree",
            credentialData: "Bachelor's Degree in Computer Science",
           // address: "0x790Bbe12Bca278AaAc961f2484198Dc0E7C89396"
        };

        const res = await request(app)
            .post("/api/credentials/create")
            .send(invalidCredentialData)
            .expect("Content-Type", /json/)
            .expect(400);

        expect(res.body).to.have.property("error").that.equals("User not found");
    });

    it("should return an error if data is missing", async () => {
        const invalidCredentialData = {
            userId: "63e12345abcd1234567890", // Replace with a valid user ID
        };

        const res = await request(app)
            .post("/api/credentials/create")
            .send(invalidCredentialData)
            .expect("Content-Type", /json/)
            .expect(400);

        expect(res.body).to.have.property("error").that.equals("Credential data is required");
    });
});

