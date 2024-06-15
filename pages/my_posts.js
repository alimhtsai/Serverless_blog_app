import { API, Auth } from "aws-amplify";
import { useEffect, useState } from "react";
import { postsByUsername } from "@/src/graphql/queries";
import Link from "next/link";
import { withAuthenticator } from "@aws-amplify/ui-react";

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

function MyPosts() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fecthPosts()
    }, []);

    async function fecthPosts() {
        const { username } = await Auth.currentAuthenticatedUser();
        const postData = await API.graphql({
            query: postsByUsername,
            variables: { username }
        })
        console.log(username, postData);
        setPosts(postData.data.postsByUsername.items)
    }

    return (
        <div className="grid grid-cols-6 gap-2 mt-6 mb-6">
            <div className="col-start-2 col-end-6 font-bold text-3xl mb-1 mt-6">My Posts</div>
            {posts.map((post, index) => (
                <div className="col-start-2 col-end-6 mt-3">
                    <Link key={index} href={`/posts/${post.id}`}>
                        <div key={index} className="cursor-pointer border-b pb-3 hover:text-orange-500">
                            <h2 className="font-bold text-2xl mb-1">{post.title}</h2>
                            <p className="text-gray-500">{formatDate(post.createdAt)}</p>
                            <p className="text-gray-500">{post.content}</p>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    )
}
export default withAuthenticator(MyPosts);