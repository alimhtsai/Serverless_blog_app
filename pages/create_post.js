import { withAuthenticator } from "@aws-amplify/ui-react";
import { useState, useRef, React } from "react";
import { API, input, Auth, Storage } from "aws-amplify";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";
import { createPost } from "@/src/graphql/mutations";
import dynamic from "next/dynamic";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});
// import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const initialState = { title: "", content: ""};
function CreatePost() {
    const [post, setPost] = useState(initialState);
    const { title, content } = post;
    const router = useRouter();
    const [image, setImage] = useState(null);
    const imageFileInput = useRef(null);

    function onChange(e) {
        setPost(() => ({
            ...post, [e.target.name]: [e.target.value]
        }))
    }

    async function createNewPost() {
        if (!title || !content) return;
        const id = uuid();
        post.id = id;

        if (image) {
            const filename = `${image.name}_${uuid()}`
            post.coverImage = filename;
            await Storage.put(filename, image);
        }

        const { username } = await Auth.currentAuthenticatedUser();
        post.username = username;

        await API.graphql({
            query: createPost, 
            variables: { input: post },
            authMode: "AMAZON_COGNITO_USER_POOLS"
        })
        router.push(`/posts/${id}`)
    }
    
    async function uploadImage() {
        imageFileInput.current.click();
    }

    function handleChange(e) {
        const fileUploaded = e.target.files[0];
        if (!fileUploaded) return;
        setImage(fileUploaded);
    }

    return (
        <div className="grid grid-cols-6 gap-2 mt-6 mb-6">
            <div className="col-start-2 col-end-6 font-bold text-3xl mb-1 mt-6">Create a New Post</div>
            <div className="col-start-2 col-end-6">
                <input
                    onChange={onChange}
                    name="title"
                    placeholder="Title"
                    value={post.title}
                    className="border-b pb-2 text-lg my-4 focus:outline-none w-full 
                            font-light text-gray-500 placeholder-gray-500 y-2"
                />
                {image && (
                    <img 
                        src={URL.createObjectURL(image)}
                        className="my-4"
                    ></img>
                )}
                <SimpleMDE
                    value={post.content}
                    onChange={(value) =>
                        setPost({...post, content: value})
                    }
                />
                <input 
                    type="file"
                    ref={imageFileInput}
                    className="absolute w-0 h-0"
                    onChange={handleChange}
                />
                <button type="button" 
                        className="btn btn-outline-dark mb-4 font-semibold px-8 py-2 rounded me-3" 
                        onClick={uploadImage}>
                    Upload Cover Image
                </button>
                <button type="button" 
                        className="btn btn-dark mb-4 font-semibold px-8 py-2 rounded" 
                        onClick={createNewPost}>
                    POST
                </button>
            </div>
        </div>
    )
}
export default withAuthenticator(CreatePost);