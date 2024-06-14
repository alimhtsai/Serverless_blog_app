"use client";

import Link from "next/link";
import React from "react";
import "../../configureAmplify";
import { useState, useEffect } from "react";
import { Auth, Hub} from "aws-amplify";

const Navbar = () => {
    const [signedUser, setSignedUser] = useState(false);

    useEffect(() => {
        authListener()
    }, []);

    async function authListener() {
        Hub.listen("auth", (data) => {
            switch (data.payload.event) {
                case "signIn":
                    return setSignedUser(true);
                case "signOut":
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
        <nav className='flex justify-center pt-3 pb-3 space-x-4 bg-light' data-bs-theme="light">
            <a className="flex items-center space-x-4">
                <span className="self-center text-2xl font-semibold me-3">🐈‍⬛ Kiki's Blog</span>
            </a>
            {[
                ["Home", "/"],
                ["Create Post", "/create_post"],
                ["Profile", "/profile"],
            ].map(([title, url], index) => (
                <Link href={url} key={index} className='px-3 py-2 text-1xl font-semibold hover:text-orange-400' legacyBehavior>
                    <a className='px-3 py-2 text-1xl font-semibold hover:text-orange-400'>{title}</a>
                </Link>
            ))}
            {signedUser && (
                <Link href='/my_posts' className='px-3 py-2 text-1xl font-semibold hover:text-orange-400' legacyBehavior>
                    <a className='px-3 py-2 text-1xl font-semibold hover:text-orange-400'>My Posts</a>
                </Link>
            )}
        </nav>
    );
};

export default Navbar;