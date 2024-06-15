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
        <div className="mt-16 mb-6 ml-16 me-16">
            <h1 className="font-bold text-3xl mb-1 mt-3">🎉 You just post something to Kiki's land! 🎊</h1>
            <h2 className="font-bold text-2xl mb-1 mt-3 text-orange-600">{post.title}</h2>
            <p className="text-orange-600">{formatDate(post.createdAt)}</p>
            <p className="text-orange-600">{post.content}</p>
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
        props: {post: postData.data.getPost}
    }
}