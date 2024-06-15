import { API, Storage } from "aws-amplify";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactMarkDown from "react-markdown";
import "../../configureAmplify";
import { listPosts, getPost } from "../../src/graphql/queries";

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

export default function Post({ post }) {
    const router = useRouter();
    if (router.isFallback) {
        return <div>Loading...</div>
    }

    return (
        <div className="grid grid-cols-6 gap-2 mt-6 mb-6">
            <div className="col-start-2 col-end-6 font-bold text-3xl mb-1 mt-6">{post.title}</div>
            <div className="col-start-5 col-end-6 text-gray-500">{formatDate(post.createdAt)}</div>
            <div className="col-start-5 col-end-6 text-gray-500">By {post.username}</div>
            <div className="col-start-2 col-end-6 mt-3">
                <p ReactMarkDown="prose">{post.content}</p>
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