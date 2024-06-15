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
        <div className="mt-16 mb-6 ml-16 me-16">
            <h1 className="text-black text-3xl font-bold mb-3 mt-6">Blog Posts</h1>
                {posts.map((post, index) => (
                    <div key={index}>
                        <h2 className="font-bold text-2xl mb-1 mt-3">{post.title}</h2>
                        <p className="text-gray-500">{post.createdAt}</p>
                        <p className="text-orange-600">{post.content}</p>
                    </div>
                ))}
        </div>
    );
}
