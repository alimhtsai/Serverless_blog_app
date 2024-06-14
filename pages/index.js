import { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { listPosts } from "./../src/graphql/queries";

export default function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    })

    async function fetchPosts() {
        const postData = await API.graphql({
            query: listPosts
        });
        setPosts(postData.data.listPosts.items);
    }

    return (
        <div className="mt-3 mb-3 ml-5">
            <h1 className="text-black text-2xl font-bold mb-3 mt-6">Blog Posts</h1>
                {posts.map((post, index) => (
                    <div key={index}>
                        <h2 className="font-bold">{post.title}</h2>
                        <p className="mb-3">{post.content}</p>
                    </div>
                ))}
        </div>
    );
}
