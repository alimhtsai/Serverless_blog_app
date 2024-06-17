"use client";

import Link from "next/link";
import React from "react";
import "../../configureAmplify";
import { useState, useEffect } from "react";
import { Auth, Hub} from "aws-amplify";

const Navbar = () => {
    const [signedUser, setSignedUser] = useState(false);
    const [username, setUserName] = useState([]);

    useEffect(() => {
        authListener();
        getUserName();
    }, []);

    async function getUserName() {
        const { username } = await Auth.currentAuthenticatedUser();
        setUserName(username);
    }

    async function authListener() {
        Hub.listen("auth", (data) => {
            switch (data.payload.event) {
                case "signIn":
                    getUserName();
                    return setSignedUser(true);
                case "signOut":
                    setUserName([]);
                    return setSignedUser(false);
            }
        })
        try {
            await Auth.currentAuthenticatedUser()
            setSignedUser(true)
        } catch(err) {
            console.error(err);
        }
    }

    return (
        <nav className='flex justify-center pt-3 pb-3 space-x-4 bg-neutral-400'>
            <a className="flex items-center space-x-4">
                <span className="self-center text-2xl font-semibold me-3">🐈‍⬛ Kiki's Blog</span>
            </a>
            {[
                ["Home", "/"],
                ["Create Post", "/create_post"],
            ].map(([title, url], index) => (
                <Link href={url} key={index} className='px-3 py-2 text-1xl font-semibold hover:text-white' legacyBehavior>
                    <a className='px-3 py-2 text-1xl font-semibold hover:text-white'>{title}</a>
                </Link>
            ))}
            <div class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                <Link href={`/profile`} className='px-3 py-2 text-1xl font-semibold hover:text-white' legacyBehavior>
                    <a className='px-3 py-2 text-1xl underline'>Hi! <b className="hover:text-white">{username}</b></a>
                </Link>
            </div>
            {signedUser && (
                <Link href='/my_posts' className='px-3 py-2 text-1xl font-semibold hover:text-white' legacyBehavior>
                    <a className='px-3 py-2 text-1xl font-semibold hover:text-white'>My Posts</a>
                </Link>
            )}
        </nav>
    );
};

export default Navbar;