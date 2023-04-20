const { Thought, User } = require('../models');

module.exports = {
    // get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(400).json(err);
        }
    },

    // get thought by id
    async getSingleThought(req, res) {
        try {
            const thoughtId = req.params.id;
            const thought = await Thought.findOne({ _id: thoughtId });

            if (!thought) {
                return res.status(404).json({
                    message: `No thought found with id ${thoughtId}`,
                });
            }

            res.json(thought);

        } catch (err) {
            res.status(500).json(err);
        }
    },

    // create thought
    async createThought(req, res) {
        try {
            const username = req.body.username;
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                { username },
                { $push: { thoughts: thought._id }},
                { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    message: `No user with username ${username}`,
                });
            }

            res.json(thought);

        } catch (err) {
            res.status(400).json(err);
        }
    },

    // update thought
    async updateThought(req, res) {
        try {
            const thoughtId = req.params.id;
            const thought = await Thought.findOneAndUpdate(
                { _id: thoughtId },
                req.body,
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({
                    message: `No thought found with id ${thoughtId}`,
                });
            }
        
            res.json(thought);

        } catch (err) {
            res.status(400).json(err);
        }
    },

    // delete thought
    async deleteThought(req, res) {
        try {
            const thoughtId = req.params.id;
            const thought = findOneAndRemove({ _id: thoughtId });

            if (!thought) {
                return res.status(404).json({
                    message: `No thought found with id ${thoughtId}`,
                });
            }

            await User.findOneAndUpdate(
                { username: thought.username },
                { $pull: { thoughts: thought._id } },
                { new: true },
            );

            res.json({ 
                message: `Thought with id ${thoughtId} removed from database`,
            });
        } catch {
            res.status(500).json(err);
        }
    }
};