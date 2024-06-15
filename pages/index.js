import { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { listPosts } from "./../src/graphql/queries";
import Link from "next/link";
import Moment from 'react-moment';

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
        <div className="grid grid-cols-6 gap-2 mt-6 mb-6">
            <div className="col-start-2 col-end-6 font-bold text-3xl mb-1 mt-6">Blog Posts</div>
            {posts.map((post, index) => (
                <div className="col-start-2 col-end-6 mt-3">
                    <Link key={index} href={`/posts/${post.id}`}> 
                        <div key={index} className="cursor-pointer border-b pb-3 hover:text-orange-500">
                            <h2 className="font-bold text-2xl mb-1">{post.title}</h2>
                            <p className="text-gray-500">
                                <Moment format="YYYY/MM/DD HH:MM:SS">{post.createdAt}</Moment>
                            </p>
                            <p className="text-gray-500">{post.content}</p>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}
