import { signOut } from "next-auth/react";
export default function LogOut(){
return (
    <div>
<button onClick={() => signOut()}>Logout</button>

    </div>
)
}
