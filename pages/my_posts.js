import { API, Auth, Storage } from "aws-amplify";
import { useEffect, useState } from "react";
import { postsByUsername } from "@/src/graphql/queries";
import Link from "next/link";
import { withAuthenticator } from "@aws-amplify/ui-react";
import Moment from 'react-moment';
import { deletePost as deletePostMutation } from "@/src/graphql/mutations"
import { useRouter } from "next/router";

function MyPosts() {
    const [posts, setPosts] = useState([]);
    const router = useRouter();

    useEffect(() => {
        fecthPosts()
    }, []);

    async function fecthPosts() {
        const { username } = await Auth.currentAuthenticatedUser();
        const postData = await API.graphql({
            query: postsByUsername,
            variables: { username }
        })
        const { items } = postData.data.postsByUsername;
        const postWithImage = await Promise.all(
            items.map(async (post) => {
                if (post.coverImage) {
                    post.coverImage = await Storage.get(post.coverImage);
                }
                return post;
            })
        )
        setPosts(postWithImage);
    }

    async function deletePost(id) {
        alert("Are you sure you want to delete the post?");
        await API.graphql({
            query: deletePostMutation,
            variables: { input: {id} },
            authMode: "AMAZON_COGNITO_USER_POOLS"
        });
        fecthPosts();
        router.push(`/my_posts`);
    }

    return (
        <div className="grid grid-cols-6 gap-2 mt-6 mb-6">
            <div className="col-start-2 col-end-6 font-bold text-3xl mb-1 mt-6">My Posts</div>
            {posts.map((post, index) => (
                <div className="col-start-2 col-end-6 mt-3">
                    {post.coverImage && (
                        <img src={post.coverImage}
                        className="object-cover w-44 bg-contain bg-center sm:mx-0 sm:shrink-0 mb-2"/>
                    )}
                    <Link key={index} href={`/posts/${post.id}`}>
                        <div key={index} className="cursor-pointer border-b pb-3">
                            <h2 className="font-bold text-2xl mb-1 hover:text-orange-500">
                                {post.title}
                            </h2>
                            <p className="text-gray-500 hover:text-orange-500">
                                <Moment format="YYYY/MM/DD HH:MM:SS">
                                    {post.createdAt}
                                </Moment>
                            </p>
                            <p className="text-black-700 hover:text-orange-500">
                                {post.content.length > 100 ? post.content.substring(0, 100) + ' ... (more)' : post.content}
                            </p>
                            <button className='btn btn-outline-primary cursor-pointer text-sm mr-4 mt-2 rounded'>
                                <Link href={`/edit_post/${post.id}`}>
                                    Edit Post
                                </Link>
                            </button>
                            <button className='btn btn-outline-warning cursor-pointer text-sm mr-4 mt-2 rounded' 
                                onClick={() => deletePost(post.id)}
                            >
                                Delete Post
                            </button>
                        </div>
                    </Link>
                    
                </div>
            ))}
        </div>
    )
}
export default withAuthenticator(MyPosts);