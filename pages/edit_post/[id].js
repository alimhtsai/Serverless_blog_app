import { useEffect, useState, useRef } from "react";
import { API, Storage } from "aws-amplify";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});
// import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { updatePost } from "../../src/graphql/mutations";
import { getPost } from "../../src/graphql/queries";
import { v4 as uuid } from "uuid";

function EditPost() {
    const [post, setPost] = useState(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        fetchPost();
        async function fetchPost() {
            if (!id) return;
            const postData = await API.graphql({
                query: getPost,
                variables: { id }
            })
            setPost(postData.data.getPost)
        }
    }, [id]);

    if (!post) return null;

    function onChange(e) {
        setPost(() => ({...post, [e.target.name]: e.target.value}));
    }

    const { title, content } = post;

    async function updateCurrentPost() {
        if (!title || !content) return;
        const postUpdated = {
            id,
            content,
            title
        }
        await API.graphql({
            query: updatePost,
            variables: { input: postUpdated },
            authMode: "AMAZON_COGNITO_USER_POOLS"
        })
        router.push("/my_posts");
    }

    return (
        <div className="grid grid-cols-6 gap-2 mt-6 mb-6">
            <div className="col-start-2 col-end-6 font-bold text-3xl mb-1 mt-6">Edit Post</div>
            <div className="col-start-2 col-end-6 mt-3">
                <input
                    onChange={onChange}
                    name="title"
                    placeholder="Title"
                    value={post.title}
                    className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
                />
                <SimpleMDE
                    value={post.content}
                    onChange={(value) => setPost({...post, content: value})}
                />
                <button type="button" 
                        className="btn btn-dark mb-4 font-semibold px-8 py-2 rounded" 
                        onClick={updateCurrentPost}>
                    UPDATE
                </button>
            </div>
        </div>
    )
}
export default EditPost;