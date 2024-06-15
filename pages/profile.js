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
        <div className="mt-16 mb-6 ml-16 me-16">
            <h1 className="text-3xl font-bold mb-3 mt-6">Profile</h1>
            <div className="font-semibold text-2xl my-2">Username: 
                <b className="text-orange-600"> {user.username}</b>
            </div>
            <div className="font-semibold text-2xl mb-6">Email: 
                <b className="text-orange-600"> {user.attributes.email}</b>
            </div>
            <div className="col-2"><AmplifySignOut /></div>
        </div>
    )
} 
export default withAuthenticator(Profile);