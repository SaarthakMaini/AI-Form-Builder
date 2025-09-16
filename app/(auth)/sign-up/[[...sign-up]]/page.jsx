import { SignUp } from "@clerk/nextjs";

export default function Page(){
    return (
    <div className="flex items-center justify-center min-h-screen">
        <SignUp path="/sign-up" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard"/>
    </div>
    )
}