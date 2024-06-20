import { API, Auth, Hub, Storage } from "aws-amplify";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactMarkDown from "react-markdown";
import "../../configureAmplify";
import { listPosts, getPost } from "../../src/graphql/queries";
import Moment from 'react-moment';
import { createComment } from "@/src/graphql/mutations";
import dynamic from "next/dynamic";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});
import "easymde/dist/easymde.min.css";
import { v4 as uuid } from "uuid";

const initialState = { message: "" };

export default function Post({ post }) {
    const router = useRouter();
    const [coverImage, setCoverImage] = useState(null);
    const [comment, setComment] = useState(initialState);
    const [showMe, setShowMe] = useState(false);
    const { message } = comment;

    function toggle() {
        setShowMe(!showMe);
    }

    useEffect(() => {
        updateCoverImage();
    }, []);

    async function updateCoverImage() {
        if (post.coverImage) {
            const imageKey = await Storage.get(post.coverImage);
            setCoverImage(imageKey);
        }
    }
    
    if (router.isFallback) {
        return <div>Loading...</div>
    }

    async function createTheComment() {
        if (!message) return;
        const id = uuid();
        comment.id = id;

        try {
            await API.graphql({
                query: createComment,
                variables: { input: comment },
                authMode: "AMAZON_COGNITO_USER_POOLS"
            })
        } catch (error) {
            console.error(error);
        }
        router.push("/my_posts");
    }

    return (
        <div className="grid grid-cols-6 gap-2 mt-6 mb-6">
            <div className="col-start-2 col-end-6 font-bold text-3xl mb-1 mt-6">
                {post.title}
            </div>
            <div className="col-start-5 col-end-6 text-gray-500">
                <Moment format="YYYY/MM/DD HH:MM:SS">
                    {post.createdAt}
                </Moment>
            </div>
            <div className="col-start-5 col-end-6 text-gray-500">
                By {post.username}
            </div>
            <div className="col-start-2 col-end-6">
                {coverImage && (
                    <img 
                        src={coverImage}
                        className="mt-4"
                    />
                )}
            </div>
            <div className="col-start-2 col-end-6 mt-3">
                <ReactMarkDown className="prose" children={post.content}/>
            </div>
            <div className="col-start-2 col-end-6 mt-3">

            </div>
            <div className="col-start-2 col-end-6">
                <button type="button" 
                        className="btn btn-dark mb-4 font-semibold px-8 py-2 rounded" 
                        onClick={toggle}>
                    Write A Comment
                </button>
                {
                    <div 
                        className="col-start-2 col-end-6"
                        style={{display: showMe ? "block" : "none"}}>
                        <SimpleMDE
                            value={comment.message}
                            onChange={(value) => 
                                setComment({...comment, message: value, postID: post.id})
                            }>
                        </SimpleMDE>
                        <button type="button" 
                                className="btn btn-dark mb-4 font-semibold px-8 py-2 rounded" 
                                onClick={createTheComment}>
                            Save
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}

export async function getStaticPaths() {
    const postData = await API.graphql({
        query: listPosts
    })
    const paths = postData.data.listPosts.items.map(post => ({
        params: {id: post.id}
    }))
    return {
        paths,
        fallback: true
    }
}

export async function getStaticProps({ params }) {
    const {id} = params
    const postData = await API.graphql({
        query: getPost,
        variables: {id}
    })
    return {
        props: {post: postData.data.getPost},
        revalidate: 1
    }
}