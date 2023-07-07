import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
    try{
        const posts = await PostModel.find().populate('user').exec();

        res.status(200).json(posts)
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Error to get all posts"
        });
    }
}

export const getOne = async (req, res) => {
    try{
        const postId = req.params.id;

        await PostModel.findOneAndUpdate({
            _id : postId
        },
        {
            $inc: { viewsCount: 1 }
        },
        {
            returnDocument: 'after'
        }).populate('user')
            .then(doc =>  {

                if(!doc){
                    return res.status(404).json({
                        message: "Post not found"
                    });
                }

                res.status(200).json(doc)
            })
            .catch(err => {
                if(err){
                    console.log(err);
                    return res.status(500).json({
                        message: "Error to get post"
                    });
                }
            });


    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Error to get post"
        });
    }
}

export const remove = async (req, res) => {
    try{
        const postId = req.params.id;

        await PostModel.findOneAndDelete({
            _id: postId
        })
            .then(doc => {
                if(!doc){
                    return res.status(404).json({
                        message: "Error to find post"
                    });
                }

                return res.status(200).json({
                    success: true
                });
            })
            .catch(err => {
                console.log(err);
                return res.status(500).json({
                    message: "Error to delete post"
                });
            })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Error to delete post"
        });
    }
}

export const create = async (req, res) => {
    try{
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        });

        const post = await doc.save();

        res.status(201).json(post);
    }catch (err){
        console.log(err);
        res.status(500).json({
            message: "Error to create new post"
        });
    }
}

export const update = async (req, res) => {
    try{
        const postId = req.params.id;

        await PostModel.updateOne({
            _id: postId
        },
 {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.userId,
            tags: req.body.tags,
        })
            .then(doc => {
                return res.status(200).json({
                    success: true
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    message: "Error to update post"
                });
            });
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Error to update post"
        });
    }
}