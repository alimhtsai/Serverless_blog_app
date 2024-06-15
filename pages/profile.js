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
            <div className="col-start-2 col-end-6 font-bold text-3xl mb-1 mt-6">Profile</div>
            <div className="col-start-2 col-end-6 font-semibold text-2xl my-2">Username: 
                <b className="text-orange-600"> {user.username}</b>
            </div>
            <div className="col-start-2 col-end-6 font-semibold text-2xl mb-6">Email: 
                <b className="text-orange-600"> {user.attributes.email}</b>
            </div>
            <div className="col-start-2 col-span-1"><AmplifySignOut /></div>
        </div>
    )
} 
export default withAuthenticator(Profile);