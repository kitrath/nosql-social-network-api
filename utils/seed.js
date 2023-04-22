const connection = require('../config/connection');
const { Thought, User } = require('../models');
const { Types } = require('mongoose');

const NUMBER = 8;

const getRandom = (max) => Math.floor(Math.random() * max);

const thoughtTexts = [
    "It's really great what they've been doing politically lately.  I like it!",
    "It's really terrible what they've been doing politically lately. I don't like it!",
    "I wish that we could all just ignore politics.  Everyone would be so much happier!",
    "We should all be more politically active.  It's important to the well-being of our communties.",
    "Technology is important.  Everyone should learn how to code!",
    "Let's go back to the kind of lifestyle where we spend most of our time reading books."
];

const thoughtsLength = thoughtTexts.length;

const reactionBodies = [
    "No, I don't agree.",
    "Very much so. I emphatically agree!",
    "I disagree with the way you said it.",
    "I like the way you said that."
];

const reactionsLength = reactionBodies.length;

connection.on('error', (err) => err);

connection.once('open', async () => {

    // Drop Thoughts
    await Thought.deleteMany({});

    // Drop Users
    await User.deleteMany({});

    const initArray = [...Array(NUMBER).keys()];

    const initialUsers = initArray.map((userNum) => {
        const username = `user${userNum}`;
        return {
            _id: new Types.ObjectId(),
            username,
            email: `${username}@example.com`,
        };
    });

    const usersLength = initialUsers.length;

    const thoughts = initArray.map((elem) => {
        const reactionList = [...Array(getRandom(4)).keys()]
        return {
            _id: new Types.ObjectId(),
            thoughtText: thoughtTexts[getRandom(thoughtsLength)],
            username: initialUsers[getRandom(usersLength)].username,
            reactions: reactionList.map((elem) => {
                return {
                    reactionId: new Types.ObjectId(),
                    reactionBody: reactionBodies[getRandom(reactionsLength)],
                    username: initialUsers[getRandom(usersLength)].username,
                };
            }),
        };
    });

    // Add thoughts [thought._id] and friends [user._id] to user
    const users = initialUsers.map((user) => {
        const userThoughts = thoughts.filter((thought) => {
            return thought.username === user.username
        });

        // Creates a list of random users excluding current user
        const userFriends = initialUsers.filter((friend) => {
            const randomNumber = getRandom(NUMBER);
            return user.username !== friend.username && (randomNumber % 2 === 0);
        });

        user.thoughts = userThoughts.map((thought) => {
            return thought._id;
        });

        user.friends = userFriends.map((user) => {
            return user._id;
        });

        return user;
    });

    const userDocs = await User.collection.insertMany(users);
    const thoughtDocs = await Thought.collection.insertMany(thoughts);

    console.log(userDocs);
    console.log(thoughtDocs);

    console.info("Seeding complete! 🌱");
    process.exit(0);
});