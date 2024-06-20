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

                        <div key={index} className="col-start-2 col-end-6 cursor-pointer border-b pb-3">
                            <h2 className="font-bold text-2xl mb-1 hover:text-orange-500">{post.title}</h2>
                            <p className="text-gray-500 hover:text-orange-500">
                                <Moment format="YYYY/MM/DD HH:MM:SS">{post.createdAt}</Moment>
                                <p>By {post.username}</p>
                            </p>
                            <p className="text-black-700 hover:text-orange-500">
                                {post.content.length > 140 ? post.content.substring(0, 140) + ' ... (more)' : post.content}
                            </p>
                            {
                                post.comments.items.length > 0 && post.comments.items.map((comment, index) => (
                                    <div key={index} className="shadow-inner mt-3 mb-3 pl-3 pt-1 pb-2 rounded-xl hover:shadow-lg" >
                                        <div>
                                            <p className="text-gray-500 mt-2">
                                            <b>{comment.createdBy} says: &nbsp;</b>{comment.message} 
                                            </p>
                                            
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}
