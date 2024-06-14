import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import { useState, useEffect } from "react";

function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkUser();
    }, []);

    async function checkUser() {
        const user = await Auth.currentAuthenticatedUser();
        setUser(user);
    }

    if (!user) {
        return null;
    } 

    return (
        <div className="m-6">
            <h1 className="text-black text-2xl font-bold mb-3 mt-6">Profile</h1>
            <div className="font-semibold text-1xl text-black my-2">Username: {user.username}</div>
            <div className="font-semibold text-1xl text-black mb-6">Email: {user.attributes.email}</div>
            <div className="col-2"><AmplifySignOut /></div>
        </div>
    )
} 
export default withAuthenticator(Profile);