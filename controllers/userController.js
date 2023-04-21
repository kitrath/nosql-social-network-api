const { Thought, User } = require('../models');

module.exports = {
    // get all users
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // get a single user
    async getSingleUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findOne({ _id: userId })
                .select('-__v')
                .populate({
                    path: "thoughts",
                    select: "-__v",
                })
                .populate({
                    path: "friends",
                    select: "-__v",
                });
            if (!user) {
                return res.status(404).json({
                    message: `No user found with id ${userId}`,
                });
            }
        } catch (err) {
            res.status(500).json(err);
        } 
    },

    async createUser(req, res) {
        try {
            const newUser = await User.create(req.body);
            res.json(newUser);
        } catch (err) {
            res.status(400).json(err);
        }
    },

    async updateUser(req, res) {
        try {
            const filter = { _id: req.params.userId };
            const user = await User.findOneAndUpdate(filter, req.body, {
                new: true,
                runValidators: true,
            });
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // delete a user and all of a user's related thoughts
    async deleteUser(req, res) {
        try {
            const userId = req.params.userId;
            const user = await User.findOneAndDelete({ _id: userId });
            if (!user) {
                return res.status(404).json({
                    message: `No user found with id ${userId}.`
                });
            }
            const thoughts = await Thought.deleteMany({
                _id: {
                    $in: user.thoughts
                }
            });
            res.json({
                message: `User with id ${userId} removed from database`,
            });
        } catch (err) {
            res.status(500).json(err);
        }
    }, 
    // add friend to user's friends list
    async addFriendToUser(req, res) {
        try {
            const { userId, friendId } = req.params;

            const friend = await User.findOne({ _id: friendId });

            if (!friend) {
                return res.status(404).json({
                    message: `No friend found with id ${friendId}`
                });
            }

            if (userId === friendId) {
                return res.status(400).json({
                    message: `User cannot add self to friends`
                });
            }

            const user = await User.findOneAndUpdate(
                { _id: userId },
                {
                    $addToSet: {
                        friends: friendId,
                    }
                },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    message: `No user found with id ${userId}`
                });
            }
            // return user updated with new friend
            res.json(user);
            
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // remove a friend from a user's friends list
    async removeFriendFromUser(req, res) {
        try {
            const { userId, friendId } = req.params;

            const friend = await User.findOne({ _id: friendId });

            if (!friend) {
                return res.status(404).json({
                    message: `No friend found with id ${friendId}.`
                });
            }

            const user = await User.findOneAndUpdate(
                { _id: userId },
                {
                    $pull: {
                        friends: { _id: friendId },
                    },
                },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    message: `No user with id ${userId}`
                });
            }
            // return user with friend removed
            res.json(user);

        } catch (err) {
            res.status(500).json(err);
        }
    }
};