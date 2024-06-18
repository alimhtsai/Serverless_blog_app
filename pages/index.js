import { useState, useEffect } from "react";
import { API, Storage } from "aws-amplify";
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
        const { items } = postData.data.listPosts;
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

    return (
        <div className="grid grid-cols-6 gap-2 mt-6 mb-6">
            <div className="col-start-2 col-end-6 font-bold text-3xl mb-1 mt-6">Blog Posts</div>
            {posts.map((post, index) => (
                <div className="col-start-2 col-end-6 mt-3">
                    <Link key={index} href={`/posts/${post.id}`}>
                        {post.coverImage && (
                            <img src={post.coverImage}
                            className="object-cover w-44 bg-contain bg-center sm:mx-0 sm:shrink-0 mb-2"/>
                        )}
                        <div key={index} className="cursor-pointer border-b pb-3 hover:text-orange-500">
                            <h2 className="font-bold text-2xl mb-1">{post.title}</h2>
                            <p className="text-gray-500">
                                <Moment format="YYYY/MM/DD HH:MM:SS">{post.createdAt}</Moment>
                                <p>By {post.username}</p>
                            </p>
                            <p className="text-black">
                                {post.content.length > 100 ? post.content.substring(0, 100) + ' ... (more)' : post.content}
                            </p>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}
