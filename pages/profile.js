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
        <div className="grid grid-cols-6 gap-2 mt-6 mb-6">
            <div className="col-start-3 col-end-5 font-bold text-2xl mb-1 mt-6">Profile</div>
            <div className="col-start-3 col-end-5 text-1xl my-2">Username: {user.username}</div>
            <div className="col-start-3 col-end-5 text-1xl mb-6">Email: {user.attributes.email}</div>
            <div className="col-start-3 col-span-1"><AmplifySignOut /></div>
        </div>
    )
} 
export default withAuthenticator(Profile);