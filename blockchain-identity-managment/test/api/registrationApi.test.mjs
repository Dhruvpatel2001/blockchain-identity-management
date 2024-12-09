import request from "supertest";
import { expect } from "chai";
import app from "../../backend/server.js";
import mongoose from "mongoose";
import User from "../../backend/models/User.js";

describe("POST /register", function () {
    this.timeout(10000); // Set a global timeout of 10 seconds

    before(async function () {
        this.timeout(10000);
        try {
            console.log("Connecting to MongoDB...");
            await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log("MongoDB connected successfully");
        } catch (error) {
            console.error("MongoDB connection failed:", error);
        }
    });

    afterEach(async function () {
        this.timeout(10000);
        await User.deleteMany({});
    });

    after(async function () {
        this.timeout(10000);
        try {
            await mongoose.connection.close();
        } catch (error) {
            console.error("Error closing MongoDB connection:", error);
        }
    });

    it("should register a new user", async () => {
        const newUser = {
            name: "User 1",
            email: "user1@example.com",
            address: "0x790Bbe12Bca278AaAc961f2484198Dc0E7C89396",
        };

        const res = await request(app)
            .post("/api/register")
            .send(newUser)
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body).to.have.property("message").that.equals(
            "User registered successfully in MongoDB and private blockchain!"
        );
        const user = await User.findOne({ email: newUser.email });
        expect(user).to.not.be.null;
        expect(user.name).to.equal(newUser.name);
    });
});

